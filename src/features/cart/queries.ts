import { db } from "@/lib/db";

export async function getCart(userId: string) {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true } } },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!cart) return null;
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        basePrice: item.product.basePrice?.toString() ?? "0",
        salePrice: item.product.salePrice != null ? item.product.salePrice.toString() : null,
      },
    })),
  };
}

export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: { select: { quantity: true } } },
  });
  return cart?.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) ?? 0;
}
