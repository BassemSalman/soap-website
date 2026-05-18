import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma";

// ─── Serialization ───────────────────────────────────────────────────────────
// Prisma Decimal fields cannot cross the server→client boundary.
// Omit them and re-add as string so Next.js can safely serialize.

type SerializedDecimal = string;

type SerializedOrderItem<T extends { unitPrice: Prisma.Decimal; lineTotal: Prisma.Decimal }> =
  Omit<T, "unitPrice" | "lineTotal"> & {
    unitPrice: SerializedDecimal;
    lineTotal: SerializedDecimal;
  };

type SerializedOrder<
  T extends {
    total: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    shippingFee: Prisma.Decimal;
    discountAmount: Prisma.Decimal | null;
    items: Array<{ unitPrice: Prisma.Decimal; lineTotal: Prisma.Decimal }>;
  },
> = Omit<T, "total" | "subtotal" | "shippingFee" | "discountAmount" | "items"> & {
  total: SerializedDecimal;
  subtotal: SerializedDecimal;
  shippingFee: SerializedDecimal;
  discountAmount: SerializedDecimal | null;
  items: Array<SerializedOrderItem<T["items"][number]>>;
};

function serializeOrder<
  T extends {
    total: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    shippingFee: Prisma.Decimal;
    discountAmount: Prisma.Decimal | null;
    items: Array<{ unitPrice: Prisma.Decimal; lineTotal: Prisma.Decimal }>;
  },
>(order: T): SerializedOrder<T> {
  return {
    ...order,
    total: order.total.toString(),
    subtotal: order.subtotal.toString(),
    shippingFee: order.shippingFee.toString(),
    discountAmount: order.discountAmount?.toString() ?? null,
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
      lineTotal: item.lineTotal.toString(),
    })),
  } as unknown as SerializedOrder<T>;
}

export async function getOrdersByUser(userId: string) {
  const rows = await db.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
      promoCode: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(serializeOrder);
}

export async function getOrderById(orderId: string, userId?: string) {
  const row = await db.order.findUnique({
    where: { id: orderId, ...(userId ? { userId } : {}) },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true } } },
          },
        },
      },
      address: true,
      promoCode: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  return row ? serializeOrder(row) : null;
}

export async function getAllOrders(opts?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const rows = await db.order.findMany({
    where: opts?.status ? { status: opts.status as never } : {},
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: opts?.limit ?? 50,
    skip: opts?.offset ?? 0,
  });
  return rows.map(serializeOrder);
}
