"use client";
import Link from "next/link";
import { updateOrderStatus } from "@/features/orders/actions";
import { IconTrend, IconBox, IconAlert, IconTag } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenueStats {
  totalRevenue: number;
  orderCount: number;
}

interface StatusCount {
  status: string;
  _count: { id: number };
}

interface LowStockProduct {
  id: string;
  name_en: string;
  stockQty: number;
  lowStockThreshold: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: unknown;
  createdAt: Date;
  items: { quantity: number; lineTotal: unknown }[];
  address?: { city?: string; governorate?: string } | null;
}

interface Props {
  revenueStats: RevenueStats;
  ordersByStatus: StatusCount[];
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, [string, string]> = {
  PENDING: ["var(--hbt-cream-deep)", "var(--hbt-brown)"],
  OUT_FOR_DELIVERY: ["var(--hbt-pink-wash)", "var(--hbt-pink-deep)"],
  DELIVERED: ["var(--hbt-sage-wash)", "var(--hbt-sage-deep)"],
  CANCELLED: ["#f3f0eb", "var(--hbt-brown-soft)"],
};

const admCard: React.CSSProperties = {
  background: "var(--hbt-paper)",
  borderRadius: 14,
  padding: 18,
  border: "1px solid var(--hbt-line-soft)",
};

// ─── StatusSelect ─────────────────────────────────────────────────────────────

function StatusSelect({ orderId, initialStatus }: { orderId: string; initialStatus: string }) {
  const [bg, fg] = STATUS_COLORS[initialStatus] ?? ["var(--hbt-cream-deep)", "var(--hbt-brown)"];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateOrderStatus({ orderId, status: e.target.value as any });
  }

  return (
    <select
      defaultValue={initialStatus}
      onChange={handleChange}
      style={{
        background: bg,
        color: fg,
        fontWeight: 700,
        fontSize: 10,
        border: "none",
        padding: "4px 8px",
        borderRadius: 999,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {Object.entries(STATUS_LABELS).map(([val, label]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  );
}

// ─── StatusBar ────────────────────────────────────────────────────────────────

function StatusBar({ ordersByStatus }: { ordersByStatus: StatusCount[] }) {
  const total = ordersByStatus.reduce((s, o) => s + o._count.id, 0);
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: "var(--hbt-brown-soft)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Orders by status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ordersByStatus.map((row) => {
          const pct = total > 0 ? Math.round((row._count.id / total) * 100) : 0;
          const [bg, fg] = STATUS_COLORS[row.status] ?? ["var(--hbt-cream-deep)", "var(--hbt-brown)"];
          return (
            <div key={row.status}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontWeight: 600, color: fg }}>
                  {STATUS_LABELS[row.status] ?? row.status}
                </span>
                <span style={{ color: "var(--hbt-brown-soft)" }}>
                  {row._count.id} ({pct}%)
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "var(--hbt-cream-deep)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: bg === "var(--hbt-cream-deep)" ? "var(--hbt-beige)" : fg,
                    borderRadius: 999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardClient({
  revenueStats,
  ordersByStatus,
  lowStockProducts,
  recentOrders,
}: Props) {
  const pendingCount =
    ordersByStatus.find((s) => s.status === "PENDING")?._count.id ?? 0;
  const outForDeliveryCount =
    ordersByStatus.find((s) => s.status === "OUT_FOR_DELIVERY")?._count.id ?? 0;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${revenueStats.totalRevenue.toFixed(2)}`,
      sub: `${revenueStats.orderCount} delivered orders`,
      icon: <IconTrend size={20} />,
      color: "var(--hbt-sage-deep)",
    },
    {
      label: "Pending Orders",
      value: String(pendingCount),
      sub: "Awaiting dispatch",
      icon: <IconBox size={20} />,
      color: "var(--hbt-brown)",
    },
    {
      label: "Out for Delivery",
      value: String(outForDeliveryCount),
      sub: "On the road",
      icon: <IconTag size={20} />,
      color: "var(--hbt-pink-deep)",
    },
    {
      label: "Low Stock Items",
      value: String(lowStockProducts.length),
      sub: "Need restocking",
      icon: <IconAlert size={20} />,
      color: lowStockProducts.length > 0 ? "var(--hbt-pink-deep)" : "var(--hbt-sage-deep)",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--hbt-serif)",
              fontSize: 28,
              fontWeight: 500,
              marginBottom: 2,
              color: "var(--hbt-ink)",
            }}
          >
            Dashboard
          </h1>
          <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
            An overview of the kitchen, today.
          </div>
        </div>
        <Link
          href="/admin/products"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 999,
            background: "var(--hbt-brown)",
            color: "var(--hbt-cream-soft)",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Manage products
        </Link>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={admCard}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
                color: s.color,
              }}
            >
              {s.icon}
              <span
                style={{
                  fontSize: 11,
                  color: "var(--hbt-brown-soft)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 32,
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

      {/* Charts + Low Stock row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
        className="admin-grid-responsive"
      >
        {/* Order status bars */}
        <div style={admCard}>
          <StatusBar ordersByStatus={ordersByStatus} />
        </div>

        {/* Low stock alerts */}
        <div style={admCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 16,
                fontWeight: 500,
                color: "var(--hbt-ink)",
              }}
            >
              Low stock alerts
            </div>
            {lowStockProducts.length > 0 && (
              <span
                style={{
                  background: "var(--hbt-pink-wash)",
                  color: "var(--hbt-pink-deep)",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                {lowStockProducts.length} item{lowStockProducts.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {lowStockProducts.length === 0 ? (
            <div style={{ color: "var(--hbt-sage-deep)", fontSize: 13, padding: "8px 0" }}>
              All stock levels are healthy.
            </div>
          ) : (
            lowStockProducts.slice(0, 5).map((p) => {
              const pct =
                p.lowStockThreshold > 0
                  ? (p.stockQty / p.lowStockThreshold) * 100
                  : 100;
              return (
                <div
                  key={p.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--hbt-line-soft)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--hbt-ink)" }}>
                      {p.name_en}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--hbt-pink-deep)",
                        fontWeight: 700,
                      }}
                    >
                      {p.stockQty} left
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "var(--hbt-cream-deep)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, pct)}%`,
                        background: pct < 50 ? "var(--hbt-pink-deep)" : "var(--hbt-beige)",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)", marginTop: 4 }}>
                    Threshold: {p.lowStockThreshold}
                  </div>
                </div>
              );
            })
          )}
          <Link
            href="/admin/products"
            style={{
              display: "block",
              marginTop: 12,
              padding: "8px 16px",
              borderRadius: 999,
              border: "1.5px solid var(--hbt-brown)",
              background: "transparent",
              color: "var(--hbt-ink)",
              fontWeight: 600,
              fontSize: 13,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Manage stock
          </Link>
        </div>
      </div>

      {/* Recent orders table */}
      <div style={admCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--hbt-serif)",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--hbt-ink)",
            }}
          >
            Recent orders
          </div>
          <Link
            href="/admin/orders"
            style={{
              fontSize: 12,
              color: "var(--hbt-brown-soft)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            See all →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {["Order", "Customer", "Region", "Items", "Total", "Status", "Time"].map(
                  (col) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (s, i) => s + i.quantity,
                  0
                );
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--hbt-line-soft)" }}
                  >
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600, color: "var(--hbt-ink)" }}>
                        {order.orderNumber}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {order.customerName}
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)" }}>
                        {(order as unknown as { address?: { city?: string } | null })?.address?.city ?? "—"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {itemCount}
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600 }}>${Number(order.total).toFixed(2)}</span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <StatusSelect
                        orderId={order.id}
                        initialStatus={order.status}
                      />
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--hbt-brown-soft)",
                    }}
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
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
