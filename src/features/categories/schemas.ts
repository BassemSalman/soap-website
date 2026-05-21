import { z } from "zod";

export const CategoryCreateSchema = z.object({
  slug: z.string().min(1),
  name_en: z.string().min(1),
  description_en: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial().extend({
  id: z.string().cuid(),
});
