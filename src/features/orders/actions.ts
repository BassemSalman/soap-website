"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { UpdateOrderStatusSchema, ManualOrderSchema } from "./schemas";
import { generateOrderNumber } from "@/lib/order-number";

export async function updateOrderStatus(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const { orderId, status, note } = UpdateOrderStatusSchema.parse(input);
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: { status, statusUpdatedAt: new Date() },
    }),
    db.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: order.status,
        toStatus: status,
        note,
        changedBy: session.user.id,
      },
    }),
  ]);
  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
}

export async function markWhatsappSent(orderId: string) {
  await db.order.update({
    where: { id: orderId },
    data: { whatsappSent: true, whatsappSentAt: new Date() },
  });
}

export async function createManualOrder(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const data = ManualOrderSchema.parse(input);

  // Fetch products from DB to get real prices
  const products = await db.product.findMany({
    where: { id: { in: data.items.map((i) => i.productId) }, isActive: true },
  });

  // Validate promo code if provided
  let promoCode = null;
  let discountAmount = 0;
  const shippingFee = 5;

  if (data.promoCode) {
    promoCode = await db.promoCode.findFirst({
      where: {
        code: data.promoCode.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });
    if (promoCode && promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      promoCode = null;
    }
  }

  const subtotal = data.items.reduce((sum, item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = products.find((p: any) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const price = Number(
      product.isOnSale && product.salePrice ? product.salePrice : product.basePrice
    );
    return sum + price * item.quantity;
  }, 0);

  if (promoCode) {
    if (promoCode.discountType === "PERCENTAGE" && promoCode.discountValue) {
      discountAmount = subtotal * (Number(promoCode.discountValue) / 100);
    }
  }

  const total = subtotal - discountAmount + shippingFee;

  // Create a guest-like user record or find by email
  let userId = session.user.id; // default to admin; override if customer exists
  const existingUser = await db.user.findUnique({ where: { email: data.customerEmail } });
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const newUser = await db.user.create({
      data: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        role: "CUSTOMER",
      },
    });
    userId = newUser.id;
  }

  // Create address
  const address = await db.address.create({
    data: {
      userId,
      line1: data.addressLine,
      city: data.city,
      governorate: data.governorate,
    },
  });

  const orderCount = await db.order.count();
  const orderNumber = generateOrderNumber(orderCount + 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await db.$transaction(async (tx: any) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: address.id,
        promoCodeId: promoCode?.id ?? null,
        status: "PENDING",
        subtotal,
        shippingFee,
        discountAmount,
        total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryNotes: data.deliveryNotes,
        adminNotes: "Manual order entered by admin",
        items: {
          create: data.items.map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const product = (products as any[]).find((p) => p.id === item.productId)!;
            const unitPrice = Number(
              product.isOnSale && product.salePrice ? product.salePrice : product.basePrice
            );
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice,
              lineTotal: unitPrice * item.quantity,
              productName_en: product.name_en,
            };
          }),
        },
      },
    });

    // Decrement stock
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    if (promoCode) {
      await tx.promoCode.update({
        where: { id: promoCode.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  revalidatePath("/admin/orders");
  return { orderId: order.id, orderNumber: order.orderNumber };
}
