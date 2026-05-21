"use client";
import { useState, useTransition } from "react";
import {
  toggleProductActive,
  deleteProduct,
  createProduct,
} from "@/features/products/actions";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
} from "@/components/shared/icons";

const PRODUCT_TYPES = [
  "SOAP_BAR",
  "CREAM",
  "SERUM",
  "LOAF",
  "COMPOSITE_BASKET",
  "SOUVENIR",
] as const;

interface Product {
  id: string;
  sku: string;
  name_en: string;
  slug: string;
  type: string;
  basePrice: unknown;
  stockQty: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  categories: { category: { name_en: string } }[];
  images: { url: string; isPrimary: boolean }[];
}

interface Props {
  products: Product[];
}

const admCard: React.CSSProperties = {
  background: "var(--hbt-paper)",
  borderRadius: 14,
  padding: 18,
  border: "1px solid var(--hbt-line-soft)",
};

const iconBtnSm: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 7,
  border: "1px solid var(--hbt-line)",
  background: "var(--hbt-paper)",
  color: "var(--hbt-ink-soft)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

// ─── Add Product Dialog ───────────────────────────────────────────────────────

function AddProductDialog({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      sku: fd.get("sku") as string,
      type: fd.get("type") as string,
      name_en: fd.get("name_en") as string,
      slug: fd.get("slug") as string,
      basePrice: fd.get("basePrice") as string,
      stockQty: Number(fd.get("stockQty")),
      lowStockThreshold: Number(fd.get("lowStockThreshold") ?? 5),
      isActive: true,
      categoryIds: [],
    };
    startTransition(async () => {
      try {
        await createProduct(input);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create product");
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
          maxWidth: 480,
          maxHeight: "90vh",
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
            Add product
          </h2>
          <button onClick={onClose} style={{ ...iconBtnSm, fontSize: 18 }}>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { name: "sku", label: "SKU", required: true },
            { name: "name_en", label: "Name", required: true },
            { name: "slug", label: "Slug (leave blank to auto-generate)" },
            { name: "basePrice", label: "Base price (e.g. 12.99)", required: true },
            { name: "stockQty", label: "Stock qty", type: "number" },
            { name: "lowStockThreshold", label: "Low stock threshold", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--hbt-brown)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 5,
                }}
              >
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type ?? "text"}
                required={f.required}
                defaultValue={f.type === "number" ? "0" : ""}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid var(--hbt-line)",
                  background: "var(--hbt-paper)",
                  fontSize: 13,
                  color: "var(--hbt-ink)",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          ))}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--hbt-brown)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 5,
              }}
            >
              Type
            </label>
            <select
              name="type"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1.5px solid var(--hbt-line)",
                background: "var(--hbt-paper)",
                fontSize: 13,
                color: "var(--hbt-ink)",
                fontFamily: "inherit",
              }}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
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
                color: "var(--hbt-ink)",
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
              {pending ? "Creating…" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  product,
  onConfirm,
  onClose,
  pending,
}: {
  product: Product;
  onConfirm: () => void;
  onClose: () => void;
  pending: boolean;
}) {
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
          maxWidth: 380,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--hbt-serif)",
            fontSize: 20,
            color: "var(--hbt-ink)",
            marginBottom: 8,
          }}
        >
          Deactivate product?
        </h2>
        <p style={{ fontSize: 13, color: "var(--hbt-brown-soft)", marginBottom: 20 }}>
          <strong>{product.name_en}</strong> will be hidden from the storefront. You can
          re-activate it anytime.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
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
            onClick={onConfirm}
            disabled={pending}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background: "var(--hbt-pink-deep)",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              cursor: pending ? "wait" : "pointer",
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? "Deactivating…" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductsTable({ products }: Props) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = products.filter(
    (p) =>
      p.name_en.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleToggleActive(product: Product) {
    startTransition(async () => {
      await toggleProductActive(product.id, !product.isActive);
      showToast(`${product.name_en} ${product.isActive ? "deactivated" : "activated"}`);
    });
  }

  function handleDelete(product: Product) {
    setDeleteTarget(product);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    startTransition(async () => {
      await deleteProduct(target.id);
      showToast(`${target.name_en} deactivated`);
    });
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--hbt-ink)",
            color: "var(--hbt-cream-soft)",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 200,
            boxShadow: "var(--hbt-shadow)",
          }}
        >
          {toast}
        </div>
      )}

      {showAdd && <AddProductDialog onClose={() => setShowAdd(false)} />}

      {deleteTarget && (
        <DeleteConfirmDialog
          product={deleteTarget}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
          pending={pending}
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
            Products
          </h1>
          <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
            {products.length} total products
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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
              placeholder="Search products…"
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
                width: 220,
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
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
            <IconPlus size={12} /> Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={admCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", ""].map((col) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const isLow =
                  product.stockQty <= product.lowStockThreshold;
                const primaryImage = product.images?.[0]?.url;
                const categoryName =
                  product.categories?.[0]?.category.name_en ?? "—";

                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: "1px solid var(--hbt-line-soft)",
                      opacity: product.isActive ? 1 : 0.5,
                    }}
                  >
                    {/* Product cell */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: "var(--hbt-cream-deep)",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {primaryImage && (
                            <img
                              src={primaryImage}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--hbt-ink)" }}>
                            {product.name_en}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--hbt-brown-soft)",
                            }}
                          >
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)" }}>{categoryName}</span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ fontWeight: 600 }}>
                        ${Number(product.basePrice).toFixed(2)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span
                        style={{
                          color: isLow ? "var(--hbt-pink-deep)" : "var(--hbt-sage-deep)",
                          fontWeight: isLow ? 700 : 500,
                        }}
                      >
                        {product.stockQty}
                        {isLow && (
                          <span
                            style={{
                              fontSize: 10,
                              marginLeft: 4,
                              background: "var(--hbt-pink-wash)",
                              color: "var(--hbt-pink-deep)",
                              padding: "1px 6px",
                              borderRadius: 999,
                              fontWeight: 700,
                            }}
                          >
                            low
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <button
                        onClick={() => handleToggleActive(product)}
                        style={{
                          background: product.isActive
                            ? "var(--hbt-sage-wash)"
                            : "var(--hbt-cream-deep)",
                          color: product.isActive
                            ? "var(--hbt-sage-deep)"
                            : "var(--hbt-brown-soft)",
                          border: "none",
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          cursor: "pointer",
                        }}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() =>
                            showToast(`Edit product: ${product.name_en}`)
                          }
                          style={iconBtnSm}
                          title="Edit"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          style={{
                            ...iconBtnSm,
                            color: "var(--hbt-pink-deep)",
                          }}
                          title="Deactivate"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--hbt-brown-soft)",
                    }}
                  >
                    {search ? `No products matching "${search}"` : "No products yet."}
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
