import { getRevenueStats, getOrdersByStatus, getLowStockProducts, getRecentOrders } from "@/features/reports/queries";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [revenueStats, ordersByStatus, lowStockProducts, recentOrders] = await Promise.all([
    getRevenueStats(),
    getOrdersByStatus(),
    getLowStockProducts(),
    getRecentOrders(8),
  ]);

  return (
    <DashboardClient
      revenueStats={revenueStats}
      ordersByStatus={ordersByStatus as { status: string; _count: { id: number } }[]}
      lowStockProducts={lowStockProducts as { id: string; name_en: string; stockQty: number; lowStockThreshold: number }[]}
      recentOrders={recentOrders as Parameters<typeof DashboardClient>[0]["recentOrders"]}
    />
  );
}
