"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { CheckoutSchema } from "./schemas";
import { buildWhatsappUrl } from "@/lib/whatsapp/build-url";
import { generateOrderNumber } from "@/lib/order-number";

export async function placeOrder(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  const data = CheckoutSchema.parse(input);
  const userId = session.user.id;

  // Get cart
  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Validate promo code if provided
  let promoCode = null;
  let discountAmount = 0;
  let shippingFee = 5; // default $5 delivery

  if (data.promoCode) {
    promoCode = await db.promoCode.findFirst({
      where: {
        code: data.promoCode.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        AND: [
          {
            OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
          },
          {
            OR: [
              { maxUses: null },
              // usedCount < maxUses — filter is approximate; exact check below
              { maxUses: { gt: 0 } },
            ],
          },
        ],
      },
    });

    // Strict maxUses check after fetch
    if (promoCode && promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      promoCode = null;
    }
  }

  // Calculate totals from DB prices (never trust client)
  const subtotal = cart.items.reduce((sum: number, item: typeof cart.items[number]) => {
    const price = Number(
      item.product.isOnSale && item.product.salePrice
        ? item.product.salePrice
        : item.product.basePrice
    );
    return sum + price * item.quantity;
  }, 0);

  if (promoCode) {
    if (promoCode.discountType === "PERCENTAGE" && promoCode.discountValue) {
      discountAmount = subtotal * (Number(promoCode.discountValue) / 100);
    } else if (promoCode.discountType === "FREE_SHIPPING") {
      shippingFee = 0;
    }
    if (
      promoCode.minOrderAmount &&
      subtotal < Number(promoCode.minOrderAmount)
    ) {
      throw new Error(
        `Minimum order amount is $${promoCode.minOrderAmount}`
      );
    }
  }

  const total = subtotal - discountAmount + shippingFee;

  // Handle address
  let addressId: string | null = null;
  if (data.addressId) {
    addressId = data.addressId;
  } else if (data.newAddress) {
    const addr = await db.address.create({
      data: {
        userId,
        ...data.newAddress,
        isDefault: data.saveAddress,
      },
    });
    addressId = addr.id;
  }

  // Get next order sequence
  const orderCount = await db.order.count();
  const orderNumber = generateOrderNumber(orderCount + 1);

  // Create order in transaction
  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        promoCodeId: promoCode?.id ?? null,
        status: "PENDING",
        subtotal,
        shippingFee,
        discountAmount,
        total,
        customerName: data.customerName,
        customerEmail: session.user.email!,
        customerPhone: data.customerPhone,
        deliveryNotes: data.deliveryNotes,
        items: {
          create: cart.items.map((item: typeof cart.items[number]) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice:
              item.product.isOnSale && item.product.salePrice
                ? item.product.salePrice
                : item.product.basePrice,
            lineTotal:
              Number(
                item.product.isOnSale && item.product.salePrice
                  ? item.product.salePrice
                  : item.product.basePrice
              ) * item.quantity,
            productName_en: item.product.name_en,
            productName_ar: item.product.name_ar,
            basketConfig: item.basketConfig ?? undefined,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const item of cart.items as typeof cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    // Increment promo usage
    if (promoCode) {
      await tx.promoCode.update({
        where: { id: promoCode.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  // Build WhatsApp URL
  const address = addressId
    ? await db.address.findUnique({ where: { id: addressId } })
    : null;

  const whatsappUrl = buildWhatsappUrl({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    total: order.total.toString(),
    deliveryNotes: address
      ? `${address.line1}, ${address.city}, ${address.governorate}`
      : order.deliveryNotes,
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
      lineTotal: item.lineTotal.toString(),
    })),
  });

  return { orderId: order.id, whatsappUrl };
}

export async function validatePromoCode(code: string, subtotal: number) {
  const promo = await db.promoCode.findFirst({
    where: {
      code: code.toUpperCase(),
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
  });
  if (!promo) return { valid: false, message: "Invalid promo code" };
  if (
    promo.minOrderAmount &&
    subtotal < Number(promo.minOrderAmount)
  ) {
    return {
      valid: false,
      message: `Minimum order $${promo.minOrderAmount}`,
    };
  }
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return { valid: false, message: "Promo code has reached its limit" };
  }
  return {
    valid: true,
    discountType: promo.discountType,
    discountValue: promo.discountValue ? Number(promo.discountValue) : null,
    message:
      promo.discountType === "FREE_SHIPPING"
        ? "Free delivery applied!"
        : `${promo.discountValue}% discount applied!`,
  };
}
