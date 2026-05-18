"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { updateCartItem, removeFromCart } from "@/features/cart/actions";
import { validatePromoCode } from "@/features/checkout/actions";
import {
  IconPlus,
  IconMinus,
  IconTrash,
  IconArrowLeft,
  IconCheck,
  IconWhatsapp,
} from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  quantity: number;
  basketConfig?: unknown;
  product: {
    id: string;
    name_en: string;
    name_ar: string;
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

interface CartClientProps {
  cart: Cart | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function itemPrice(item: CartItem): number {
  const p = item.product;
  return p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.basePrice);
}

const DELIVERY_FEE = 5;
const FREE_DELIVERY_THRESHOLD = 60;

// ─── Summary row ──────────────────────────────────────────────────────────────

function SumRow({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: 500,
          color: color ?? "var(--hbt-ink)",
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      {sub && (
        <div
          style={{ fontSize: 11, color: "var(--hbt-brown-soft)", marginTop: 2 }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CartClient({ cart }: CartClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [promoInput, setPromoInput] = useState("");
  const [promoState, setPromoState] = useState<{
    applied: boolean;
    message: string;
    discountType?: string;
    discountValue?: number | null;
    freeShipping?: boolean;
  } | null>(null);

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) => sum + itemPrice(item) * item.quantity,
    0
  );

  const discount =
    promoState?.applied && promoState.discountType === "PERCENTAGE" && promoState.discountValue
      ? Math.round(subtotal * (promoState.discountValue / 100))
      : 0;

  const deliveryFee =
    promoState?.freeShipping || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;

  const total = subtotal - discount + deliveryFee;

  const amountToFreeDelivery =
    !promoState?.freeShipping && subtotal < FREE_DELIVERY_THRESHOLD
      ? FREE_DELIVERY_THRESHOLD - subtotal
      : 0;

  function handleUpdateQty(itemId: string, newQty: number) {
    if (newQty < 1) {
      handleRemove(itemId);
      return;
    }
    startTransition(async () => {
      await updateCartItem({ cartItemId: itemId, quantity: newQty });
    });
  }

  function handleRemove(itemId: string) {
    startTransition(async () => {
      await removeFromCart(itemId);
    });
  }

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    const result = await validatePromoCode(promoInput.trim(), subtotal);
    if (result.valid) {
      setPromoState({
        applied: true,
        message: result.message,
        discountType: result.discountType,
        discountValue: result.discountValue,
        freeShipping: result.discountType === "FREE_SHIPPING",
      });
    } else {
      setPromoState({ applied: false, message: result.message });
    }
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "var(--hbt-cream-soft)",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 999,
            background: "var(--hbt-cream-deep)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            color: "var(--hbt-brown-soft)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={36}
            height={36}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 8h14l-1 12H6L5 8z" />
            <path d="M9 8a3 3 0 1 1 6 0" />
          </svg>
        </div>
        <h1
          className="hbt-h-display"
          style={{ fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 8 }}
        >
          Your bag is quiet.
        </h1>
        <p
          style={{
            color: "var(--hbt-brown-soft)",
            marginBottom: 24,
          }}
        >
          Nothing in it yet — go pick something soft.
        </p>
        <Link
          href="/products"
          style={{
            background: "var(--hbt-brown)",
            color: "var(--hbt-cream-soft)",
            padding: "16px 32px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  // ── Filled cart ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        padding: "20px 16px 48px",
        maxWidth: 1280,
        margin: "0 auto",
        background: "var(--hbt-cream-soft)",
        minHeight: "60vh",
      }}
    >
      <h1
        className="hbt-h-display"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", marginBottom: 4 }}
      >
        Your bag
      </h1>
      <p style={{ color: "var(--hbt-brown-soft)", marginBottom: 28 }}>
        {items.length} item{items.length !== 1 ? "s" : ""}, looking pretty
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 20,
        }}
        className="lg:grid-cols-[1.4fr_1fr] lg:gap-8"
      >
        {/* Items list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => {
            const price = itemPrice(item);
            const img = item.product.images.find((i) => i.isPrimary) ?? item.product.images[0];
            const isBasket = !!item.basketConfig;

            return (
              <div
                key={item.id}
                style={{
                  background: "var(--hbt-paper)",
                  borderRadius: "var(--hbt-r-lg)",
                  padding: 14,
                  border: "1px solid var(--hbt-line-soft)",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 14,
                  alignItems: "center",
                  opacity: isPending ? 0.6 : 1,
                  transition: "opacity .2s",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: 72,
                    aspectRatio: "1/1",
                    borderRadius: "var(--hbt-r-sm)",
                    overflow: "hidden",
                    background: item.product.swatch ?? "var(--hbt-cream-deep)",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {img && (
                    <Image
                      src={img.url}
                      alt={item.product.name_en}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--hbt-serif)",
                      fontSize: 16,
                      fontWeight: 500,
                      color: "var(--hbt-ink)",
                    }}
                  >
                    {isBasket ? "Gift Basket" : item.product.name_en}
                  </div>
                  {isBasket && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--hbt-brown-soft)",
                        marginTop: 2,
                      }}
                    >
                      Custom crochet bag · card included
                    </div>
                  )}
                  {!isBasket && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--hbt-brown-soft)",
                        marginBottom: 8,
                      }}
                    >
                      80g
                    </div>
                  )}

                  {/* Qty stepper + remove */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}
                  >
                    {!isBasket && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1.5px solid var(--hbt-line)",
                          borderRadius: 999,
                          padding: 2,
                        }}
                      >
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          disabled={isPending}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 999,
                            border: "none",
                            background: "transparent",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--hbt-ink)",
                          }}
                        >
                          <IconMinus size={12} />
                        </button>
                        <span
                          style={{
                            minWidth: 24,
                            textAlign: "center",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          disabled={isPending}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 999,
                            border: "none",
                            background: "transparent",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--hbt-ink)",
                          }}
                        >
                          <IconPlus size={12} />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: 12,
                        color: "var(--hbt-brown-soft)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                      }}
                    >
                      <IconTrash size={12} /> Remove
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--hbt-serif)",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "var(--hbt-ink)",
                    }}
                  >
                    ${price * item.quantity}
                  </div>
                  {!isBasket && item.quantity > 1 && (
                    <div
                      style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}
                    >
                      ${price} each
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Continue shopping */}
          <Link
            href="/products"
            style={{
              background: "none",
              padding: "12px 0",
              color: "var(--hbt-sage-deep)",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            <IconArrowLeft size={14} /> Keep shopping
          </Link>
        </div>

        {/* Order summary */}
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
                marginBottom: 16,
                color: "var(--hbt-ink)",
              }}
            >
              Order summary
            </h2>

            {/* Free delivery progress */}
            {amountToFreeDelivery > 0 && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 12px",
                  background: "var(--hbt-cream-deep)",
                  borderRadius: "var(--hbt-r-sm)",
                  fontSize: 12,
                  color: "var(--hbt-brown)",
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong>${amountToFreeDelivery}</strong> away from free delivery
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--hbt-line)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(subtotal / FREE_DELIVERY_THRESHOLD) * 100}%`,
                      height: "100%",
                      background: "var(--hbt-sage-deep)",
                      transition: "width .3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Promo code */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--hbt-brown)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Promo code
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{
                    flex: 1,
                    fontFamily: "var(--hbt-sans)",
                    fontSize: 14,
                    padding: "11px 14px",
                    borderRadius: "var(--hbt-r-sm)",
                    border: "1.5px solid var(--hbt-line)",
                    background: "var(--hbt-paper)",
                    color: "var(--hbt-ink)",
                    outline: "none",
                  }}
                  placeholder="WELCOME10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{
                    background: "transparent",
                    border: "1.5px solid var(--hbt-brown)",
                    color: "var(--hbt-ink)",
                    padding: "8px 16px",
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                </button>
              </div>

              {promoState?.applied && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--hbt-sage-deep)",
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <IconCheck size={14} /> {promoState.message}
                </div>
              )}
              {promoState && !promoState.applied && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--hbt-pink-deep)",
                    marginTop: 6,
                  }}
                >
                  {promoState.message}
                </div>
              )}
            </div>

            <hr
              style={{
                height: 1,
                background: "var(--hbt-line-soft)",
                border: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "16px 0",
              }}
            >
              <SumRow label="Subtotal" value={`$${subtotal}`} />
              {discount > 0 && (
                <SumRow
                  label="Discount"
                  value={`-$${discount}`}
                  color="var(--hbt-sage-deep)"
                />
              )}
              <SumRow
                label="Delivery"
                value={deliveryFee === 0 ? "Free" : `$${deliveryFee}`}
                sub={
                  deliveryFee === 0
                    ? subtotal >= FREE_DELIVERY_THRESHOLD
                      ? `On orders over $${FREE_DELIVERY_THRESHOLD}`
                      : "Promo applied"
                    : "Within Lebanon, 2–3 days"
                }
              />
            </div>

            <hr
              style={{
                height: 1,
                background: "var(--hbt-line-soft)",
                border: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--hbt-serif)",
                fontSize: 24,
                fontWeight: 500,
                padding: "16px 0 20px",
                color: "var(--hbt-ink)",
              }}
            >
              <span>Total</span>
              <span>${total}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              style={{
                width: "100%",
                background: "var(--hbt-brown)",
                color: "var(--hbt-cream-soft)",
                padding: "16px 32px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Checkout →
            </button>

            {/* WhatsApp note */}
            <div
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: "var(--hbt-sage-wash)",
                borderRadius: "var(--hbt-r-sm)",
                fontSize: 12,
                color: "var(--hbt-sage-deep)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconWhatsapp size={14} /> You&apos;ll confirm via WhatsApp · Cash on delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
