import { getAllOrders } from "@/features/orders/queries";
import { getAllProducts } from "@/features/products/queries";
import { OrdersTable } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const [orders, products] = await Promise.all([
    getAllOrders({ limit: 200 }),
    getAllProducts(),
  ]);

  return (
    <OrdersTable
      orders={orders as Parameters<typeof OrdersTable>[0]["orders"]}
      products={products as Parameters<typeof OrdersTable>[0]["products"]}
    />
  );
}
