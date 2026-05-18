import { Suspense } from "react";
import { getProducts } from "@/features/products/queries";
import { getCategories } from "@/features/categories/queries";
import { ShopClient } from "@/components/shop/shop-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop — Habibti Organic Soap & Skincare",
  description:
    "Browse our full range of small-batch organic soaps, creams, serums and gift baskets, handmade in Beirut.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <Suspense>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
