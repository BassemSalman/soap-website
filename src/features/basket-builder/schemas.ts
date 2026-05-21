import { z } from "zod";

export const BAG_SIZES = [
  { id: "S", label: "Small",  note: "fits 2–3 items", price: 6 },
  { id: "M", label: "Medium", note: "fits 3–4 items", price: 8 },
  { id: "L", label: "Large",  note: "fits 4–5 items", price: 10 },
] as const;
export type BagSizeId = (typeof BAG_SIZES)[number]["id"];

export const BasketBuilderSchema = z.object({
  selectedProductIds: z
    .array(z.string().cuid())
    .min(2, "Select at least 2 items")
    .max(5, "Select at most 5 items"),
  bagLetter: z.string().regex(/^[A-Z]$/, "Must be a single uppercase letter"),
  cardMessage: z.string().max(200).optional(),
});
