"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { RawMaterialCreateSchema, RawMaterialUpdateSchema } from "./schemas";

export async function createRawMaterial(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const data = RawMaterialCreateSchema.parse(input);
  const result = await db.rawMaterial.create({ data });
  revalidatePath("/admin/raw-materials");
  return result;
}

export async function updateRawMaterial(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const { id, ...data } = RawMaterialUpdateSchema.parse(input);
  const result = await db.rawMaterial.update({ where: { id }, data });
  revalidatePath("/admin/raw-materials");
  return result;
}

export async function updateRawMaterialStock(id: string, newQty: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await db.rawMaterial.update({
    where: { id },
    data: { stockQty: newQty.toString() },
  });
  revalidatePath("/admin/raw-materials");
}
