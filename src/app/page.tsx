import { Suspense } from "react";
import { getFeaturedProducts } from "@/features/products/queries";
import { getCategories } from "@/features/categories/queries";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { HomepageClient } from "@/components/home/homepage-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Habibti — Organic Handmade Soap & Skincare from Beirut",
  description:
    "Small-batch organic soap, cream and serum made by hand in Beirut. Delivered across Lebanon with a hand-crochet bag and a personal card.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Suspense>
          <HomepageClient
            featuredProducts={featuredProducts}
            categories={categories}
          />
        </Suspense>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
