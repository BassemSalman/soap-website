"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name_en: string;
    description_en?: string | null;
    category?: string;
    basePrice: string | number;
    salePrice?: string | number | null;
    isOnSale: boolean;
    images?: { url: string; isPrimary: boolean }[];
    swatch?: string;
  };
  compact?: boolean;
  onAdd?: (productId: string) => void;
}

export function ProductCard({
  product,
  compact = false,
  onAdd,
}: ProductCardProps) {
  const name = product.name_en;
  const description = product.description_en;

  const primaryImage = product.images?.find((img) => img.isPrimary);
  const firstImage = product.images?.[0];
  const imageUrl = primaryImage?.url ?? firstImage?.url;

  const displayPrice = product.isOnSale && product.salePrice
    ? Number(product.salePrice)
    : Number(product.basePrice);
  const crossedPrice =
    product.isOnSale && product.salePrice ? Number(product.basePrice) : null;

  const truncatedDescription = description
    ? description.length > 80
      ? description.slice(0, 80) + "…"
      : description
    : null;

  return (
    <div
      className="group bg-[var(--paper)] rounded-[var(--r-lg)] overflow-hidden border border-[var(--line-soft)] flex flex-col transition-[transform,box-shadow] duration-200 ease-out cursor-pointer hover:-translate-y-[3px] hover:shadow-[var(--shadow)]"
    >
      <Link href={`/products/${product.slug}`} className="contents">
        {/* Image area */}
        <div
          className="aspect-square relative overflow-hidden"
          style={{ background: product.swatch ?? "var(--cream-soft)" }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : null}

          {/* Category badge */}
          {product.category && (
            <span className="absolute top-3 left-3 px-[10px] py-1 rounded-full bg-[rgba(255,252,247,0.92)] text-[11px] font-semibold text-[var(--brown)] uppercase tracking-[0.06em] leading-none">
              {product.category}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div
        className="flex flex-col gap-1.5 flex-1"
        style={{ padding: compact ? 14 : 18 }}
      >
        <Link href={`/products/${product.slug}`}>
          <h3
            className="font-medium leading-[1.15] text-[var(--ink)]"
            style={{
              fontFamily: "var(--serif)",
              fontSize: compact ? 16 : 18,
            }}
          >
            {name}
          </h3>
        </Link>

        {!compact && truncatedDescription && (
          <p className="text-[13px] text-[var(--brown-soft)] leading-[1.45] mb-1">
            {truncatedDescription}
          </p>
        )}

        {/* Price + Add */}
        <div className="mt-auto flex justify-between items-center pt-1.5">
          <div className="flex items-baseline gap-2">
            <span
              className="font-medium text-[var(--ink)]"
              style={{ fontFamily: "var(--serif)", fontSize: 18 }}
            >
              ${displayPrice}
            </span>
            {crossedPrice !== null && (
              <span className="text-[13px] text-[var(--brown-soft)] line-through">
                ${crossedPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAdd?.(product.id);
            }}
            className="btn btn-primary btn-sm flex items-center gap-1"
            style={{ padding: "8px 14px" }}
          >
            {/* Plus icon */}
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
