"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { IconBox, IconPin, IconHeart, IconArrow, IconEdit, IconPlus } from "@/components/shared/icons";

type OrderItem = {
  productName_en: string;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: unknown;
  createdAt: Date;
  items: OrderItem[];
  address?: {
    label: string | null;
    line1: string;
    line2: string | null;
    city: string;
    governorate: string;
    isDefault: boolean;
  } | null;
};

type AccountClientProps = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt?: Date;
  };
  orders: Order[];
};

type Tab = "orders" | "addresses" | "wishlist";

function statusStyles(status: string): { color: string; bg: string; label: string } {
  switch (status) {
    case "DELIVERED":
      return { color: "var(--hbt-sage-deep)", bg: "var(--hbt-sage-wash)", label: "Delivered" };
    case "OUT_FOR_DELIVERY":
      return { color: "var(--hbt-pink-deep)", bg: "var(--hbt-pink-wash)", label: "Out for delivery" };
    case "CANCELLED":
      return { color: "#b00", bg: "#ffeaea", label: "Cancelled" };
    default:
      return { color: "var(--hbt-brown)", bg: "var(--hbt-cream-deep)", label: "Pending" };
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMemberSince(date?: Date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// ── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          color: "var(--hbt-brown-soft)",
          fontFamily: "var(--hbt-serif)",
          fontSize: 22,
        }}
      >
        No orders yet.
        <div style={{ marginTop: 12 }}>
          <Link
            href="/products"
            style={{
              fontSize: 14,
              fontFamily: "var(--hbt-sans)",
              color: "var(--hbt-sage-deep)",
              textDecoration: "underline",
            }}
          >
            Browse products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {orders.map((order) => {
        const { color: statusColor, bg: statusBg, label: statusLabel } = statusStyles(order.status);
        const totalStr = typeof order.total === "object" && order.total !== null
          ? String(order.total)
          : String(order.total ?? "");

        return (
          <div
            key={order.id}
            style={{
              background: "var(--hbt-paper)",
              borderRadius: "var(--hbt-r-lg)",
              padding: 22,
              border: "1px solid var(--hbt-line-soft)",
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              alignItems: "center",
            }}
          >
            {/* Product thumbnails */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {order.items.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "var(--hbt-cream-deep)",
                    overflow: "hidden",
                    border: "2px solid var(--hbt-paper)",
                    marginLeft: i === 0 ? 0 : -12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--hbt-brown-soft)",
                    textAlign: "center",
                    padding: 2,
                  }}
                  title={item.productName_en}
                >
                  {item.productName_en.slice(0, 2).toUpperCase()}
                </div>
              ))}
              {order.items.length > 3 && (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "var(--hbt-cream-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    marginLeft: -12,
                    border: "2px solid var(--hbt-paper)",
                    color: "var(--hbt-brown)",
                  }}
                >
                  +{order.items.length - 3}
                </div>
              )}
            </div>

            {/* Order info */}
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 17, fontWeight: 500 }}>
                {order.orderNumber}
              </div>
              <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)", marginTop: 2 }}>
                {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ${totalStr}
              </div>
            </div>

            {/* Status badge */}
            <span
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                background: statusBg,
                color: statusColor,
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              {statusLabel}
            </span>

            {/* Track order link */}
            <Link
              href={`/order-confirmation/${order.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: "var(--hbt-r-pill)",
                border: "1px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                color: "var(--hbt-ink)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--hbt-sans)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Track order <IconArrow size={13} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// ── Addresses Tab ────────────────────────────────────────────────────────────

function AddressesTab({ orders }: { orders: Order[] }) {
  // Derive unique addresses from orders
  const seen = new Set<string>();
  const addresses = orders
    .filter((o) => o.address)
    .map((o) => o.address!)
    .filter((a) => {
      const key = a.line1 + a.city;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}
    >
      {addresses.map((addr, i) => (
        <div
          key={i}
          style={{
            background: "var(--hbt-paper)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 20,
            border: "1px solid var(--hbt-line-soft)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "var(--hbt-sage-deep)" }}>
                <IconPin />
              </span>
              <span style={{ fontFamily: "var(--hbt-serif)", fontSize: 18, fontWeight: 500 }}>
                {addr.label ?? "Delivery address"}
              </span>
              {addr.isDefault && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "var(--hbt-sage-wash)",
                    color: "var(--hbt-sage-deep)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Default
                </span>
              )}
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--hbt-brown-soft)",
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Edit address"
            >
              <IconEdit />
            </button>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: "var(--hbt-ink)" }}>
            <div>{addr.line1}</div>
            {addr.line2 && <div>{addr.line2}</div>}
            <div>
              {addr.city}, {addr.governorate}, Lebanon
            </div>
          </div>
        </div>
      ))}

      {/* Add address button */}
      <button
        style={{
          background: "var(--hbt-cream-soft)",
          borderRadius: "var(--hbt-r-lg)",
          padding: 20,
          border: "1.5px dashed var(--hbt-line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: "var(--hbt-brown)",
          fontWeight: 600,
          fontFamily: "var(--hbt-sans)",
          fontSize: 14,
          cursor: "pointer",
          minHeight: 80,
        }}
      >
        <IconPlus /> Add a new address
      </button>
    </div>
  );
}

// ── Wishlist Tab ─────────────────────────────────────────────────────────────

function WishlistTab() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
      }}
    >
      <div
        style={{
          color: "var(--hbt-brown-soft)",
          marginBottom: 8,
        }}
      >
        <IconHeart size={36} />
      </div>
      <div
        style={{
          fontFamily: "var(--hbt-serif)",
          fontSize: 22,
          color: "var(--hbt-ink)",
          marginBottom: 8,
        }}
      >
        Your wishlist is empty.
      </div>
      <p style={{ fontSize: 14, color: "var(--hbt-brown-soft)", marginBottom: 20 }}>
        Save products you love and come back to them anytime.
      </p>
      <Link
        href="/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 24px",
          borderRadius: "var(--hbt-r-pill)",
          background: "var(--hbt-brown)",
          color: "var(--hbt-cream-soft)",
          fontFamily: "var(--hbt-sans)",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Browse products
      </Link>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function AccountClient({ user, orders }: AccountClientProps) {
  const [tab, setTab] = useState<Tab>("orders");

  const initial = (user.name ?? user.email ?? "?")[0].toUpperCase();
  const firstName = user.name?.split(" ")[0] ?? "there";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "Order history", icon: <IconBox size={14} /> },
    { id: "addresses", label: "Saved addresses", icon: <IconPin size={14} /> },
    { id: "wishlist", label: "Wishlist", icon: <IconHeart size={14} /> },
  ];

  return (
    <div
      style={{
        padding: "40px 32px 64px",
        maxWidth: 1180,
        margin: "0 auto",
      }}
    >
      {/* Hero section */}
      <section
        style={{
          background: "var(--hbt-sage-wash)",
          borderRadius: "var(--hbt-r-xl)",
          padding: "32px 36px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative botanical SVG */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 140,
            height: 140,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 200 200" fill="none" stroke="#7A8A6A" strokeWidth="1.4" strokeLinecap="round">
            <path d="M100 180 V20 M100 50 C 80 40, 70 30, 70 30 M100 90 C 130 78, 145 60, 145 60 M100 130 C 75 122, 65 100, 65 100" />
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "var(--hbt-paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--hbt-cream-soft)",
              fontFamily: "var(--hbt-serif)",
              fontSize: 28,
              color: "var(--hbt-sage-deep)",
              fontStyle: "italic",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          <div>
            <div className="hbt-eyebrow" style={{ color: "var(--hbt-sage-deep)" }}>
              Welcome back
            </div>
            <h1
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 34,
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Hello {firstName},{" "}
              <em style={{ color: "var(--hbt-sage-deep)" }}>habibti</em>.
            </h1>
            <div style={{ fontSize: 13, color: "var(--hbt-ink-soft)", marginTop: 4 }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""}
              {(user as AccountClientProps["user"] & { createdAt?: Date }).createdAt
                ? ` · Member since ${formatMemberSince((user as AccountClientProps["user"] & { createdAt?: Date }).createdAt)}`
                : ""}
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            padding: "9px 18px",
            borderRadius: "var(--hbt-r-pill)",
            border: "1.5px solid var(--hbt-line)",
            background: "var(--hbt-paper)",
            color: "var(--hbt-brown)",
            fontFamily: "var(--hbt-sans)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </section>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--hbt-line-soft)",
          marginBottom: 24,
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "none",
              border: "none",
              padding: "12px 18px",
              fontFamily: "var(--hbt-sans)",
              fontSize: 14,
              fontWeight: 600,
              color: tab === t.id ? "var(--hbt-ink)" : "var(--hbt-brown-soft)",
              borderBottom: tab === t.id ? "2px solid var(--hbt-brown)" : "2px solid transparent",
              marginBottom: -1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "orders" && <OrdersTab orders={orders} />}
      {tab === "addresses" && <AddressesTab orders={orders} />}
      {tab === "wishlist" && <WishlistTab />}
    </div>
  );
}
