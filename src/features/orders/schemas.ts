import { z } from "zod";
import { OrderStatus } from "@/generated/prisma";

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.nativeEnum(OrderStatus),
  note: z.string().optional(),
});

export const ManualOrderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email(),
  addressLine: z.string().min(1),
  city: z.string().min(1),
  governorate: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().cuid(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
  promoCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
});
