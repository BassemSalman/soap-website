import { z } from "zod";
import { ProductType } from "@/generated/prisma";

export const ProductCreateSchema = z.object({
  sku: z.string().min(1),
  type: z.nativeEnum(ProductType),
  name_en: z.string().min(1),
  description_en: z.string().optional(),
  benefits_en: z.string().optional(),
  ingredients_en: z.string().optional(),
  targetAudience_en: z.string().optional(),
  slug: z.string().min(1),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  isOnSale: z.boolean().default(false),
  stockQty: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isCustomBasket: z.boolean().default(false),
  categoryIds: z.array(z.string().cuid()).default([]),
});

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
  id: z.string().cuid(),
});
