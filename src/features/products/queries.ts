import { db } from "@/lib/db";

// ─── Serialization ───────────────────────────────────────────────────────────
// Prisma Decimal fields cannot cross the server→client boundary.
// Convert them to strings before returning from any query.

function serializeProduct<
  T extends { basePrice: unknown; salePrice: unknown; weight?: unknown }
>(p: T) {
  return {
    ...p,
    basePrice: p.basePrice?.toString() ?? "0",
    salePrice: p.salePrice != null ? p.salePrice.toString() : null,
    weight: p.weight != null ? p.weight.toString() : null,
  };
}

export async function getProducts(opts?: {
  categorySlug?: string;
  search?: string;
  priceMax?: number;
  skinType?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const rows = await db.product.findMany({
    where: {
      isActive: true,
      ...(opts?.featured ? { isFeatured: true } : {}),
      ...(opts?.categorySlug
        ? {
            categories: {
              some: { category: { slug: opts.categorySlug } },
            },
          }
        : {}),
      ...(opts?.search
        ? {
            OR: [
              { name_en: { contains: opts.search, mode: "insensitive" } },
              { description_en: { contains: opts.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(opts?.priceMax ? { basePrice: { lte: opts.priceMax } } : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
    },
    orderBy: { sortOrder: "asc" },
    take: opts?.limit ?? 50,
    skip: opts?.offset ?? 0,
  });
  return rows.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const row = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: { include: { category: true } },
    },
  });
  return row ? serializeProduct(row) : null;
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featured: true, limit });
}

export async function getAllProducts() {
  const rows = await db.product.findMany({
    include: {
      images: { where: { isPrimary: true } },
      categories: { include: { category: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(serializeProduct);
}
