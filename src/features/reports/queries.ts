import { db } from "@/lib/db";

export async function getRevenueStats(startDate?: Date, endDate?: Date) {
  const where = {
    status: "DELIVERED" as const,
    ...(startDate || endDate
      ? {
          createdAt: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  };

  const orders = await db.order.findMany({
    where,
    select: { total: true, discountAmount: true },
  });
  const totalRevenue = orders.reduce((s: number, o: { total: unknown }) => s + Number(o.total), 0);

  return { totalRevenue, orderCount: orders.length };
}

export async function getOrdersByStatus() {
  return db.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
}

export async function getLowStockProducts() {
  // Prisma doesn't support column-to-column comparisons in `where` directly,
  // so we fetch active products and filter in JS.
  const products = await db.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name_en: true,
      name_ar: true,
      stockQty: true,
      lowStockThreshold: true,
    },
  });
  return products.filter((p: { stockQty: number; lowStockThreshold: number }) => p.stockQty <= p.lowStockThreshold);
}

export async function getRecentOrders(limit = 10) {
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { select: { quantity: true, lineTotal: true } },
      user: { select: { name: true } },
    },
  });
}
