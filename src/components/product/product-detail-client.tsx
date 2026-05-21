"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  IconLeaf,
  IconHeart,
  IconPlus,
  IconMinus,
} from "@/components/shared/icons";
import { addToCart } from "@/features/cart/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductImage = { url: string; isPrimary: boolean; sortOrder: number };
type ProductCategoryRef = { category: { slug: string; name_en: string } };

export type DetailProduct = {
  id: string;
  slug: string;
  name_en: string;
  description_en: string | null;
  benefits_en: string | null;
  ingredients_en: string | null;
  targetAudience_en: string | null;
  basePrice: string;
  salePrice: string | null;
  isOnSale: boolean;
  isFeatured: boolean;
  stockQty: number;
  images: ProductImage[];
  categories: ProductCategoryRef[];
  type: string;
  sku: string;
};

export type RelatedProduct = {
  id: string;
  slug: string;
  name_en: string;
  description_en: string | null;
  basePrice: string;
  salePrice: string | null;
  isOnSale: boolean;
  isFeatured: boolean;
  stockQty: number;
  images: ProductImage[];
  categories: ProductCategoryRef[];
};

interface ProductDetailClientProps {
  product: DetailProduct;
  relatedProducts: RelatedProduct[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function splitLines(text: string | null): string[] {
  if (!text) return [];
  return text.split(/\n|·|•/).map((s) => s.trim()).filter(Boolean);
}

function splitBadges(text: string | null): string[] {
  if (!text) return [];
  return text.split(/,|·|•/).map((s) => s.trim()).filter(Boolean);
}

const qtyBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 999,
  border: "none", background: "transparent",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"benefits" | "ingredients" | "for-who">("benefits");
  const [isDesktop, setIsDesktop] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Gallery: use real images or fallback to a single placeholder slot
  const gallery = product.images.length > 0
    ? product.images
    : [{ url: "", isPrimary: true, sortOrder: 0 }];

  const activeImageUrl = gallery[activeImg]?.url;
  const firstCategory = product.categories[0]?.category;
  const displayPrice = product.isOnSale && product.salePrice
    ? Number(product.salePrice)
    : Number(product.basePrice);
  const crossedPrice = product.isOnSale && product.salePrice ? Number(product.basePrice) : null;

  const benefits = splitLines(product.benefits_en);
  const ingredients = splitBadges(product.ingredients_en);
  const targetAudience = product.targetAudience_en;

  // Swatch color based on first category
  const swatchMap: Record<string, string> = {
    soaps: "#F4DCD3",
    creams: "#E4EADB",
    serums: "#E5D3B5",
    loafs: "#ECE3D2",
  };
  const swatch = swatchMap[firstCategory?.slug ?? ""] ?? "#FAF6F0";

  function handleAddToCart() {
    startTransition(async () => {
      try {
        await addToCart({ productId: product.id, quantity: qty });
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
      } catch {
        // If unauthenticated, redirect to sign-in
        router.push("/auth/sign-in");
      }
    });
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{
        padding: isDesktop ? "16px 32px" : "10px 16px",
        background: "var(--hbt-cream-soft)",
        borderBottom: "1px solid var(--hbt-line-soft)",
        fontSize: 12, color: "var(--hbt-brown-soft)",
        maxWidth: 1280, margin: "0 auto",
      }}>
        <Link href="/" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>Home</Link>
        <span style={{ margin: "0 6px" }}>/</span>
        <Link href="/products" style={{ cursor: "pointer", color: "inherit", textDecoration: "none" }}>Shop</Link>
        {firstCategory && (
          <>
            <span style={{ margin: "0 6px" }}>/</span>
            <span style={{ color: "var(--hbt-ink)" }}>{firstCategory.name_en}</span>
          </>
        )}
      </div>

      {/* Main section */}
      <section style={{
        maxWidth: 1280, margin: "0 auto",
        padding: isDesktop ? "32px 32px 64px" : "16px 16px 32px",
        display: "grid",
        gridTemplateColumns: isDesktop ? "1.05fr 1fr" : "1fr",
        gap: isDesktop ? 48 : 20,
      }}>
        {/* Gallery */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "72px 1fr" : "1fr", gap: 12 }}>
            {/* Desktop thumbs */}
            {isDesktop && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      aspectRatio: "1/1", borderRadius: 12,
                      border: i === activeImg ? "2px solid var(--hbt-brown)" : "1.5px solid var(--hbt-line)",
                      overflow: "hidden", padding: 0,
                      background: swatch, cursor: "pointer",
                    }}
                  >
                    {img.url && (
                      <img
                        src={img.url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div style={{
              background: swatch,
              borderRadius: "var(--hbt-r-lg)",
              aspectRatio: "1/1",
              overflow: "hidden", position: "relative",
            }}>
              {activeImageUrl && (
                <img
                  src={activeImageUrl}
                  alt={product.name_en}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div style={{
                position: "absolute", bottom: 16, left: 16,
                padding: "6px 12px",
                background: "rgba(255,252,247,0.92)",
                borderRadius: 999, fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Batch #024 · April</div>
            </div>
          </div>

          {/* Mobile thumb row */}
          {!isDesktop && (
            <div style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto" }}>
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    flex: "0 0 64px", aspectRatio: "1/1", borderRadius: 10,
                    border: i === activeImg ? "2px solid var(--hbt-brown)" : "1.5px solid var(--hbt-line)",
                    overflow: "hidden", padding: 0, background: swatch, cursor: "pointer",
                  }}
                >
                  {img.url && (
                    <img
                      src={img.url}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Badges */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {firstCategory && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: "var(--hbt-r-pill)",
                fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
                background: "var(--hbt-sage-wash)", color: "var(--hbt-sage-deep)",
              }}>{firstCategory.name_en}</span>
            )}
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: isDesktop ? 48 : 32,
            fontWeight: 500, lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}>{product.name_en}</h1>

          {/* Description */}
          {product.description_en && (
            <p style={{ color: "var(--hbt-brown-soft)", fontSize: isDesktop ? 16 : 14, lineHeight: 1.55, marginBottom: 20 }}>
              {product.description_en}
            </p>
          )}

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--hbt-serif)", fontSize: 32, fontWeight: 500 }}>
              ${displayPrice}
            </span>
            {crossedPrice !== null && (
              <span style={{ fontSize: 16, color: "var(--hbt-brown-soft)", textDecoration: "line-through" }}>
                ${crossedPrice}
              </span>
            )}
            <span style={{ fontSize: 13, color: "var(--hbt-brown-soft)" }}>· 80g bar / 6-week cure</span>
          </div>

          {/* Qty + Add to bag */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <div style={{
              display: "flex", alignItems: "center",
              border: "1.5px solid var(--hbt-line)",
              borderRadius: 999, padding: "4px",
            }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtnStyle}>
                <IconMinus size={14} />
              </button>
              <span style={{ minWidth: 32, textAlign: "center", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={qtyBtnStyle}>
                <IconPlus size={14} />
              </button>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={handleAddToCart}
              disabled={isPending}
            >
              {addedFeedback
                ? "Added ✓"
                : isPending
                  ? "Adding…"
                  : `Add to bag · $${(displayPrice * qty).toFixed(2)}`}
            </button>
          </div>

          {/* Save for later */}
          <button className="btn btn-outline btn-block" style={{ marginBottom: 24 }}>
            <IconHeart size={16} /> Save for later
          </button>

          {/* Tabs */}
          <div style={{ borderTop: "1px solid var(--hbt-line-soft)", paddingTop: 18, marginTop: 4 }}>
            <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--hbt-line-soft)", marginBottom: 16 }}>
              {([
                ["benefits",    "Benefits"],
                ["ingredients", "Ingredients"],
                ["for-who",     "Who it&apos;s for"],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  style={{
                    background: "none", border: "none",
                    padding: "8px 0 12px",
                    fontFamily: "var(--hbt-sans)", fontSize: 13, fontWeight: 600,
                    color: tab === k ? "var(--hbt-ink)" : "var(--hbt-brown-soft)",
                    borderBottom: tab === k ? "2px solid var(--hbt-brown)" : "2px solid transparent",
                    marginBottom: -1, cursor: "pointer",
                  }}
                >{l === "Who it&apos;s for" ? "Who it's for" : l}</button>
              ))}
            </div>

            <div style={{ minHeight: 120 }}>
              {tab === "benefits" && (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {benefits.length > 0 ? benefits.map((b, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--hbt-sage-deep)", marginTop: 3 }}><IconLeaf size={16} /></span>
                      <span style={{ fontSize: 14 }}>{b}</span>
                    </li>
                  )) : (
                    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "var(--hbt-sage-deep)", marginTop: 3 }}><IconLeaf size={16} /></span>
                      <span style={{ fontSize: 14 }}>Handmade with Lebanese olive oil and natural botanicals.</span>
                    </li>
                  )}
                </ul>
              )}

              {tab === "ingredients" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ingredients.length > 0 ? ingredients.map((ing) => (
                    <span key={ing} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: "var(--hbt-r-pill)",
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
                      background: "var(--hbt-cream-deep)", color: "var(--hbt-brown)",
                    }}>{ing}</span>
                  )) : (
                    <span style={{ fontSize: 14, color: "var(--hbt-brown-soft)" }}>
                      Ingredient list available on product packaging.
                    </span>
                  )}
                  <p style={{ marginTop: 12, fontSize: 12, color: "var(--hbt-brown-soft)", flexBasis: "100%" }}>
                    All ingredients sourced within Lebanon where possible. No parabens, no synthetic fragrance, no SLS.
                  </p>
                </div>
              )}

              {tab === "for-who" && (
                <p style={{
                  fontFamily: "var(--hbt-serif)", fontStyle: "italic",
                  fontSize: 18, color: "var(--hbt-ink)", lineHeight: 1.5,
                  padding: "12px 16px",
                  borderLeft: "3px solid var(--hbt-sage)",
                  background: "var(--hbt-sage-wash)",
                  borderRadius: "0 var(--hbt-r) var(--hbt-r) 0",
                }}>
                  &ldquo;{targetAudience ?? "For anyone who values slow, honest skincare."}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: isDesktop ? "0 32px 80px" : "0 16px 48px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="hbt-eyebrow" style={{ marginBottom: 6 }}>You might also like</div>
          <h2
            className="hbt-h-section"
            style={{ fontSize: isDesktop ? 28 : 22, marginBottom: 20 }}
          >
            From the same kitchen
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
            gap: isDesktop ? 20 : 12,
          }}>
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  category: p.categories[0]?.category.name_en,
                }}
                compact={!isDesktop}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
