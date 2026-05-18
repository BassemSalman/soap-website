"use client";

import Image from "next/image";
import Link from "next/link";
import { IconCheck, IconTruck, IconWhatsapp } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  quantity: number;
  lineTotal: string | number;
  productName_en: string;
  basketConfig?: unknown;
  product?: {
    name_en: string;
    images: { url: string; isPrimary: boolean }[];
    swatch?: string | null;
  } | null;
}

interface Address {
  line1: string;
  line2?: string | null;
  city: string;
  governorate: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  total: string | number;
  subtotal: string | number;
  shippingFee: string | number;
  discountAmount?: string | number | null;
  createdAt: Date | string;
  items: OrderItem[];
  address?: Address | null;
}

interface OrderConfirmationClientProps {
  order: Order;
}

// ─── Status to stage index ────────────────────────────────────────────────────

const STATUS_STAGES = [
  { key: "PENDING",           label: "Pending" },
  { key: "CONFIRMED",         label: "Confirmed via WhatsApp" },
  { key: "OUT_FOR_DELIVERY",  label: "Out for delivery" },
  { key: "DELIVERED",         label: "Delivered" },
];

function statusToIndex(status: string): number {
  switch (status) {
    case "PENDING":           return 0;
    case "CONFIRMED":         return 1;
    case "OUT_FOR_DELIVERY":  return 2;
    case "DELIVERED":         return 3;
    default:                  return 0;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  const currentStage = statusToIndex(order.status);
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! Following up on order ${order.orderNumber}`)}`;

  return (
    <div
      style={{
        background: "var(--hbt-cream-soft)",
        padding: "32px 16px 64px",
        minHeight: "70vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(168,184,154,0.18) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.6,
        }}
      />

      {/* Hero */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Check circle */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 999,
            background: "var(--hbt-sage-wash)",
            color: "var(--hbt-sage-deep)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            boxShadow: "0 0 0 12px rgba(168, 184, 154, 0.18)",
          }}
        >
          <IconCheck size={40} />
        </div>

        <h1
          className="hbt-h-display"
          style={{ fontSize: "clamp(32px, 6vw, 56px)", marginBottom: 12 }}
        >
          Thank you, <em>habibti.</em>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--hbt-brown-soft)",
            lineHeight: 1.5,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Your order&apos;s in the kitchen. We&apos;ll WhatsApp you in the next hour to
          confirm everything — then we wrap, write, and send.
        </p>

        {/* Order number pill */}
        <div
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "var(--hbt-paper)",
            borderRadius: 999,
            border: "1px solid var(--hbt-line)",
            marginTop: 24,
            fontFamily: "var(--hbt-serif)",
            fontSize: 15,
            color: "var(--hbt-ink)",
          }}
        >
          Order{" "}
          <span style={{ fontWeight: 600 }}>{order.orderNumber}</span>
        </div>
      </div>

      {/* Tracking + summary cards */}
      <div style={{ maxWidth: 720, margin: "32px auto 0", position: "relative" }}>

        {/* Delivery tracker */}
        <div
          style={{
            background: "var(--hbt-paper)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 24,
            border: "1px solid var(--hbt-line-soft)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--hbt-brown)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            Delivery tracking
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Background line */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 16,
                right: 16,
                height: 2,
                background: "var(--hbt-cream-deep)",
              }}
            >
              <div
                style={{
                  width: `${(currentStage / (STATUS_STAGES.length - 1)) * 100}%`,
                  height: "100%",
                  background: "var(--hbt-sage-deep)",
                  transition: "width .4s ease",
                }}
              />
            </div>

            {STATUS_STAGES.map((stage, i) => {
              const done = i <= currentStage;
              const current = i === currentStage;
              return (
                <div
                  key={stage.key}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      margin: "0 auto",
                      background: done
                        ? "var(--hbt-sage-deep)"
                        : "var(--hbt-cream-deep)",
                      border: current ? "3px solid var(--hbt-paper)" : "none",
                      boxShadow: current
                        ? "0 0 0 2px var(--hbt-sage-deep)"
                        : "none",
                      color: done
                        ? "var(--hbt-cream-soft)"
                        : "var(--hbt-brown-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {done && <IconCheck size={14} />}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: current ? "var(--hbt-ink)" : "var(--hbt-brown-soft)",
                      fontWeight: current ? 700 : 500,
                      marginTop: 6,
                      lineHeight: 1.2,
                    }}
                  >
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              background: "var(--hbt-sage-wash)",
              borderRadius: "var(--hbt-r-sm)",
              fontSize: 13,
              color: "var(--hbt-sage-deep)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconTruck size={16} />
            <span>
              Estimated delivery: <strong>2–3 business days</strong>
            </span>
          </div>
        </div>

        {/* Order items */}
        <div
          style={{
            background: "var(--hbt-paper)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 24,
            border: "1px solid var(--hbt-line-soft)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--hbt-brown)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            What&apos;s coming
          </div>

          {order.items.map((item) => {
            const img =
              item.product?.images.find((i) => i.isPrimary) ??
              item.product?.images[0];
            const isBasket = !!item.basketConfig;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--hbt-line-soft)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background:
                      item.product?.swatch ?? "var(--hbt-cream-deep)",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {img && (
                    <Image
                      src={img.url}
                      alt={item.productName_en}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--hbt-serif)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--hbt-ink)",
                    }}
                  >
                    {isBasket ? "Gift Basket" : item.productName_en}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}
                  >
                    Qty {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--hbt-ink)" }}>
                  ${Number(item.lineTotal)}
                </div>
              </div>
            );
          })}

          {/* Totals */}
          <div style={{ paddingTop: 12 }}>
            {Number(order.discountAmount) > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "var(--hbt-sage-deep)",
                  marginBottom: 4,
                }}
              >
                <span>Discount</span>
                <span>-${Number(order.discountAmount)}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "var(--hbt-ink)",
                marginBottom: 4,
              }}
            >
              <span>Delivery</span>
              <span>
                {Number(order.shippingFee) === 0 ? "Free" : `$${Number(order.shippingFee)}`}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--hbt-serif)",
                fontSize: 20,
                fontWeight: 500,
                marginTop: 10,
                color: "var(--hbt-ink)",
              }}
            >
              <span>Total · cash on delivery</span>
              <span>${Number(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer / delivery info */}
        <div
          style={{
            background: "var(--hbt-paper)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 24,
            border: "1px solid var(--hbt-line-soft)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--hbt-brown)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 14,
            }}
          >
            Delivery details
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              fontSize: 14,
            }}
          >
            <div>
              <div style={{ color: "var(--hbt-brown-soft)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Name</div>
              <div style={{ color: "var(--hbt-ink)" }}>{order.customerName}</div>
            </div>
            <div>
              <div style={{ color: "var(--hbt-brown-soft)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Phone</div>
              <div style={{ color: "var(--hbt-ink)" }}>{order.customerPhone}</div>
            </div>
            {order.address && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ color: "var(--hbt-brown-soft)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Address</div>
                <div style={{ color: "var(--hbt-ink)" }}>
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ""}
                  {`, ${order.address.city}, ${order.address.governorate}`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}
          className="sm:grid-cols-2"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25D366",
              color: "white",
              padding: "16px 24px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconWhatsapp size={18} /> Follow up on WhatsApp
          </a>
          <Link
            href="/account/orders"
            style={{
              background: "transparent",
              color: "var(--hbt-ink)",
              border: "1.5px solid var(--hbt-brown)",
              padding: "16px 24px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            View order history
          </Link>
        </div>
      </div>
    </div>
  );
}
