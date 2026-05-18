import { getAllProducts } from "@/features/products/queries";
import { ProductsTable } from "@/components/admin/products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();
  return <ProductsTable products={products as Parameters<typeof ProductsTable>[0]["products"]} />;
}
