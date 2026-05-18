import {
  getRevenueStats,
  getOrdersByStatus,
  getLowStockProducts,
  getRecentOrders,
} from "@/features/reports/queries";

export const dynamic = "force-dynamic";

const admCard: React.CSSProperties = {
  background: "var(--hbt-paper)",
  borderRadius: 14,
  padding: 18,
  border: "1px solid var(--hbt-line-soft)",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "var(--hbt-beige)",
  OUT_FOR_DELIVERY: "var(--hbt-pink-deep)",
  DELIVERED: "var(--hbt-sage-deep)",
  CANCELLED: "var(--hbt-brown-soft)",
};

export default async function AdminReportsPage() {
  const [revenueStats, ordersByStatus, lowStockProducts, recentOrders] = await Promise.all([
    getRevenueStats(),
    getOrdersByStatus(),
    getLowStockProducts(),
    getRecentOrders(20),
  ]);

  const totalOrders = (ordersByStatus as { status: string; _count: { id: number } }[]).reduce(
    (s, o) => s + o._count.id,
    0
  );

  const deliveredRevenue = revenueStats.totalRevenue;
  const deliveredCount = revenueStats.orderCount;
  const avgOrderValue = deliveredCount > 0 ? deliveredRevenue / deliveredCount : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 2,
            color: "var(--hbt-ink)",
          }}
        >
          Reports
        </h1>
        <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
          Business overview and analytics
        </div>
      </div>

      {/* Summary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Total Revenue",
            value: `$${deliveredRevenue.toFixed(2)}`,
            sub: "Delivered orders only",
          },
          {
            label: "Delivered Orders",
            value: String(deliveredCount),
            sub: "Successfully delivered",
          },
          {
            label: "Avg Order Value",
            value: `$${avgOrderValue.toFixed(2)}`,
            sub: "Per delivered order",
          },
          {
            label: "Total Orders",
            value: String(totalOrders),
            sub: "All statuses",
          },
        ].map((s) => (
          <div key={s.label} style={admCard}>
            <div
              style={{
                fontSize: 11,
                color: "var(--hbt-brown-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1,
                marginBottom: 4,
                color: "var(--hbt-ink)",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
        className="admin-grid-responsive"
      >
        <div style={admCard}>
          <div
            style={{
              fontFamily: "var(--hbt-serif)",
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 16,
              color: "var(--hbt-ink)",
            }}
          >
            Orders by status
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(ordersByStatus as { status: string; _count: { id: number } }[]).map((row) => {
              const pct = totalOrders > 0 ? (row._count.id / totalOrders) * 100 : 0;
              const color = STATUS_COLORS[row.status] ?? "var(--hbt-beige)";
              return (
                <div key={row.status}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--hbt-ink)" }}>
                      {STATUS_LABELS[row.status] ?? row.status}
                    </span>
                    <span style={{ color: "var(--hbt-brown-soft)" }}>
                      {row._count.id} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "var(--hbt-cream-deep)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low stock */}
        <div style={admCard}>
          <div
            style={{
              fontFamily: "var(--hbt-serif)",
              fontSize: 16,
              fontWeight: 500,
              marginBottom: 16,
              color: "var(--hbt-ink)",
            }}
          >
            Low stock products
          </div>
          {(lowStockProducts as { id: string; name_en: string; stockQty: number; lowStockThreshold: number }[]).length === 0 ? (
            <p style={{ color: "var(--hbt-sage-deep)", fontSize: 13 }}>
              All stock levels are healthy.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(lowStockProducts as { id: string; name_en: string; stockQty: number; lowStockThreshold: number }[]).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--hbt-line-soft)",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name_en}</span>
                  <span
                    style={{
                      background: "var(--hbt-pink-wash)",
                      color: "var(--hbt-pink-deep)",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {p.stockQty} / {p.lowStockThreshold} threshold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div style={admCard}>
        <div
          style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 12,
            color: "var(--hbt-ink)",
          }}
        >
          Recent orders (last 20)
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Order", "Customer", "Items", "Total", "Status", "Date"].map((col) => (
                  <th
                    key={col}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--hbt-brown-soft)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid var(--hbt-line)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders as {
                id: string;
                orderNumber: string;
                customerName: string;
                status: string;
                total: unknown;
                createdAt: Date;
                items: { quantity: number }[];
              }[]).map((order) => {
                const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                const [bg, fg] =
                  {
                    PENDING: ["var(--hbt-cream-deep)", "var(--hbt-brown)"],
                    OUT_FOR_DELIVERY: ["var(--hbt-pink-wash)", "var(--hbt-pink-deep)"],
                    DELIVERED: ["var(--hbt-sage-wash)", "var(--hbt-sage-deep)"],
                    CANCELLED: ["#f3f0eb", "var(--hbt-brown-soft)"],
                  }[order.status] ?? ["var(--hbt-cream-deep)", "var(--hbt-brown)"];

                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--hbt-line-soft)" }}
                  >
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600 }}>{order.orderNumber}</span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {order.customerName}
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {itemCount}
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600 }}>
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 9px",
                          borderRadius: 999,
                          background: bg,
                          color: fg,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
