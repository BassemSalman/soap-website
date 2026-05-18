import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/features/products/queries";
import { ProductDetailClient } from "@/components/product/product-detail-client";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name_en} — Habibti`,
    description: product.description_en ?? "Handmade organic skincare from Beirut.",
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ limit: 8 }),
  ]);

  if (!product) notFound();

  const relatedProducts = allProducts
    .filter((p: { id: string }) => p.id !== product!.id)
    .slice(0, 4);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
