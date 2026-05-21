import { getProducts } from "@/features/products/queries";
import { BasketBuilderClient } from "@/components/basket-builder/basket-builder-client";

export const metadata = {
  title: "Build a Gift Basket — Habibti",
  description:
    "Pick 2–5 products, choose a crocheted bag with a personalised letter, write a card — and give something truly made.",
};

export default async function BasketBuilderPage() {
  const products = await getProducts({ limit: 20 });
  return <BasketBuilderClient products={products} />;
}
