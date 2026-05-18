"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { PromoCodeCreateSchema } from "./schemas";

export async function createPromoCode(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const data = PromoCodeCreateSchema.parse(input);
  const result = await db.promoCode.create({
    data: { ...data, code: data.code.toUpperCase() },
  });
  revalidatePath("/admin/promo-codes");
  return result;
}

export async function togglePromoCode(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await db.promoCode.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCode(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await db.promoCode.delete({ where: { id } });
  revalidatePath("/admin/promo-codes");
}
