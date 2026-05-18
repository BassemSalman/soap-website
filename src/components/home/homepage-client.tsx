"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BotanicalAccent } from "@/components/shared/botanical-accent";
import { TrustRow } from "@/components/shared/trust-row";
import { ProductCard } from "@/components/product/product-card";
import { IconArrow, IconGift } from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductImage = { url: string; isPrimary: boolean; sortOrder: number };
type ProductCategory = { category: { slug: string; name_en: string; name_ar: string } };

export type HomepageProduct = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  basePrice: string;
  salePrice: string | null;
  isOnSale: boolean;
  isFeatured: boolean;
  stockQty: number;
  images: ProductImage[];
  categories: ProductCategory[];
};

export type HomepageCategory = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  imageUrl: string | null;
  _count: { products: number };
};

interface HomepageClientProps {
  featuredProducts: HomepageProduct[];
  categories: HomepageCategory[];
}

// ─── Category colour palette ──────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  soaps:   "var(--hbt-pink-soft)",
  creams:  "var(--hbt-sage-wash)",
  serums:  "var(--hbt-beige-soft)",
  loafs:   "var(--hbt-cream-deep)",
  default: "var(--hbt-cream-soft)",
};

function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? CATEGORY_COLORS.default;
}

// ─── Hero collage ─────────────────────────────────────────────────────────────

function HeroCollage({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    return (
      <div style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 540, marginLeft: "auto" }}>
        {/* Big main image */}
        <div style={{
          position: "absolute", top: "8%", left: "6%", width: "74%", aspectRatio: "1/1.1",
          borderRadius: "var(--hbt-r-xl)", overflow: "hidden",
          background: "var(--hbt-sage-soft)",
          boxShadow: "var(--hbt-shadow-lg)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&q=80&auto=format&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
        {/* Small top-right card */}
        <div style={{
          position: "absolute", top: "0%", right: "0%", width: "40%", aspectRatio: "1/1",
          borderRadius: "var(--hbt-r-lg)", overflow: "hidden",
          background: "var(--hbt-pink-soft)",
          boxShadow: "var(--hbt-shadow)",
          transform: "rotate(4deg)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
        {/* Bottom-right card */}
        <div style={{
          position: "absolute", bottom: "-3%", right: "8%", width: "44%", aspectRatio: "1/1",
          borderRadius: "var(--hbt-r-lg)", overflow: "hidden",
          background: "var(--hbt-beige)",
          boxShadow: "var(--hbt-shadow)",
          transform: "rotate(-3deg)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80&auto=format&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
        {/* Note tag */}
        <div style={{
          position: "absolute", bottom: "12%", left: "-4%",
          padding: "10px 16px",
          background: "var(--hbt-paper)",
          borderRadius: "var(--hbt-r)",
          boxShadow: "var(--hbt-shadow)",
          border: "1px solid var(--hbt-line-soft)",
          maxWidth: 200,
          transform: "rotate(-3deg)",
        }}>
          <div style={{ fontFamily: "var(--hbt-serif)", fontStyle: "italic", fontSize: 14, lineHeight: 1.35 }}>
            &ldquo;Smells like my teta&apos;s garden.&rdquo;
          </div>
          <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)", marginTop: 4 }}>— Layla, Beirut</div>
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", marginTop: 8 }}>
      <div style={{
        position: "absolute", top: "5%", left: "0%", width: "62%", aspectRatio: "1/1.1",
        borderRadius: "var(--hbt-r-lg)", overflow: "hidden",
        background: "var(--hbt-sage-soft)", boxShadow: "var(--hbt-shadow)",
      }}>
        <img
          src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80&auto=format&fit=crop"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
      <div style={{
        position: "absolute", top: "0%", right: "0%", width: "44%", aspectRatio: "1/1",
        borderRadius: "var(--hbt-r)", overflow: "hidden",
        background: "var(--hbt-pink-soft)",
        transform: "rotate(4deg)", boxShadow: "var(--hbt-shadow)",
      }}>
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80&auto=format&fit=crop"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
      <div style={{
        position: "absolute", bottom: "0%", right: "5%", width: "50%", aspectRatio: "1/1",
        borderRadius: "var(--hbt-r)", overflow: "hidden",
        background: "var(--hbt-beige)",
        transform: "rotate(-3deg)", boxShadow: "var(--hbt-shadow)",
      }}>
        <img
          src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80&auto=format&fit=crop"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
    </div>
  );
}

// ─── Gift basket mockup ───────────────────────────────────────────────────────

function GiftBasketMockup({ isDesktop }: { isDesktop: boolean }) {
  return (
    <div style={{
      position: "relative",
      aspectRatio: isDesktop ? "1/1" : "1/0.85",
      width: "100%",
      maxWidth: isDesktop ? 520 : "none",
    }}>
      {/* Crochet bag body */}
      <div style={{
        position: "absolute", inset: "8% 6%",
        background: "var(--hbt-beige-soft)",
        borderRadius: "30% 30% 18% 18%",
        boxShadow: "var(--hbt-shadow-lg)",
        overflow: "hidden",
      }}>
        {/* Crochet pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 8px 8px, rgba(92,74,58,0.15) 0 2.5px, transparent 2.5px)",
          backgroundSize: "20px 20px",
        }} />
        {/* Big initial */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--hbt-serif)",
          fontStyle: "italic",
          fontSize: isDesktop ? 240 : 160,
          fontWeight: 400,
          color: "var(--hbt-sage-deep)",
          opacity: 0.55,
          letterSpacing: "-0.04em",
        }}>L</div>
      </div>
      {/* Handles */}
      <div style={{
        position: "absolute", left: "20%", right: "20%", top: "2%", height: "12%",
        borderTop: "6px solid var(--hbt-brown)",
        borderLeft: "6px solid var(--hbt-brown)",
        borderRight: "6px solid var(--hbt-brown)",
        borderRadius: "999px 999px 0 0",
        borderBottom: "none",
      }} />
      {/* Peeking soap */}
      <div style={{
        position: "absolute", top: "20%", left: "22%", width: "30%", aspectRatio: "1.2/1",
        background: "var(--hbt-pink-soft)",
        borderRadius: 12,
        boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
      }} />
      {/* Card */}
      <div style={{
        position: "absolute", bottom: "8%", right: "4%",
        width: isDesktop ? "44%" : "50%",
        padding: "14px 16px",
        background: "var(--hbt-paper)",
        borderRadius: "var(--hbt-r)",
        boxShadow: "var(--hbt-shadow)",
        border: "1px solid var(--hbt-line-soft)",
        transform: "rotate(-4deg)",
      }}>
        <div style={{ fontFamily: "var(--hbt-serif)", fontStyle: "italic", fontSize: 14, color: "var(--hbt-ink)", lineHeight: 1.4 }}>
          &ldquo;Habibti, take<br/>a slow morning.<br/>— J&rdquo;
        </div>
      </div>
      {/* Botanical sprig */}
      <div style={{ position: "absolute", top: "28%", right: "16%", width: 60, height: 60 }}>
        <BotanicalAccent variant="a" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  isDesktop,
  flush = false,
}: {
  eyebrow: string;
  title: string;
  isDesktop: boolean;
  flush?: boolean;
}) {
  return (
    <div style={{ marginBottom: flush ? 0 : isDesktop ? 36 : 20 }}>
      <div className="hbt-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
      <h2
        className="hbt-h-section"
        style={{ fontSize: isDesktop ? 36 : 26 }}
      >
        {title}
      </h2>
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────

function CategoryCard({
  cat,
  onClick,
  accentLarge,
}: {
  cat: HomepageCategory;
  onClick: () => void;
  accentLarge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: getCategoryColor(cat.slug),
        border: "none",
        borderRadius: "var(--hbt-r-lg)",
        padding: 0,
        overflow: "hidden",
        position: "relative",
        aspectRatio: accentLarge ? "2 / 1" : "1 / 1.05",
        gridColumn: accentLarge ? "span 2" : "auto",
        cursor: "pointer",
        transition: "transform .2s ease",
        textAlign: "left",
        color: "var(--hbt-ink)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
    >
      {cat.imageUrl && (
        <img
          src={cat.imageUrl}
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.55, mixBlendMode: "multiply",
          }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
      <div style={{
        position: "absolute", inset: 0,
        padding: 16,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        background: "linear-gradient(transparent 50%, rgba(42,34,24,0.15))",
      }}>
        <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 22, fontWeight: 500, color: "var(--hbt-ink)" }}>
          {cat.name_en}
        </div>
        <div style={{ fontSize: 12, color: "var(--hbt-ink-soft)", marginTop: 2 }}>
          {cat._count.products} products
        </div>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HomepageClient({ featuredProducts, categories }: HomepageClientProps) {
  const router = useRouter();

  // Use a simple CSS media query approach via state
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        padding: isDesktop ? "64px 32px 96px" : "32px 20px 56px",
        background: "var(--hbt-cream)",
        overflow: "hidden",
      }}>
        <BotanicalAccent
          style={{ position: "absolute", top: 40, right: -20, opacity: 0.45, width: 220 }}
          variant="a"
        />
        <BotanicalAccent
          style={{ position: "absolute", bottom: 20, left: -30, opacity: 0.35, width: 180 }}
          variant="b"
        />
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.05fr 1fr" : "1fr",
          gap: isDesktop ? 56 : 28,
          alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
          <div>
            <div className="hbt-eyebrow hbt-sprig" style={{ marginBottom: 18 }}>
              Made by hand in Beirut · est. 2023
            </div>
            <h1
              className="hbt-h-display"
              style={{ fontSize: isDesktop ? 76 : 44, marginBottom: 20, fontWeight: 400 }}
            >
              Treat yourself.<br />
              Gift <em>someone</em> you love.
            </h1>
            <p style={{
              fontSize: isDesktop ? 18 : 15,
              color: "var(--hbt-brown-soft)",
              lineHeight: 1.55,
              maxWidth: 480,
              marginBottom: 28,
            }}>
              Soap, cream and serum made slowly — with Lebanese olive oil, garden herbs and small kitchens.
              Every order leaves with a hand-crochet bag, a card and a note.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                onClick={() => router.push("/products")}
                className="btn btn-primary btn-lg"
              >
                Shop now <IconArrow />
              </button>
              <button
                onClick={() => router.push("/basket-builder")}
                className="btn btn-outline btn-lg"
              >
                <IconGift /> Build a gift basket
              </button>
            </div>
            {/* Social proof */}
            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {(["#A8B89A", "#E8C5B8", "#D4B896"] as const).map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32, height: 32, borderRadius: 999,
                      background: c,
                      border: "2px solid var(--hbt-cream)",
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>★★★★★ 4.9 · 320+ reviews</div>
                <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>From customers across Lebanon</div>
              </div>
            </div>
          </div>
          <HeroCollage isDesktop={isDesktop} />
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{
        padding: isDesktop ? "72px 32px" : "44px 20px",
        background: "var(--hbt-cream-soft)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeader
            eyebrow="What's in the kitchen"
            title="Find something soft to come home to"
            isDesktop={isDesktop}
          />
          {categories.length > 0 ? (
            <div style={{
              marginTop: isDesktop ? 40 : 24,
              display: "grid",
              gridTemplateColumns: isDesktop ? "repeat(5, 1fr)" : "repeat(2, 1fr)",
              gap: isDesktop ? 14 : 10,
            }}>
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  onClick={() => router.push(`/products?category=${cat.slug}`)}
                  accentLarge={i === 0 && !isDesktop}
                />
              ))}
            </div>
          ) : (
            // Placeholder category cards when no data
            <div style={{
              marginTop: isDesktop ? 40 : 24,
              display: "grid",
              gridTemplateColumns: isDesktop ? "repeat(5, 1fr)" : "repeat(2, 1fr)",
              gap: isDesktop ? 14 : 10,
            }}>
              {[
                { name: "Soaps", color: "var(--hbt-pink-soft)" },
                { name: "Creams", color: "var(--hbt-sage-wash)" },
                { name: "Serums", color: "var(--hbt-beige-soft)" },
                { name: "Loafs", color: "var(--hbt-cream-deep)" },
                { name: "Gift Baskets", color: "var(--hbt-beige-soft)" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => router.push("/products")}
                  style={{
                    background: item.color,
                    border: "none",
                    borderRadius: "var(--hbt-r-lg)",
                    padding: 0,
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: i === 0 && !isDesktop ? "2 / 1" : "1 / 1.05",
                    gridColumn: i === 0 && !isDesktop ? "span 2" : "auto",
                    cursor: "pointer",
                    transition: "transform .2s ease",
                    textAlign: "left",
                    color: "var(--hbt-ink)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                >
                  <div style={{
                    position: "absolute", inset: 0, padding: 16,
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                    background: "linear-gradient(transparent 50%, rgba(42,34,24,0.15))",
                  }}>
                    <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 22, fontWeight: 500 }}>{item.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── GIFT SPOTLIGHT ── */}
      <section style={{
        padding: isDesktop ? "88px 32px" : "56px 20px",
        background: "var(--hbt-sage-wash)",
        position: "relative", overflow: "hidden",
      }}>
        <BotanicalAccent
          style={{ position: "absolute", top: -40, right: -40, opacity: 0.3, width: 240 }}
          variant="a"
        />
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          gap: isDesktop ? 64 : 28,
          alignItems: "center",
        }}>
          <GiftBasketMockup isDesktop={isDesktop} />
          <div>
            <div className="hbt-eyebrow" style={{ marginBottom: 16 }}>The signature gift</div>
            <h2
              className="hbt-h-display"
              style={{ fontSize: isDesktop ? 56 : 36, marginBottom: 18 }}
            >
              A little crochet bag,<br />
              <em>made for them.</em>
            </h2>
            <p style={{ fontSize: isDesktop ? 17 : 14, color: "var(--hbt-ink-soft)", lineHeight: 1.6, marginBottom: 26, maxWidth: 480 }}>
              Pick 2 to 5 of our small-batch products. Choose a crochet bag with their initial.
              Write a card by hand, in your own words — we deliver it sealed.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["1", "Pick your products", "Mix and match across categories"],
                ["2", "Choose the letter", "A–Z crochet bags, made by neighbourhood aunties"],
                ["3", "Write a card", "We print it on natural recycled paper"],
              ].map(([n, t, d]) => (
                <li key={n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0,
                    width: 30, height: 30, borderRadius: 999,
                    background: "var(--hbt-cream-soft)",
                    color: "var(--hbt-sage-deep)",
                    fontFamily: "var(--hbt-serif)", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid var(--hbt-sage)",
                  }}>{n}</span>
                  <div>
                    <div style={{ fontFamily: "var(--hbt-serif)", fontSize: 17, fontWeight: 500, marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: 13, color: "var(--hbt-ink-soft)" }}>{d}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/basket-builder")}
              className="btn btn-sage btn-lg"
            >
              <IconGift /> Start a gift basket
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: isDesktop ? "72px 32px" : "44px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: isDesktop ? 32 : 20,
            gap: 12,
          }}>
            <SectionHeader
              eyebrow="Loved this season"
              title="A few favourites"
              isDesktop={isDesktop}
              flush
            />
            <button
              onClick={() => router.push("/products")}
              style={{
                background: "none", border: "none",
                fontFamily: "var(--hbt-sans)", fontSize: 13, fontWeight: 600,
                color: "var(--hbt-sage-deep)", display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap", cursor: "pointer",
              }}
            >
              See all <IconArrow size={14} />
            </button>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
            gap: isDesktop ? 20 : 12,
          }}>
            {featuredProducts.map((p) => (
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
        </div>
      </section>

      {/* ── TRUST ROW ── */}
      <section style={{ padding: isDesktop ? "0 32px 72px" : "0 20px 44px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <TrustRow isDesktop={isDesktop} />
        </div>
      </section>

      {/* ── STORY STRIP ── */}
      <section style={{
        padding: isDesktop ? "80px 32px" : "52px 20px",
        background: "var(--hbt-brown)",
        color: "var(--hbt-cream-soft)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <div className="hbt-eyebrow" style={{ color: "var(--hbt-sage)", marginBottom: 18 }}>
            Our story, in three lines
          </div>
          <h2 style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: isDesktop ? 38 : 26,
            fontWeight: 400, lineHeight: 1.25,
            color: "var(--hbt-cream-soft)",
          }}>
            &ldquo;We started Habibti at a kitchen table in Achrafieh — three of us, one pot, a lot of olive oil.
            We still cure every bar for six weeks. We still write every card by hand.&rdquo;
          </h2>
          <div style={{ marginTop: 24, fontSize: 14, color: "var(--hbt-cream-deep)", opacity: 0.7 }}>
            — Maya, founder
          </div>
        </div>
      </section>
    </div>
  );
}

