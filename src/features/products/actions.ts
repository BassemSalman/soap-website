"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ProductCreateSchema, ProductUpdateSchema } from "./schemas";
import { slugify } from "@/lib/utils";

export async function createProduct(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const data = ProductCreateSchema.parse(input);
  const { categoryIds, ...rest } = data;
  const product = await db.product.create({
    data: {
      ...rest,
      slug: rest.slug || slugify(rest.name_en),
      categories: {
        create: categoryIds.map((id) => ({ categoryId: id })),
      },
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

export async function updateProduct(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  const { id, categoryIds, ...data } = ProductUpdateSchema.parse(input);
  const product = await db.product.update({
    where: { id },
    data: {
      ...data,
      ...(categoryIds !== undefined
        ? {
            categories: {
              deleteMany: {},
              create: categoryIds.map((cid) => ({ categoryId: cid })),
            },
          }
        : {}),
    },
  });
  revalidatePath("/admin/products");
  revalidatePath(`/products/${product.slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await db.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await db.product.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/products");
}
