import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, ProductType, DiscountType } from "../src/generated/prisma";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "soaps" },
      update: {},
      create: {
        slug: "soaps",
        name_en: "Soaps",
        description_en: "Handmade natural soap bars",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "creams" },
      update: {},
      create: {
        slug: "creams",
        name_en: "Creams",
        description_en: "Moisturising and nourishing creams",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "serums" },
      update: {},
      create: {
        slug: "serums",
        name_en: "Serums",
        description_en: "Concentrated treatment serums",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "gifts" },
      update: {},
      create: {
        slug: "gifts",
        name_en: "Gifts & Baskets",
        description_en: "Curated gift sets and custom baskets",
        sortOrder: 4,
      },
    }),
  ]);

  const [soapsCategory, creamsCategory, serumsCategory, giftsCategory] = categories;
  console.log(`✓ ${categories.length} categories`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "lavender-honey-soap" },
      update: {},
      create: {
        sku: "SOAP-001",
        type: ProductType.SOAP_BAR,
        slug: "lavender-honey-soap",
        name_en: "Lavender & Honey Soap Bar",
        description_en: "A soothing handmade soap bar with lavender essential oil and raw honey. Gentle on all skin types.",
        benefits_en: "Moisturises deeply, soothes irritated skin, promotes relaxation",
        ingredients_en: "Olive oil, coconut oil, lavender essential oil, raw honey, shea butter",
        targetAudience_en: "All skin types, especially sensitive skin",
        basePrice: 12.00,
        stockQty: 30,
        isFeatured: true,
        categories: { create: [{ categoryId: soapsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "charcoal-tea-tree-soap" },
      update: {},
      create: {
        sku: "SOAP-002",
        type: ProductType.SOAP_BAR,
        slug: "charcoal-tea-tree-soap",
        name_en: "Charcoal & Tea Tree Soap Bar",
        description_en: "Deep cleansing activated charcoal soap with tea tree oil. Perfect for oily and acne-prone skin.",
        benefits_en: "Deep pore cleansing, controls oil, fights acne-causing bacteria",
        ingredients_en: "Activated charcoal, coconut oil, tea tree essential oil, castor oil",
        targetAudience_en: "Oily and combination skin, teens and adults with acne",
        basePrice: 13.00,
        stockQty: 25,
        isFeatured: true,
        categories: { create: [{ categoryId: soapsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "rose-goat-milk-soap" },
      update: {},
      create: {
        sku: "SOAP-003",
        type: ProductType.SOAP_BAR,
        slug: "rose-goat-milk-soap",
        name_en: "Rose & Goat Milk Soap Bar",
        description_en: "Luxurious soap with real rose petals and goat milk. Leaves skin silky soft.",
        benefits_en: "Brightens complexion, softens skin, anti-aging properties",
        ingredients_en: "Goat milk, rose petals, rose essential oil, shea butter, vitamin E",
        targetAudience_en: "Dry and mature skin, great as a gift",
        basePrice: 15.00,
        stockQty: 20,
        isFeatured: false,
        categories: { create: [{ categoryId: soapsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "shea-body-butter-cream" },
      update: {},
      create: {
        sku: "CREAM-001",
        type: ProductType.CREAM,
        slug: "shea-body-butter-cream",
        name_en: "Shea Body Butter Cream",
        description_en: "Rich, whipped body butter that melts into skin. Long-lasting moisture for dry skin.",
        benefits_en: "Intense moisturisation, heals dry patches, improves skin elasticity",
        ingredients_en: "Shea butter, coconut oil, almond oil, vitamin E, lavender essential oil",
        targetAudience_en: "Dry to very dry skin, post-shower care",
        basePrice: 22.00,
        stockQty: 15,
        isFeatured: true,
        categories: { create: [{ categoryId: creamsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "aloe-vera-face-cream" },
      update: {},
      create: {
        sku: "CREAM-002",
        type: ProductType.CREAM,
        slug: "aloe-vera-face-cream",
        name_en: "Aloe Vera Face Cream",
        description_en: "Lightweight daily moisturiser with aloe vera and cucumber extract. Ideal for sensitive skin.",
        benefits_en: "Soothes redness, hydrates without greasiness, calms inflammation",
        ingredients_en: "Aloe vera gel, cucumber extract, hyaluronic acid, chamomile, jojoba oil",
        targetAudience_en: "Sensitive and normal skin, everyday use",
        basePrice: 25.00,
        stockQty: 18,
        isFeatured: false,
        categories: { create: [{ categoryId: creamsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "vitamin-c-brightening-serum" },
      update: {},
      create: {
        sku: "SERUM-001",
        type: ProductType.SERUM,
        slug: "vitamin-c-brightening-serum",
        name_en: "Vitamin C Brightening Serum",
        description_en: "Potent vitamin C serum that fades dark spots and evens skin tone. Use morning and night.",
        benefits_en: "Fades hyperpigmentation, boosts collagen, brightens dull skin",
        ingredients_en: "Vitamin C (ascorbic acid), niacinamide, hyaluronic acid, ferulic acid",
        targetAudience_en: "All skin types, especially uneven or dull skin",
        basePrice: 35.00,
        stockQty: 12,
        isFeatured: true,
        categories: { create: [{ categoryId: serumsCategory.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: "self-care-starter-basket" },
      update: {},
      create: {
        sku: "BASKET-001",
        type: ProductType.COMPOSITE_BASKET,
        slug: "self-care-starter-basket",
        name_en: "Self-Care Starter Basket",
        description_en: "A curated gift basket with our bestselling soap bar, body cream, and a personalised card — all wrapped in a handmade crochet bag with a custom letter charm.",
        benefits_en: "Perfect for gifting, fully customisable, includes crochet bag with letter",
        targetAudience_en: "Gift buyers, special occasions, self-care lovers",
        basePrice: 45.00,
        stockQty: 10,
        isFeatured: true,
        isCustomBasket: true,
        categories: { create: [{ categoryId: giftsCategory.id }] },
      },
    }),
  ]);

  console.log(`✓ ${products.length} products`);

  // ── Promo Codes ───────────────────────────────────────────────────────────────
  await prisma.promoCode.upsert({
    where: { code: "LAUNCH20" },
    update: {},
    create: {
      code: "LAUNCH20",
      description: "20% off for launch — multi-use",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      isActive: true,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      code: "FREESHIP",
      description: "Free shipping on any order",
      discountType: DiscountType.FREE_SHIPPING,
      minOrderAmount: 30,
      isActive: true,
    },
  });

  console.log("✓ 2 promo codes");
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
