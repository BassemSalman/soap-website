"use client";
import { useState, useTransition, useOptimistic } from "react";
import { updateOrderStatus, createManualOrder } from "@/features/orders/actions";
import { IconPlus, IconSearch } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  quantity: number;
  lineTotal: unknown;
  productName_en: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: string;
  total: unknown;
  createdAt: Date;
  items: OrderItem[];
  address?: { city?: string; governorate?: string } | null;
}

interface Product {
  id: string;
  name_en: string;
  basePrice: unknown;
  isActive: boolean;
}

interface Props {
  orders: Order[];
  products: Product[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const FILTER_TABS = ["All", "PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const admCard: React.CSSProperties = {
  background: "var(--hbt-paper)",
  borderRadius: 14,
  padding: 18,
  border: "1px solid var(--hbt-line-soft)",
};

// ─── StatusSelect ─────────────────────────────────────────────────────────────

function StatusSelect({
  orderId,
  status,
  onChange,
}: {
  orderId: string;
  status: string;
  onChange: (id: string, s: string) => void;
}) {
  const [bg, fg] = STATUS_COLORS[status] ?? ["var(--hbt-cream-deep)", "var(--hbt-brown)"];
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    onChange(orderId, next);
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateOrderStatus({ orderId, status: next as any });
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={pending}
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
        cursor: pending ? "wait" : "pointer",
        fontFamily: "inherit",
        opacity: pending ? 0.7 : 1,
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

// ─── Manual Order Dialog ──────────────────────────────────────────────────────

function ManualOrderDialog({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: "", quantity: 1 },
  ]);

  const activeProducts = products.filter((p) => p.isActive);

  function addItem() {
    setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validItems = items.filter((it) => it.productId);
    if (validItems.length === 0) {
      setError("Add at least one product");
      return;
    }
    const input = {
      customerName: fd.get("customerName") as string,
      customerPhone: fd.get("customerPhone") as string,
      customerEmail: fd.get("customerEmail") as string,
      addressLine: fd.get("addressLine") as string,
      city: fd.get("city") as string,
      governorate: fd.get("governorate") as string,
      promoCode: (fd.get("promoCode") as string) || undefined,
      deliveryNotes: (fd.get("deliveryNotes") as string) || undefined,
      items: validItems,
    };
    startTransition(async () => {
      try {
        await createManualOrder(input);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create order");
      }
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,34,24,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "var(--hbt-paper)",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 540,
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--hbt-serif)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--hbt-ink)",
              margin: 0,
            }}
          >
            Add manual order
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--hbt-line)",
              borderRadius: 7,
              width: 28,
              height: 28,
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "var(--hbt-pink-wash)",
              color: "var(--hbt-pink-deep)",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Customer info */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--hbt-brown-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderBottom: "1px solid var(--hbt-line-soft)",
              paddingBottom: 6,
            }}
          >
            Customer info
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { name: "customerName", label: "Name", required: true },
              { name: "customerPhone", label: "Phone", required: true },
              { name: "customerEmail", label: "Email", type: "email", required: true },
            ].map((f) => (
              <div key={f.name} style={f.name === "customerEmail" ? { gridColumn: "1 / -1" } : {}}>
                <label style={fieldLabelStyle}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type ?? "text"}
                  required={f.required}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Address */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--hbt-brown-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderBottom: "1px solid var(--hbt-line-soft)",
              paddingBottom: 6,
              marginTop: 4,
            }}
          >
            Delivery address
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { name: "addressLine", label: "Address line", full: true, required: true },
              { name: "city", label: "City", required: true },
              { name: "governorate", label: "Governorate", required: true },
            ].map((f) => (
              <div key={f.name} style={f.full ? { gridColumn: "1 / -1" } : {}}>
                <label style={fieldLabelStyle}>{f.label}</label>
                <input
                  name={f.name}
                  required={f.required}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Products */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--hbt-brown-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderBottom: "1px solid var(--hbt-line-soft)",
              paddingBottom: 6,
              marginTop: 4,
            }}
          >
            Items
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={fieldLabelStyle}>Product</label>
                <select
                  value={item.productId}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, productId: e.target.value } : it
                      )
                    )
                  }
                  style={{ ...inputStyle, paddingTop: 9, paddingBottom: 9 }}
                >
                  <option value="">— select —</option>
                  {activeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name_en} (${Number(p.basePrice).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: 80 }}>
                <label style={fieldLabelStyle}>Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, quantity: Number(e.target.value) } : it
                      )
                    )
                  }
                  style={inputStyle}
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  style={{
                    background: "none",
                    border: "1px solid var(--hbt-line)",
                    borderRadius: 7,
                    width: 32,
                    height: 36,
                    cursor: "pointer",
                    color: "var(--hbt-pink-deep)",
                    fontSize: 18,
                    flexShrink: 0,
                    marginBottom: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 999,
              border: "1.5px solid var(--hbt-line)",
              background: "transparent",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: "var(--hbt-ink)",
              alignSelf: "flex-start",
            }}
          >
            <IconPlus size={12} /> Add item
          </button>

          {/* Optional fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            <div>
              <label style={fieldLabelStyle}>Promo code (optional)</label>
              <input name="promoCode" style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Delivery notes (optional)</label>
              <input name="deliveryNotes" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 999,
                border: "1.5px solid var(--hbt-line)",
                background: "transparent",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                background: "var(--hbt-brown)",
                color: "var(--hbt-cream-soft)",
                fontWeight: 600,
                fontSize: 13,
                cursor: pending ? "wait" : "pointer",
                opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? "Creating…" : "Place order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--hbt-brown)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1.5px solid var(--hbt-line)",
  background: "var(--hbt-paper)",
  fontSize: 13,
  color: "var(--hbt-ink)",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function OrdersTable({ orders, products }: Props) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showManual, setShowManual] = useState(false);

  // Optimistic status updates
  const [optimisticOrders, updateOptimistic] = useOptimistic(
    orders,
    (state, { id, status }: { id: string; status: string }) =>
      state.map((o) => (o.id === id ? { ...o, status } : o))
  );

  function handleStatusChange(id: string, status: string) {
    updateOptimistic({ id, status });
  }

  const filtered = optimisticOrders.filter((o) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {showManual && (
        <ManualOrderDialog
          products={products}
          onClose={() => setShowManual(false)}
        />
      )}

      {/* Header */}
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
            Orders
          </h1>
          <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
            {orders.length} total orders
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--hbt-brown-soft)",
                pointerEvents: "none",
              }}
            >
              <IconSearch size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders…"
              style={{
                paddingLeft: 32,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 999,
                border: "1.5px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                fontSize: 13,
                color: "var(--hbt-ink)",
                outline: "none",
                width: 200,
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            onClick={() => setShowManual(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              background: "var(--hbt-brown)",
              color: "var(--hbt-cream-soft)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <IconPlus size={12} /> Add manual order
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {FILTER_TABS.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: active
                  ? "1.5px solid var(--hbt-ink)"
                  : "1.5px solid var(--hbt-line)",
                background: active ? "var(--hbt-ink)" : "var(--hbt-paper)",
                color: active ? "var(--hbt-cream-soft)" : "var(--hbt-ink)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab === "All" ? "All" : STATUS_LABELS[tab]}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={admCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Order", "Customer", "Region", "Items", "Total", "Status", "Time", ""].map(
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
              {filtered.map((order) => {
                const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--hbt-line-soft)" }}
                  >
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600 }}>{order.orderNumber}</span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <div>{order.customerName}</div>
                      <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                        {order.customerPhone}
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)" }}>
                        {order.address?.city ?? "—"}
                      </span>
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
                      <StatusSelect
                        orderId={order.id}
                        status={order.status}
                        onChange={handleStatusChange}
                      />
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--hbt-brown-soft)",
                          fontSize: 18,
                        }}
                        title="Details"
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--hbt-brown-soft)",
                    }}
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
