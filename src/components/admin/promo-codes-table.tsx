"use client";
import { useState, useTransition } from "react";
import {
  createPromoCode,
  togglePromoCode,
  deletePromoCode,
} from "@/features/promo-codes/actions";
import { IconPlus, IconTrash, IconEdit } from "@/components/shared/icons";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: unknown;
  minOrderAmount: unknown;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

interface Props {
  promoCodes: PromoCode[];
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

// ─── Add Promo Dialog ─────────────────────────────────────────────────────────

function AddPromoDialog({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input: Record<string, unknown> = {
      code: (fd.get("code") as string).toUpperCase(),
      description: (fd.get("description") as string) || undefined,
      discountType: fd.get("discountType") as string,
      isActive: true,
    };

    if (discountType === "PERCENTAGE") {
      input.discountValue = Number(fd.get("discountValue"));
    }
    const minOrder = fd.get("minOrderAmount") as string;
    if (minOrder) input.minOrderAmount = Number(minOrder);
    const maxUses = fd.get("maxUses") as string;
    if (maxUses) input.maxUses = Number(maxUses);
    const expiresAt = fd.get("expiresAt") as string;
    if (expiresAt) input.expiresAt = new Date(expiresAt).toISOString();

    startTransition(async () => {
      try {
        await createPromoCode(input);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create promo code");
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
          maxWidth: 460,
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
            New promo code
          </h2>
          <button
            onClick={onClose}
            style={{ ...iconBtnSm, fontSize: 18 }}
          >
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
          <div>
            <label style={fieldLabelStyle}>Code</label>
            <input
              name="code"
              required
              placeholder="SUMMER20"
              style={{ ...inputStyle, textTransform: "uppercase" }}
            />
          </div>

          <div>
            <label style={fieldLabelStyle}>Description (optional)</label>
            <input name="description" style={inputStyle} />
          </div>

          <div>
            <label style={fieldLabelStyle}>Discount type</label>
            <select
              name="discountType"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              style={{ ...inputStyle, paddingTop: 9, paddingBottom: 9 }}
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FREE_SHIPPING">Free shipping</option>
            </select>
          </div>

          {discountType === "PERCENTAGE" && (
            <div>
              <label style={fieldLabelStyle}>Discount value (%)</label>
              <input
                name="discountValue"
                type="number"
                min={0}
                max={100}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabelStyle}>Min order ($, optional)</label>
              <input name="minOrderAmount" type="number" min={0} style={inputStyle} />
            </div>
            <div>
              <label style={fieldLabelStyle}>Max uses (optional)</label>
              <input name="maxUses" type="number" min={1} style={inputStyle} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={fieldLabelStyle}>Expires at (optional)</label>
              <input name="expiresAt" type="datetime-local" style={inputStyle} />
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
              {pending ? "Creating…" : "Create code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PromoCodesTable({ promoCodes }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await togglePromoCode(id, !current);
      showToast(current ? "Promo code deactivated" : "Promo code activated");
    });
  }

  function handleDelete(id: string, code: string) {
    if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deletePromoCode(id);
      showToast(`Deleted ${code}`);
    });
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

      {showAdd && <AddPromoDialog onClose={() => setShowAdd(false)} />}

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
            Promo Codes
          </h1>
          <div style={{ fontSize: 12, color: "var(--hbt-brown-soft)" }}>
            Active codes &amp; usage
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
          <IconPlus size={12} /> Create code
        </button>
      </div>

      {/* Table */}
      <div style={admCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Code", "Type", "Value", "Min Order", "Uses", "Status", "Expires", ""].map(
                  (col) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => {
                const expired =
                  promo.expiresAt && new Date(promo.expiresAt) < new Date();
                return (
                  <tr
                    key={promo.id}
                    style={{
                      borderBottom: "1px solid var(--hbt-line-soft)",
                      opacity: promo.isActive && !expired ? 1 : 0.6,
                    }}
                  >
                    {/* Code */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span
                        style={{
                          fontFamily: "var(--hbt-serif)",
                          fontSize: 14,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          color: "var(--hbt-ink)",
                        }}
                      >
                        {promo.code}
                      </span>
                      {promo.description && (
                        <div style={{ fontSize: 11, color: "var(--hbt-brown-soft)" }}>
                          {promo.description}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {promo.discountType === "FREE_SHIPPING"
                        ? "Free shipping"
                        : "Percentage"}
                    </td>

                    {/* Value */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {promo.discountType === "FREE_SHIPPING"
                        ? "—"
                        : `${Number(promo.discountValue)}%`}
                    </td>

                    {/* Min order */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {promo.minOrderAmount
                        ? `$${Number(promo.minOrderAmount).toFixed(2)}`
                        : "—"}
                    </td>

                    {/* Uses */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      {promo.usedCount}
                      {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <button
                        onClick={() => handleToggle(promo.id, promo.isActive)}
                        disabled={pending}
                        style={{
                          background:
                            promo.isActive && !expired
                              ? "var(--hbt-sage-wash)"
                              : "var(--hbt-cream-deep)",
                          color:
                            promo.isActive && !expired
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
                        {expired ? "Expired" : promo.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Expires */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <span style={{ color: "var(--hbt-brown-soft)", fontSize: 12 }}>
                        {promo.expiresAt
                          ? new Date(promo.expiresAt).toLocaleDateString()
                          : "Never"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          style={iconBtnSm}
                          title="Edit (coming soon)"
                          onClick={() =>
                            alert(`Edit promo code: ${promo.code} (coming soon)`)
                          }
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id, promo.code)}
                          disabled={pending}
                          style={{
                            ...iconBtnSm,
                            color: "var(--hbt-pink-deep)",
                          }}
                          title="Delete"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {promoCodes.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "var(--hbt-brown-soft)",
                    }}
                  >
                    No promo codes yet.
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
