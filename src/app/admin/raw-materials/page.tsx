import { getRawMaterials, getLowStockRawMaterials } from "@/features/raw-materials/queries";
import { RawMaterialsTable } from "@/components/admin/raw-materials-table";

export const dynamic = "force-dynamic";

export default async function AdminRawMaterialsPage() {
  const [materials, lowStock] = await Promise.all([
    getRawMaterials(),
    getLowStockRawMaterials(),
  ]);

  return (
    <RawMaterialsTable
      materials={materials as Parameters<typeof RawMaterialsTable>[0]["materials"]}
      lowStock={lowStock as Parameters<typeof RawMaterialsTable>[0]["lowStock"]}
    />
  );
}
