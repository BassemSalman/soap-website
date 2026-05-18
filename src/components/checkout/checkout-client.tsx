"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { placeOrder } from "@/features/checkout/actions";
import { IconArrowLeft, IconWhatsapp, IconHand } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  quantity: number;
  basketConfig?: unknown;
  product: {
    id: string;
    name_en: string;
    basePrice: string | number;
    salePrice?: string | number | null;
    isOnSale: boolean;
    images: { url: string; isPrimary: boolean }[];
    swatch?: string | null;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface CheckoutClientProps {
  cart: Cart;
  userEmail: string;
  userName: string;
}

const GOVERNORATES = [
  "Beirut",
  "Mount Lebanon",
  "North Lebanon",
  "South Lebanon",
  "Bekaa",
  "Akkar",
  "Baalbek-Hermel",
  "Nabatieh",
];

const DELIVERY_SLOTS = [
  { id: "morning",   label: "Morning",   sub: "9 – 12" },
  { id: "afternoon", label: "Afternoon", sub: "12 – 5" },
  { id: "evening",   label: "Evening",   sub: "5 – 9" },
];

function itemPrice(item: CartItem): number {
  const p = item.product;
  return p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.basePrice);
}

// ─── Form card wrapper ────────────────────────────────────────────────────────

function FormCard({
  title,
  num,
  children,
}: {
  title: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--hbt-paper)",
        borderRadius: "var(--hbt-r-lg)",
        padding: 24,
        border: "1px solid var(--hbt-line-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "var(--hbt-brown)",
            color: "var(--hbt-cream-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--hbt-serif)",
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: 22,
            fontWeight: 500,
            color: "var(--hbt-ink)",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--hbt-brown)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--hbt-sans)",
  fontSize: 14,
  padding: "13px 16px",
  borderRadius: "var(--hbt-r-sm)",
  border: "1.5px solid var(--hbt-line)",
  background: "var(--hbt-paper)",
  color: "var(--hbt-ink)",
  outline: "none",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function CheckoutClient({ cart, userEmail, userName }: CheckoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const [contact, setContact] = useState({
    name: userName,
    phone: "",
    email: userEmail,
  });

  const [addr, setAddr] = useState({
    governorate: "Beirut",
    line1: "",
    line2: "",
    city: "",
    label: "",
    notes: "",
  });

  const [deliverySlot, setDeliverySlot] = useState("morning");

  const subtotal = cart.items.reduce(
    (sum, item) => sum + itemPrice(item) * item.quantity,
    0
  );
  const DELIVERY_FEE = 5;
  const deliveryFee = subtotal >= 60 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  async function handlePlaceOrder() {
    setServerError(null);

    if (!contact.name.trim() || !contact.phone.trim()) {
      setServerError("Please fill in your name and phone number.");
      return;
    }
    if (!addr.line1.trim() || !addr.city.trim()) {
      setServerError("Please enter your delivery address.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await placeOrder({
          customerName: contact.name,
          customerPhone: contact.phone,
          deliveryNotes: addr.notes || undefined,
          newAddress: {
            label: addr.label || undefined,
            line1: addr.line1,
            line2: addr.line2 || undefined,
            city: addr.city,
            governorate: addr.governorate,
          },
          saveAddress: false,
        });

        // Open WhatsApp in new tab
        if (result?.whatsappUrl) {
          window.open(result.whatsappUrl, "_blank");
        }

        // Navigate to confirmation
        if (result?.orderId) {
          router.push(`/order-confirmation/${result.orderId}`);
        }
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      }
    });
  }

  return (
    <div
      style={{
        padding: "20px 16px 48px",
        maxWidth: 1180,
        margin: "0 auto",
        background: "var(--hbt-cream-soft)",
        minHeight: "60vh",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/cart"
          style={{
            fontSize: 12,
            color: "var(--hbt-brown-soft)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textDecoration: "none",
          }}
        >
          <IconArrowLeft size={14} /> Back to bag
        </Link>
        <h1
          className="hbt-h-display"
          style={{ fontSize: "clamp(26px, 5vw, 42px)", marginTop: 8 }}
        >
          Checkout
        </h1>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}
        className="lg:grid-cols-[1.4fr_1fr] lg:gap-8"
      >
        {/* Left: forms */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* 1. Contact info */}
          <FormCard title="Your details" num="1">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}
              className="sm:grid-cols-2"
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Full name</label>
                <input
                  style={inputStyle}
                  value={contact.name}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Phone (we&apos;ll WhatsApp you)</label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="+961 70 000 000"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={{ ...inputStyle, opacity: 0.7 }}
                  type="email"
                  value={contact.email}
                  readOnly
                />
              </div>
            </div>
          </FormCard>

          {/* 2. Address */}
          <FormCard title="Delivery in Lebanon" num="2">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}
              className="sm:grid-cols-2"
            >
              <div>
                <label style={labelStyle}>Governorate</label>
                <select
                  style={inputStyle}
                  value={addr.governorate}
                  onChange={(e) =>
                    setAddr({ ...addr, governorate: e.target.value })
                  }
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  style={inputStyle}
                  placeholder="Beirut"
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Street, building, floor</label>
                <input
                  style={inputStyle}
                  placeholder="Rue Sursock, Bldg 14, 3rd floor"
                  value={addr.line1}
                  onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Address line 2 (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="Apt 5, near the bakery"
                  value={addr.line2}
                  onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Notes for the driver (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="Ring the second buzzer"
                  value={addr.notes}
                  onChange={(e) => setAddr({ ...addr, notes: e.target.value })}
                />
              </div>
            </div>
          </FormCard>

          {/* 3. Delivery slot */}
          <FormCard title="When works for you" num="3">
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}
              className="sm:grid-cols-3"
            >
              {DELIVERY_SLOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setDeliverySlot(s.id)}
                  style={{
                    padding: 14,
                    borderRadius: "var(--hbt-r-sm)",
                    border:
                      deliverySlot === s.id
                        ? "2px solid var(--hbt-sage-deep)"
                        : "1.5px solid var(--hbt-line)",
                    background:
                      deliverySlot === s.id
                        ? "var(--hbt-sage-wash)"
                        : "var(--hbt-paper)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{ fontWeight: 600, fontSize: 14, color: "var(--hbt-ink)" }}
                  >
                    {s.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
                    {s.sub}
                  </div>
                </button>
              ))}
            </div>
          </FormCard>

          {/* Cash on delivery note */}
          <div
            style={{
              padding: 14,
              background: "var(--hbt-cream-deep)",
              borderRadius: "var(--hbt-r-sm)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "var(--hbt-brown)", marginTop: 2 }}>
              <IconHand size={18} />
            </span>
            <div>
              <div
                style={{
                  fontFamily: "var(--hbt-serif)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--hbt-ink)",
                }}
              >
                Cash on delivery only
              </div>
              <p style={{ fontSize: 13, color: "var(--hbt-ink-soft)", marginTop: 2 }}>
                We don&apos;t take card payments yet — pay the driver in cash (LBP
                or USD). We&apos;ll confirm your order via WhatsApp first.
              </p>
            </div>
          </div>

          {/* Error */}
          {serverError && (
            <p
              style={{
                color: "var(--hbt-pink-deep)",
                fontSize: 14,
                padding: "10px 14px",
                background: "var(--hbt-pink-wash)",
                borderRadius: "var(--hbt-r-sm)",
              }}
            >
              {serverError}
            </p>
          )}
        </div>

        {/* Right: order summary */}
        <div>
          <div
            style={{
              background: "var(--hbt-paper)",
              borderRadius: "var(--hbt-r-lg)",
              padding: 24,
              border: "1px solid var(--hbt-line-soft)",
              position: "sticky",
              top: 80,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 22,
                fontWeight: 500,
                marginBottom: 12,
                color: "var(--hbt-ink)",
              }}
            >
              Order summary
            </h2>

            {/* Items */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {cart.items.map((item) => {
                const price = itemPrice(item);
                const img =
                  item.product.images.find((i) => i.isPrimary) ??
                  item.product.images[0];
                const isBasket = !!item.basketConfig;

                return (
                  <div
                    key={item.id}
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background:
                          item.product.swatch ?? "var(--hbt-cream-deep)",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {img && (
                        <Image
                          src={img.url}
                          alt={item.product.name_en}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          background: "var(--hbt-brown)",
                          color: "var(--hbt-cream-soft)",
                          fontSize: 10,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1, fontSize: 13, color: "var(--hbt-ink)" }}>
                      {isBasket ? "Gift Basket" : item.product.name_en}
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--hbt-ink)" }}
                    >
                      ${price * item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={{ height: 1, background: "var(--hbt-line-soft)", border: 0 }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "14px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "var(--hbt-ink)",
                }}
              >
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  color: "var(--hbt-ink)",
                }}
              >
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee}`}</span>
              </div>
            </div>

            <hr style={{ height: 1, background: "var(--hbt-line-soft)", border: 0 }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--hbt-serif)",
                fontSize: 22,
                fontWeight: 500,
                padding: "14px 0",
                color: "var(--hbt-ink)",
              }}
            >
              <span>Total</span>
              <span>${total}</span>
            </div>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPending}
              style={{
                width: "100%",
                background: "#25D366",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                padding: "16px 24px",
                borderRadius: 999,
                border: "none",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <IconWhatsapp size={20} />
              {isPending ? "Placing order…" : "Place order via WhatsApp"}
            </button>

            <p
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "var(--hbt-brown-soft)",
                textAlign: "center",
              }}
            >
              We&apos;ll send you a WhatsApp to confirm details, then ship within 2–3
              days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
