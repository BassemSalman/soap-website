"use client";
import { useState, useTransition } from "react";
import {
  createRawMaterial,
  updateRawMaterialStock,
} from "@/features/raw-materials/actions";
import { IconPlus, IconEdit, IconCheck } from "@/components/shared/icons";

const UNIT_TYPES = ["GRAM", "MILLILITER", "PIECE", "KILOGRAM", "LITER"] as const;

interface RawMaterial {
  id: string;
  sku: string;
  name_en: string;
  name_ar: string;
  unit: string;
  costPerUnit: unknown;
  stockQty: unknown;
  reorderLevel: unknown;
  supplier: string | null;
  notes: string | null;
}

interface Props {
  materials: RawMaterial[];
  lowStock: RawMaterial[];
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

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--hbt-brown)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1.5px solid var(--hbt-line)",
  background: "var(--hbt-paper)",
  fontSize: 13,
  color: "var(--hbt-ink)",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

// ─── Add Material Dialog ──────────────────────────────────────────────────────

function AddMaterialDialog({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      name_en: fd.get("name_en") as string,
      name_ar: fd.get("name_ar") as string,
      sku: fd.get("sku") as string,
      unit: fd.get("unit") as string,
      costPerUnit: fd.get("costPerUnit") as string,
      stockQty: (fd.get("stockQty") as string) || "0",
      reorderLevel: (fd.get("reorderLevel") as string) || "0",
      supplier: (fd.get("supplier") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    startTransition(async () => {
      try {
        await createRawMaterial(input);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create material");
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
            Add raw material
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

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabelStyle}>Name (EN)</label>
              <input name="name_en" required style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Name (AR)</label>
              <input name="name_ar" required style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>SKU</label>
              <input name="sku" required style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Unit</label>
              <select
                name="unit"
                required
                style={{ ...inputStyle, paddingTop: 9, paddingBottom: 9 }}
              >
                {UNIT_TYPES.map((u) => (
                  <option key={u} value={u}>
                    {u.toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={fieldLabelStyle}>Cost per unit ($)</label>
              <input name="costPerUnit" required placeholder="0.50" style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Supplier (optional)</label>
              <input name="supplier" style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Stock qty</label>
              <input name="stockQty" type="number" defaultValue={0} style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Reorder level</label>
              <input name="reorderLevel" type="number" defaultValue={0} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={fieldLabelStyle}>Notes (optional)</label>
              <input name="notes" style={inputStyle} />
            </div>
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
              {pending ? "Creating…" : "Add material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Inline qty editor ────────────────────────────────────────────────────────

function InlineQtyEdit({
  material,
}: {
  material: RawMaterial;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(Number(material.stockQty));
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateRawMaterialStock(material.id, value);
      setEditing(false);
    });
  }

  const isLow = Number(material.stockQty) <= Number(material.reorderLevel);

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
          style={{
            width: 72,
            padding: "4px 8px",
            borderRadius: 7,
            border: "1.5px solid var(--hbt-sage-deep)",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={save}
          disabled={pending}
          style={{
            ...iconBtnSm,
            background: "var(--hbt-sage-wash)",
            color: "var(--hbt-sage-deep)",
            border: "none",
          }}
        >
          <IconCheck size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: isLow ? "var(--hbt-pink-deep)" : "var(--hbt-sage-deep)",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 0,
        fontFamily: "inherit",
      }}
      title="Click to edit"
    >
      {Number(material.stockQty)}
      <IconEdit size={11} />
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RawMaterialsTable({ materials, lowStock }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
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

      {showAdd && <AddMaterialDialog onClose={() => setShowAdd(false)} />}

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
            Raw Materials
          </h1>
          <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
            Inventory across the kitchen — {materials.length} materials
          </div>
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
          <IconPlus size={12} /> Add material
        </button>
      </div>

      {/* Low stock alert section */}
      {lowStock.length > 0 && (
        <div
          style={{
            background: "var(--hbt-pink-wash)",
            border: "1px solid var(--hbt-pink-soft)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "var(--hbt-pink-deep)",
                marginBottom: 4,
              }}
            >
              {lowStock.length} material{lowStock.length !== 1 ? "s" : ""} to reorder
            </div>
            <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
              {lowStock.map((m) => m.name_en).join(", ")}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={admCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {[
                  "Material",
                  "SKU",
                  "Unit",
                  "Cost/Unit",
                  "Stock",
                  "Reorder Level",
                  "Supplier",
                  "Status",
                ].map((col) => (
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
              {materials.map((mat) => {
                const isLow =
                  Number(mat.stockQty) <= Number(mat.reorderLevel);
                return (
                  <tr
                    key={mat.id}
                    style={{ borderBottom: "1px solid var(--hbt-line-soft)" }}
                  >
                    {/* Name */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <div style={{ fontWeight: 600, color: "var(--hbt-ink)" }}>
                        {mat.name_en}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                        {mat.name_ar}
                      </div>
                    </td>

                    {/* SKU */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)", fontFamily: "monospace" }}>
                        {mat.sku}
                      </span>
                    </td>

                    {/* Unit */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)", textTransform: "lowercase" }}>
                        {mat.unit}
                      </span>
                    </td>

                    {/* Cost/unit */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      ${Number(mat.costPerUnit).toFixed(4)}
                    </td>

                    {/* Stock — inline editable */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <InlineQtyEdit material={mat} />
                    </td>

                    {/* Reorder level */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)" }}>
                        {Number(mat.reorderLevel)}
                      </span>
                    </td>

                    {/* Supplier */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)" }}>
                        {mat.supplier ?? "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          background: isLow
                            ? "var(--hbt-pink-wash)"
                            : "var(--hbt-sage-wash)",
                          color: isLow
                            ? "var(--hbt-pink-deep)"
                            : "var(--hbt-sage-deep)",
                        }}
                      >
                        {isLow ? "Low" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {materials.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--hbt-brown-soft)",
                    }}
                  >
                    No raw materials yet.
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
