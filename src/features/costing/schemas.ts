import { z } from "zod";

export const CostingLineSchema = z.object({
  rawMaterialId: z.string().cuid(),
  quantityUsed: z.string().regex(/^\d+(\.\d{1,4})?$/),
});

export const ProductCostingCreateSchema = z.object({
  productId: z.string().cuid(),
  laborCost: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0"),
  packagingCost: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0"),
  overheadCost: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0"),
  notes: z.string().optional(),
  lines: z.array(CostingLineSchema).min(1),
});
