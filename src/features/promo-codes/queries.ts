import { db } from "@/lib/db";

export async function getPromoCodes() {
  return db.promoCode.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPromoCodeByCode(code: string) {
  return db.promoCode.findUnique({ where: { code: code.toUpperCase() } });
}
