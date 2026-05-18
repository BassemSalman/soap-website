import { z } from "zod";

export const CheckoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z
    .string()
    .min(8, "Enter a valid phone number"),
  deliveryNotes: z.string().max(500).optional(),
  addressId: z.string().cuid().optional(),
  newAddress: z
    .object({
      label: z.string().optional(),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      governorate: z.string().min(1),
    })
    .optional(),
  promoCode: z.string().optional(),
  saveAddress: z.boolean().default(false),
});
