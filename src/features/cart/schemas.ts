import { z } from "zod";

export const BasketConfigSchema = z.object({
  selectedProductIds: z
    .array(z.string().cuid())
    .min(2, "Select at least 2 items")
    .max(5, "Select at most 5 items"),
  bagLetter: z.string().regex(/^[A-Z]$/, "Must be a single uppercase letter"),
  cardMessage: z.string().max(200).optional(),
});

export const AddToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).default(1),
  basketConfig: BasketConfigSchema.optional(),
});

export const UpdateCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.number().int().min(1),
});
