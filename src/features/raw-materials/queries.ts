import { db } from "@/lib/db";

export async function getRawMaterials() {
  return db.rawMaterial.findMany({ orderBy: { name_en: "asc" } });
}

export async function getLowStockRawMaterials() {
  // Prisma doesn't support column-to-column comparisons in `where` directly,
  // so we fetch all and filter in JS.
  const all = await db.rawMaterial.findMany();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (all as any[]).filter((m) => Number(m.stockQty) <= Number(m.reorderLevel));
}
