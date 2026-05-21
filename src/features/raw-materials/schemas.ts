import { z } from "zod";
import { UnitType } from "@/generated/prisma";

export const RawMaterialCreateSchema = z.object({
  name_en: z.string().min(1),
  sku: z.string().min(1),
  unit: z.nativeEnum(UnitType),
  costPerUnit: z.string().regex(/^\d+(\.\d{1,4})?$/),
  stockQty: z.string().regex(/^\d+(\.\d{1,3})?$/).default("0"),
  reorderLevel: z.string().regex(/^\d+(\.\d{1,3})?$/).default("0"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

export const RawMaterialUpdateSchema = RawMaterialCreateSchema.partial().extend({
  id: z.string().cuid(),
});
