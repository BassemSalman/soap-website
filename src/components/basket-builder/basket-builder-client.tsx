"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addToCart } from "@/features/cart/actions";
import { BAG_SIZES, type BagSizeId } from "@/features/basket-builder/schemas";
import {
  IconCheck,
  IconArrow,
  IconArrowLeft,
} from "@/components/shared/icons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name_en: string;
  basePrice: string | number;
  salePrice?: string | number | null;
  isOnSale: boolean;
  images?: { url: string; isPrimary: boolean }[];
  swatch?: string | null;
  categories?: { category: { name_en: string } }[];
}

interface CardState {
  to: string;
  from: string;
  message: string;
}

interface BasketBuilderClientProps {
  products: Product[];
}

// ─── Bag config ───────────────────────────────────────────────────────────────

const BAG_COLORS = [
  { id: "sage",  name: "Sage",        fill: "#A8B89A" },
  { id: "pink",  name: "Dusty rose",  fill: "#E8C5B8" },
  { id: "beige", name: "Warm beige",  fill: "#D4B896" },
  { id: "cream", name: "Cream",       fill: "#ECE3D2" },
] as const;
type BagColorId = (typeof BAG_COLORS)[number]["id"];


const CARD_MAX = 280;

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  step,
  goToStep,
}: {
  step: number;
  goToStep: (n: number) => void;
}) {
  const steps = [
    { n: 1, label: "Pick products" },
    { n: 2, label: "Choose bag" },
    { n: 3, label: "Write a card" },
    { n: 4, label: "Review" },
  ];

  return (
    <div style={{ padding: "20px 16px 16px", maxWidth: 1080, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 4,
          position: "relative",
        }}
      >
        {steps.map((s) => {
          const isDone = s.n < step;
          const isCurrent = s.n === step;
          return (
            <button
              key={s.n}
              onClick={() => s.n < step && goToStep(s.n)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: s.n < step ? "pointer" : "default",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: isDone
                    ? "var(--hbt-sage-deep)"
                    : isCurrent
                    ? "var(--hbt-brown)"
                    : "var(--hbt-cream-deep)",
                  color:
                    isDone || isCurrent
                      ? "var(--hbt-cream-soft)"
                      : "var(--hbt-brown-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--hbt-serif)",
                  fontSize: 14,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {isDone ? <IconCheck size={14} /> : s.n}
              </span>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isCurrent
                    ? "var(--hbt-ink)"
                    : "var(--hbt-brown-soft)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1.1,
                }}
              >
                {s.label}
              </div>
            </button>
          );
        })}

        {/* Progress line */}
        <div
          style={{
            position: "absolute",
            top: 15,
            left: "calc(12.5% + 20px)",
            right: "calc(12.5% + 20px)",
            height: 2,
            background: "var(--hbt-cream-deep)",
            zIndex: -1,
          }}
        >
          <div
            style={{
              width: `${((step - 1) / 3) * 100}%`,
              height: "100%",
              background: "var(--hbt-sage-deep)",
              transition: "width .3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Pick Products ────────────────────────────────────────────────────

function Step1Pick({
  products,
  picks,
  togglePick,
}: {
  products: Product[];
  picks: string[];
  togglePick: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 className="hbt-h-section" style={{ fontSize: 22, color: "var(--hbt-ink)" }}>
          What would you like to include?
        </h2>
        <p style={{ color: "var(--hbt-brown-soft)", fontSize: 14, marginTop: 4 }}>
          Pick anything — soaps, creams, serums. Mix and match freely.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {products.map((p) => {
          const picked = picks.includes(p.id);
          const price = p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.basePrice);
          const primaryImg = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];

          return (
            <button
              key={p.id}
              onClick={() => togglePick(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                background: picked ? "var(--hbt-sage-wash)" : "var(--hbt-paper)",
                borderRadius: "var(--hbt-r-lg)",
                border: `1.5px solid ${picked ? "var(--hbt-sage-deep)" : "var(--hbt-line-soft)"}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "background .12s ease, border-color .12s ease",
                width: "100%",
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: p.swatch ?? "var(--hbt-cream-deep)",
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {primaryImg && (
                  <Image
                    src={primaryImg.url}
                    alt={p.name_en}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Name + category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--hbt-serif)",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--hbt-ink)",
                  lineHeight: 1.2,
                }}>
                  {p.name_en}
                </div>
                {p.categories?.[0]?.category.name_en && (
                  <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)", marginTop: 2 }}>
                    {p.categories[0].category.name_en}
                  </div>
                )}
              </div>

              {/* Price */}
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--hbt-ink)", flexShrink: 0 }}>
                ${price}
              </div>

              {/* Check indicator */}
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: `1.5px solid ${picked ? "var(--hbt-sage-deep)" : "var(--hbt-line)"}`,
                background: picked ? "var(--hbt-sage-deep)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background .12s ease, border-color .12s ease",
              }}>
                {picked && <span style={{ color: "white", display: "flex" }}><IconCheck size={12} /></span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Choose Bag ───────────────────────────────────────────────────────

function Step2Bag({
  wantBag,
  setWantBag,
  letter,
  setLetter,
  bagColor,
  setBagColor,
  bagSize,
  setBagSize,
}: {
  wantBag: boolean;
  setWantBag: (v: boolean) => void;
  letter: string;
  setLetter: (l: string) => void;
  bagColor: BagColorId;
  setBagColor: (c: BagColorId) => void;
  bagSize: BagSizeId;
  setBagSize: (s: BagSizeId) => void;
}) {
  const fill = BAG_COLORS.find((c) => c.id === bagColor)?.fill ?? "#A8B89A";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Want a bag? toggle ── */}
      <div style={{
        background: "var(--hbt-paper)",
        borderRadius: "var(--hbt-r-lg)",
        border: "1px solid var(--hbt-line-soft)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hbt-line-soft)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            Crochet bag
          </div>
          <div style={{ fontSize: 14, color: "var(--hbt-brown-soft)" }}>
            Hand-crocheted by aunties in our neighbourhood — optional but makes it a proper gift.
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {[true, false].map((val) => (
            <button
              key={String(val)}
              onClick={() => setWantBag(val)}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: wantBag === val ? "var(--hbt-sage-wash)" : "var(--hbt-paper)",
                border: "none",
                borderRight: val ? "1px solid var(--hbt-line-soft)" : "none",
                color: wantBag === val ? "var(--hbt-sage-deep)" : "var(--hbt-ink-soft)",
                fontWeight: wantBag === val ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "background .15s",
              }}
            >
              {val ? "Yes, add a bag" : "No bag — just the products"}
            </button>
          ))}
        </div>
      </div>

      {wantBag && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
          className="md:grid-cols-2 md:gap-12"
        >
          {/* Bag preview */}
          <div style={{
            background: "var(--hbt-cream)",
            borderRadius: "var(--hbt-r-xl)",
            padding: 28,
            aspectRatio: "1/1",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--hbt-line-soft)",
          }}>
            <div style={{ position: "relative", width: "80%", aspectRatio: "1/1.05" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: fill,
                borderRadius: "30% 30% 18% 18%",
                boxShadow: "var(--hbt-shadow-lg)",
                backgroundImage: "radial-gradient(circle at 8px 8px, rgba(92,74,58,0.18) 0 2.5px, transparent 2.5px)",
                backgroundSize: "20px 20px",
              }} />
              <div style={{
                position: "absolute", left: "20%", right: "20%", top: "-4%", height: "16%",
                borderTop: "5px solid var(--hbt-brown)",
                borderLeft: "5px solid var(--hbt-brown)",
                borderRight: "5px solid var(--hbt-brown)",
                borderRadius: "999px 999px 0 0",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--hbt-serif)", fontStyle: "italic",
                fontSize: 130, fontWeight: 400,
                color: "var(--hbt-brown)", opacity: 0.7, letterSpacing: "-0.04em",
              }}>
                {letter}
              </div>
            </div>
          </div>

          {/* Pickers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Size */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Bag size
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {BAG_SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setBagSize(s.id)}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      borderRadius: "var(--hbt-r-sm)",
                      border: bagSize === s.id ? "2px solid var(--hbt-brown)" : "1.5px solid var(--hbt-line)",
                      background: bagSize === s.id ? "var(--hbt-brown)" : "var(--hbt-paper)",
                      color: bagSize === s.id ? "var(--hbt-cream-soft)" : "var(--hbt-ink)",
                      cursor: "pointer",
                      textAlign: "center" as const,
                    }}
                  >
                    <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 18, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{s.note}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>+${s.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Letter */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Initial
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, marginBottom: 24 }}>
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((L) => (
                  <button
                    key={L}
                    onClick={() => setLetter(L)}
                    style={{
                      aspectRatio: "1/1", borderRadius: 10,
                      border: letter === L ? "2px solid var(--hbt-brown)" : "1.5px solid var(--hbt-line)",
                      background: letter === L ? "var(--hbt-brown)" : "var(--hbt-paper)",
                      color: letter === L ? "var(--hbt-cream-soft)" : "var(--hbt-ink)",
                      fontFamily: "var(--hbt-serif)", fontSize: 16, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    {L}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Bag colour
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {BAG_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setBagColor(c.id)}
                    style={{
                      padding: "4px 4px 4px 6px", borderRadius: 999,
                      border: bagColor === c.id ? "2px solid var(--hbt-brown)" : "1.5px solid var(--hbt-line)",
                      background: "var(--hbt-paper)",
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", fontSize: 13, fontWeight: 600,
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: 999,
                      background: c.fill,
                      backgroundImage: "radial-gradient(circle at 4px 4px, rgba(92,74,58,0.2) 0 1.5px, transparent 1.5px)",
                      backgroundSize: "8px 8px",
                      border: "1px solid rgba(92,74,58,0.18)",
                      display: "inline-block",
                    }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Write Card ───────────────────────────────────────────────────────

function Step3Card({
  card,
  setCard,
}: {
  card: CardState;
  setCard: (c: CardState) => void;
}) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
      className="md:grid-cols-2 md:gap-12"
    >
      {/* Form */}
      <div>
        <h2
          className="hbt-h-section"
          style={{ fontSize: 22, marginBottom: 6, color: "var(--hbt-ink)" }}
        >
          Write something good
        </h2>
        <p style={{ color: "var(--hbt-brown-soft)", fontSize: 14, marginBottom: 20 }}>
          We print this on recycled paper, fold it once, slip it into the bag
          with a sprig of dried lavender.
        </p>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--hbt-brown)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              To
            </label>
            <input
              style={{
                width: "100%",
                fontFamily: "var(--hbt-sans)",
                fontSize: 14,
                padding: "13px 16px",
                borderRadius: "var(--hbt-r-sm)",
                border: "1.5px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                color: "var(--hbt-ink)",
                outline: "none",
              }}
              placeholder="Layla"
              value={card.to}
              onChange={(e) => setCard({ ...card, to: e.target.value })}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--hbt-brown)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              From
            </label>
            <input
              style={{
                width: "100%",
                fontFamily: "var(--hbt-sans)",
                fontSize: 14,
                padding: "13px 16px",
                borderRadius: "var(--hbt-r-sm)",
                border: "1.5px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                color: "var(--hbt-ink)",
                outline: "none",
              }}
              placeholder="Jad"
              value={card.from}
              onChange={(e) => setCard({ ...card, from: e.target.value })}
            />
          </div>

          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--hbt-brown)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              <span>Your message</span>
              <span
                style={{
                  color:
                    card.message.length > CARD_MAX
                      ? "var(--hbt-pink-deep)"
                      : "var(--hbt-brown-soft)",
                }}
              >
                {card.message.length}/{CARD_MAX}
              </span>
            </label>
            <textarea
              rows={6}
              maxLength={CARD_MAX}
              placeholder="Habibti, take a slow morning…"
              value={card.message}
              onChange={(e) => setCard({ ...card, message: e.target.value })}
              style={{
                width: "100%",
                fontFamily: "var(--hbt-serif)",
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.5,
                padding: "13px 16px",
                borderRadius: "var(--hbt-r-sm)",
                border: "1.5px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                color: "var(--hbt-ink)",
                outline: "none",
                resize: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--hbt-brown)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          Preview
        </div>
        <div
          style={{
            background: "var(--hbt-paper)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 32,
            minHeight: 240,
            border: "1px dashed var(--hbt-line)",
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 30px, rgba(92,74,58,0.06) 30px, rgba(92,74,58,0.06) 31px)",
            backgroundPosition: "0 16px",
          }}
        >
          {card.to && (
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontStyle: "italic",
                fontSize: 18,
                marginBottom: 16,
                color: "var(--hbt-ink)",
              }}
            >
              Dear {card.to},
            </div>
          )}
          <div
            style={{
              fontFamily: "var(--hbt-serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--hbt-ink)",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {card.message || (
              <span style={{ color: "var(--hbt-brown-soft)" }}>
                Your handwritten note will appear here…
              </span>
            )}
          </div>
          {card.from && (
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontStyle: "italic",
                fontSize: 16,
                marginTop: 24,
                textAlign: "right",
                color: "var(--hbt-ink)",
              }}
            >
              — {card.from}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function Step4Review({
  picks,
  letter,
  bagColor,
  card,
  total,
  products,
  wantBag,
  bagSize,
}: {
  picks: string[];
  letter: string;
  bagColor: BagColorId;
  card: CardState;
  total: number;
  products: Product[];
  wantBag: boolean;
  bagSize: BagSizeId;
}) {
  const bagPrice = wantBag ? (BAG_SIZES.find((s) => s.id === bagSize)?.price ?? 8) : 0;
  const colorFill = BAG_COLORS.find((c) => c.id === bagColor)?.fill ?? "#A8B89A";
  const pickedProducts = picks.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

  return (
    <div>
      <h2
        className="hbt-h-section"
        style={{
          fontSize: 22,
          marginBottom: 24,
          textAlign: "center",
          color: "var(--hbt-ink)",
        }}
      >
        Here&apos;s your basket
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
          background: "var(--hbt-paper)",
          borderRadius: "var(--hbt-r-xl)",
          padding: 20,
          border: "1px solid var(--hbt-line-soft)",
        }}
        className="md:grid-cols-2 md:p-8"
      >
        {/* Products list + totals */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--hbt-brown)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Products ({picks.length})
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pickedProducts.map((p) => {
              const price = p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.basePrice);
              const img = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
              return (
                <div
                  key={p.id}
                  style={{ display: "flex", gap: 12, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: p.swatch ?? "var(--hbt-cream-deep)",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {img && (
                      <Image
                        src={img.url}
                        alt={p.name_en}
                        fill
                        sizes="50px"
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
                      {p.name_en}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}
                    >
                      {p.categories?.[0]?.category.name_en ?? ""}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>${price}</div>
                </div>
              );
            })}
          </div>

          <hr
            style={{
              height: 1,
              background: "var(--hbt-line-soft)",
              border: 0,
              margin: "20px 0",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "var(--hbt-ink)",
            }}
          >
            <span>Products subtotal</span>
            <span>${total}</span>
          </div>
          {wantBag && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 6,
                color: "var(--hbt-ink)",
              }}
            >
              <span>Crochet bag ({bagSize}) + card</span>
              <span>${bagPrice}</span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--hbt-serif)",
              fontSize: 22,
              marginTop: 14,
              fontWeight: 500,
              color: "var(--hbt-ink)",
            }}
          >
            <span>Total</span>
            <span>${total + bagPrice}</span>
          </div>
        </div>

        {/* Visual bag + card preview */}
        <div
          style={{
            background: "var(--hbt-sage-wash)",
            borderRadius: "var(--hbt-r-lg)",
            padding: 24,
            position: "relative",
            overflow: "hidden",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {wantBag ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 60,
                    aspectRatio: "1/1.05",
                    background: colorFill,
                    borderRadius: "30% 30% 18% 18%",
                    backgroundImage:
                      "radial-gradient(circle at 6px 6px, rgba(92,74,58,0.2) 0 1.5px, transparent 1.5px)",
                    backgroundSize: "12px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--hbt-serif)",
                    fontStyle: "italic",
                    fontSize: 32,
                    color: "var(--hbt-brown)",
                  }}
                >
                  {letter}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--hbt-brown)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 2,
                    }}
                  >
                    The bag
                  </div>
                  <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 18, color: "var(--hbt-ink)" }}>
                    Initial {letter}, {bagColor} · {bagSize}
                  </div>
                </div>
              </div>
              <hr style={{ height: 1, background: "var(--hbt-line-soft)", border: 0 }} />
            </>
          ) : (
            <div style={{ fontFamily: "var(--hbt-serif)", fontStyle: "italic", fontSize: 16, color: "var(--hbt-brown-soft)" }}>
              No crochet bag — just the products, packed and ready.
            </div>
          )}

          {(card.message || card.to) && (
            <div
              style={{
                background: "var(--hbt-paper)",
                borderRadius: "var(--hbt-r)",
                padding: 16,
                transform: "rotate(-1.5deg)",
                boxShadow: "var(--hbt-shadow-sm)",
              }}
            >
              {card.to && (
                <div
                  style={{
                    fontFamily: "var(--hbt-serif)",
                    fontStyle: "italic",
                    fontSize: 14,
                    marginBottom: 4,
                    color: "var(--hbt-ink)",
                  }}
                >
                  Dear {card.to},
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--hbt-serif)",
                  fontStyle: "italic",
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  color: "var(--hbt-ink-soft)",
                }}
              >
                {card.message || "(no message)"}
              </div>
              {card.from && (
                <div
                  style={{
                    fontFamily: "var(--hbt-serif)",
                    fontStyle: "italic",
                    fontSize: 13,
                    marginTop: 8,
                    textAlign: "right",
                    color: "var(--hbt-ink)",
                  }}
                >
                  — {card.from}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function BasketBuilderClient({ products }: BasketBuilderClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);
  const [picks, setPicks] = useState<string[]>([]);
  const [wantBag, setWantBag] = useState(true);
  const [letter, setLetter] = useState("L");
  const [bagColor, setBagColor] = useState<BagColorId>("sage");
  const [bagSize, setBagSize] = useState<BagSizeId>("M");
  const [card, setCard] = useState<CardState>({ to: "", from: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  const togglePick = (id: string) => {
    if (picks.includes(id)) {
      setPicks(picks.filter((p) => p !== id));
    } else {
      setPicks([...picks, id]);
    }
  };

  const bagPrice = wantBag ? (BAG_SIZES.find((s) => s.id === bagSize)?.price ?? 8) : 0;

  const total = picks.reduce((sum, id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return sum;
    const price = p.isOnSale && p.salePrice ? Number(p.salePrice) : Number(p.basePrice);
    return sum + price;
  }, 0);

  const canNext =
    (step === 1 && picks.length >= 1) ||
    step === 2 ||
    (step === 3 && (!wantBag || (card.to.trim().length > 0 && card.message.trim().length > 0)));

  async function handleAddToCart() {
    setError(null);
    startTransition(async () => {
      try {
        const firstProductId = picks[0];
        if (!firstProductId) return;

        const result = await addToCart({
          productId: firstProductId,
          quantity: 1,
          basketConfig: {
            selectedProductIds: picks,
            bagLetter: letter,
            cardMessage: card.message || undefined,
            wantBag,
            bagSize: wantBag ? bagSize : undefined,
          },
        });

        if (result?.error) {
          setError(result.error);
          return;
        }

        router.push("/cart");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  const stepLabels: Record<number, string> = {
    1: picks.length === 0 ? "Nothing selected yet" : `${picks.length} item${picks.length !== 1 ? "s" : ""} selected`,
    2: `Bag — initial ${letter}`,
    3: "Your card",
    4: "Ready to send",
  };

  const nextBtnLabel: Record<number, string> = {
    1: "Choose a bag",
    2: "Write a card",
    3: "Review",
  };

  return (
    <div
      style={{
        background: "var(--hbt-cream-soft)",
        minHeight: "70vh",
      }}
    >
      {/* Page header */}
      <section
        style={{
          padding: "20px 16px 12px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div className="hbt-eyebrow" style={{ marginBottom: 8 }}>
          The signature gift
        </div>
        <h1
          className="hbt-h-display"
          style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
        >
          Build a <em>gift</em> basket
        </h1>
        <p
          style={{
            color: "var(--hbt-brown-soft)",
            marginTop: 8,
            fontSize: 14,
          }}
        >
          Crochet bag · 2–5 products · a card you write yourself.
        </p>
      </section>

      {/* Progress bar */}
      <ProgressBar step={step} goToStep={setStep} />

      {/* Step content */}
      <section
        style={{
          padding: "16px 16px 120px",
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        {step === 1 && (
          <Step1Pick
            products={products}
            picks={picks}
            togglePick={togglePick}
          />
        )}
        {step === 2 && (
          <Step2Bag
            wantBag={wantBag}
            setWantBag={setWantBag}
            letter={letter}
            setLetter={setLetter}
            bagColor={bagColor}
            setBagColor={setBagColor}
            bagSize={bagSize}
            setBagSize={setBagSize}
          />
        )}
        {step === 3 && (
          <Step3Card card={card} setCard={setCard} />
        )}
        {step === 4 && (
          <Step4Review
            picks={picks}
            letter={letter}
            bagColor={bagColor}
            card={card}
            total={total}
            products={products}
            wantBag={wantBag}
            bagSize={bagSize}
          />
        )}

        {error && (
          <p
            style={{
              marginTop: 16,
              color: "var(--hbt-pink-deep)",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </section>

      {/* Sticky bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: "rgba(255, 252, 247, 0.96)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid var(--hbt-line)",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Left: summary */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--hbt-brown-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              {stepLabels[step]}
            </div>
            <div
              style={{
                fontFamily: "var(--hbt-serif)",
                fontSize: 22,
                fontWeight: 500,
                color: "var(--hbt-ink)",
              }}
            >
              ${total + bagPrice}{" "}
              <span
                style={{
                  fontSize: 12,
                  color: "var(--hbt-brown-soft)",
                  fontWeight: 400,
                }}
              >
                {wantBag ? "incl. bag & card" : "products only"}
              </span>
            </div>
          </div>

          {/* Right: nav buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: "transparent",
                  color: "var(--hbt-ink)",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 22px",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                <IconArrowLeft size={16} /> Back
              </button>
            )}

            {step < 4 && (
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                style={{
                  background: "var(--hbt-brown)",
                  color: "var(--hbt-cream-soft)",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 22px",
                  borderRadius: 999,
                  cursor: canNext ? "pointer" : "not-allowed",
                  opacity: canNext ? 1 : 0.5,
                }}
              >
                {nextBtnLabel[step]} <IconArrow size={16} />
              </button>
            )}

            {step === 4 && (
              <button
                disabled={isPending}
                onClick={handleAddToCart}
                style={{
                  background: "var(--hbt-sage-deep)",
                  color: "var(--hbt-cream-soft)",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "12px 22px",
                  borderRadius: 999,
                  cursor: isPending ? "not-allowed" : "pointer",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Adding…" : "Add basket to bag"}
                {!isPending && <IconArrow size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
