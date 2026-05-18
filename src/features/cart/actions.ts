"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { AddToCartSchema, UpdateCartItemSchema } from "./schemas";

export async function addToCart(
  input: unknown
): Promise<{ error: string } | undefined> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to add items to your bag." };
  const parsed = AddToCartSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { productId, quantity, basketConfig } = parsed.data;

  // ensure cart exists
  const cart = await db.cart.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id },
    update: {},
  });

  // check if same product (non-basket) already in cart
  if (!basketConfig) {
    const existing = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (existing && !existing.basketConfig) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      revalidatePath("/cart");
      return;
    }
  }

  await db.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      basketConfig: basketConfig ?? undefined,
    },
  });
  revalidatePath("/cart");
  return undefined;
}

export async function updateCartItem(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  const { cartItemId, quantity } = UpdateCartItemSchema.parse(input);
  // verify ownership
  const item = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });
  if (item?.cart.userId !== session.user.id) throw new Error("Forbidden");
  await db.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
  revalidatePath("/cart");
}

export async function removeFromCart(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  const item = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });
  if (item?.cart.userId !== session.user.id) throw new Error("Forbidden");
  await db.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath("/cart");
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");
  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
  });
  if (!cart) return;
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath("/cart");
}
