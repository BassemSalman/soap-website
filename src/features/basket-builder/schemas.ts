import { z } from "zod";

export const BasketBuilderSchema = z.object({
  selectedProductIds: z
    .array(z.string().cuid())
    .min(2, "Select at least 2 items")
    .max(5, "Select at most 5 items"),
  bagLetter: z.string().regex(/^[A-Z]$/, "Must be a single uppercase letter"),
  cardMessage: z.string().max(200).optional(),
});
