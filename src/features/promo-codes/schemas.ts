import { z } from "zod";
import { DiscountType } from "@/generated/prisma";

export const PromoCodeCreateSchema = z
  .object({
    code: z.string().min(3).max(20).toUpperCase(),
    description: z.string().optional(),
    discountType: z.nativeEnum(DiscountType),
    discountValue: z
      .number()
      .min(0)
      .max(100)
      .optional(),
    minOrderAmount: z.number().min(0).optional(),
    maxUses: z.number().int().min(1).optional(),
    isActive: z.boolean().default(true),
    startsAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
  })
  .refine(
    (data) =>
      data.discountType === "FREE_SHIPPING" || data.discountValue !== undefined,
    { message: "Discount value is required for percentage discounts" }
  );

export const ApplyPromoCodeSchema = z.object({
  code: z.string().min(1),
});
