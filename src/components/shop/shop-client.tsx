"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import {
  IconSearch,
  IconCheck,
} from "@/components/shared/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductImage = { url: string; isPrimary: boolean; sortOrder: number };
type ProductCategoryRef = { category: { slug: string; name_en: string } };

export type ShopProduct = {
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

export type ShopCategory = {
  id: string;
  slug: string;
  name_en: string;
  imageUrl: string | null;
  _count: { products: number };
};

interface ShopClientProps {
  products: ShopProduct[];
  categories: ShopCategory[];
}

// ─── Filter checkbox ──────────────────────────────────────────────────────────

function FilterCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", padding: "4px 0" }}>
      <span style={{
        width: 20, height: 20, borderRadius: 6,
        border: `1.5px solid ${checked ? "var(--hbt-sage-deep)" : "var(--hbt-line)"}`,
        background: checked ? "var(--hbt-sage-deep)" : "var(--hbt-paper)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", flexShrink: 0,
      }}>
        {checked && <IconCheck size={14} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    </label>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function FilterSidebar({
  search, setSearch,
  selectedCats, toggleCat,
  selectedSkins, toggleSkin,
  priceMax, setPriceMax,
  allCategoryNames,
  onClearAll,
  hasActiveFilters,
  isDesktop,
}: {
  search: string;
  setSearch: (v: string) => void;
  selectedCats: Set<string>;
  toggleCat: (v: string) => void;
  selectedSkins: Set<string>;
  toggleSkin: (v: string) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  allCategoryNames: string[];
  onClearAll: () => void;
  hasActiveFilters: boolean;
  isDesktop: boolean;
}) {
  const allSkins = ["Dry", "Oily", "Combination", "Sensitive", "Mature", "Normal"];

  return (
    <aside style={{
      background: "var(--hbt-paper)",
      borderRadius: "var(--hbt-r-lg)",
      padding: "24px",
      border: "1px solid var(--hbt-line-soft)",
      display: "flex", flexDirection: "column", gap: 24,
      position: isDesktop ? "sticky" : "static",
      top: isDesktop ? 100 : 0,
    }}>
      <div>
        <div
          style={{
            fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "block",
          }}
        >Search</div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--hbt-brown-soft)" }}>
            <IconSearch size={16} />
          </span>
          <input
            className="hbt-input"
            placeholder="lemon, lavender, gift…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "block",
          }}
        >Category</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {allCategoryNames.map((c) => (
            <FilterCheck key={c} label={c} checked={selectedCats.has(c)} onChange={() => toggleCat(c)} />
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "block",
          }}
        >Skin type</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {allSkins.map((s) => (
            <button
              key={s}
              onClick={() => toggleSkin(s)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: `1.5px solid ${selectedSkins.has(s) ? "var(--hbt-sage-deep)" : "var(--hbt-line)"}`,
                background: selectedSkins.has(s) ? "var(--hbt-sage-wash)" : "var(--hbt-paper)",
                color: selectedSkins.has(s) ? "var(--hbt-sage-deep)" : "var(--hbt-ink-soft)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      <div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "var(--hbt-brown)",
          textTransform: "uppercase", letterSpacing: "0.08em",
          marginBottom: 10,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>Price</span>
          <span style={{ color: "var(--hbt-ink)", fontWeight: 700 }}>up to ${priceMax}</span>
        </div>
        <input
          type="range" min="5" max="200" step="1"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--hbt-sage-deep)" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--hbt-brown-soft)", marginTop: 4 }}>
          <span>$5</span><span>$200</span>
        </div>
      </div>

      {hasActiveFilters && (
        <button className="btn btn-ghost btn-sm" onClick={onClearAll}>
          Clear all
        </button>
      )}
    </aside>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ShopClient({ products, categories }: ShopClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [selectedSkins, setSelectedSkins] = useState<Set<string>>(new Set());
  const [priceMax, setPriceMax] = useState(200);
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, current: Set<string>, value: string) => {
    const next = new Set(current);
    if (next.has(value)) next.delete(value); else next.add(value);
    setter(next);
  };

  const allCategoryNames = categories.map((c) => c.name_en);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !p.name_en.toLowerCase().includes(search.toLowerCase()) &&
          !p.description_en?.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.size > 0) {
        const catNames = p.categories.map((c) => c.category.name_en);
        if (!catNames.some((n) => selectedCats.has(n))) return false;
      }
      if (Number(p.basePrice) > priceMax) return false;
      return true;
    });

    if (sortBy === "low") list = [...list].sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === "high") list = [...list].sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === "featured") list = [...list].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    return list;
  }, [products, search, selectedCats, selectedSkins, priceMax, sortBy]);

  const hasActiveFilters = selectedCats.size + selectedSkins.size > 0 || !!search;
  const clearAll = () => { setSelectedCats(new Set()); setSelectedSkins(new Set()); setSearch(""); setPriceMax(200); };

  const sidebarProps = {
    search, setSearch,
    selectedCats, toggleCat: (v: string) => toggleSet(setSelectedCats, selectedCats, v),
    selectedSkins, toggleSkin: (v: string) => toggleSet(setSelectedSkins, selectedSkins, v),
    priceMax, setPriceMax,
    allCategoryNames,
    onClearAll: clearAll,
    hasActiveFilters,
    isDesktop,
  };

  return (
    <div>
      {/* Banner */}
      <section style={{
        padding: isDesktop ? "48px 32px 32px" : "24px 20px 16px",
        background: "var(--hbt-cream-soft)",
        borderBottom: "1px solid var(--hbt-line-soft)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="hbt-eyebrow" style={{ marginBottom: 8 }}>Our full kitchen</div>
          <h1
            className="hbt-h-display"
            style={{ fontSize: isDesktop ? 56 : 34 }}
          >
            The shop
          </h1>
          <p style={{ color: "var(--hbt-brown-soft)", marginTop: 8, fontSize: isDesktop ? 16 : 14 }}>
            {filtered.length} small-batch product{filtered.length !== 1 ? "s" : ""}, made by hand this season.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <div style={{
        padding: isDesktop ? "32px 32px 64px" : "20px 16px 40px",
        maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isDesktop ? "260px 1fr" : "1fr",
        gap: isDesktop ? 32 : 16,
      }}>
        {/* Sidebar / mobile filter toggle */}
        {isDesktop ? (
          <FilterSidebar {...sidebarProps} />
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--hbt-brown-soft)" }}>
                  <IconSearch size={16} />
                </span>
                <input
                  className="hbt-input"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 38 }}
                />
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                style={{
                  padding: "0 16px",
                  borderRadius: "var(--hbt-r-sm)",
                  border: "1.5px solid var(--hbt-line)",
                  background: "var(--hbt-paper)",
                  fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 6,
                  cursor: "pointer",
                }}
              >
                Filter
                {(selectedCats.size + selectedSkins.size > 0) && (
                  <span style={{
                    background: "var(--hbt-sage-deep)", color: "white",
                    fontSize: 10, fontWeight: 700,
                    width: 18, height: 18, borderRadius: 999,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>{selectedCats.size + selectedSkins.size}</span>
                )}
              </button>
            </div>
            {filtersOpen && <FilterSidebar {...sidebarProps} />}
          </div>
        )}

        {/* Product grid */}
        <div>
          {/* Active chips + sort */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[...selectedCats, ...selectedSkins].map((v) => (
                <span
                  key={v}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px 4px 10px",
                    borderRadius: "var(--hbt-r-pill)",
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.04em", textTransform: "uppercase" as const,
                    background: "var(--hbt-sage-wash)", color: "var(--hbt-sage-deep)",
                  }}
                >
                  {v}
                  <button
                    onClick={() => {
                      if (selectedCats.has(v)) toggleSet(setSelectedCats, selectedCats, v);
                      else toggleSet(setSelectedSkins, selectedSkins, v);
                    }}
                    style={{ background: "none", border: "none", padding: "0 2px", color: "inherit", cursor: "pointer", lineHeight: 1 }}
                  >×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  border: "1.5px solid var(--hbt-line)",
                  borderRadius: "var(--hbt-r-sm)",
                  padding: "6px 10px", fontSize: 13,
                  background: "var(--hbt-paper)",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low → high</option>
                <option value="high">Price: high → low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            gap: isDesktop ? 16 : 10,
          }}>
            {filtered.map((p) => (
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

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ padding: 60, textAlign: "center", color: "var(--hbt-brown-soft)" }}>
              <p style={{ fontFamily: "var(--hbt-serif)", fontSize: 24, color: "var(--hbt-ink)" }}>No matches yet.</p>
              <p style={{ marginTop: 8 }}>Try a wider price or fewer filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
