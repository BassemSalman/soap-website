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
        name_ar: "صابون",
        description_en: "Handmade natural soap bars",
        description_ar: "قوالب صابون طبيعية مصنوعة يدويًا",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "creams" },
      update: {},
      create: {
        slug: "creams",
        name_en: "Creams",
        name_ar: "كريمات",
        description_en: "Moisturising and nourishing creams",
        description_ar: "كريمات مرطبة ومغذية",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "serums" },
      update: {},
      create: {
        slug: "serums",
        name_en: "Serums",
        name_ar: "سيروم",
        description_en: "Concentrated treatment serums",
        description_ar: "سيروم علاجي مركّز",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "gifts" },
      update: {},
      create: {
        slug: "gifts",
        name_en: "Gifts & Baskets",
        name_ar: "هدايا وسلال",
        description_en: "Curated gift sets and custom baskets",
        description_ar: "مجموعات هدايا مختارة وسلال مخصصة",
        sortOrder: 4,
      },
    }),
  ]);

  const [soapsCategory, creamsCategory, serumsCategory, giftsCategory] = categories;
  console.log(`✓ ${categories.length} categories`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const products = await Promise.all([
    // Soap bars
    prisma.product.upsert({
      where: { slug: "lavender-honey-soap" },
      update: {},
      create: {
        sku: "SOAP-001",
        type: ProductType.SOAP_BAR,
        slug: "lavender-honey-soap",
        name_en: "Lavender & Honey Soap Bar",
        name_ar: "صابونة اللافندر والعسل",
        description_en: "A soothing handmade soap bar with lavender essential oil and raw honey. Gentle on all skin types.",
        description_ar: "صابونة مصنوعة يدويًا بزيت اللافندر والعسل الطبيعي. لطيفة على جميع أنواع البشرة.",
        benefits_en: "Moisturises deeply, soothes irritated skin, promotes relaxation",
        benefits_ar: "ترطيب عميق، تهدئة البشرة المهيّجة، تعزيز الاسترخاء",
        ingredients_en: "Olive oil, coconut oil, lavender essential oil, raw honey, shea butter",
        ingredients_ar: "زيت الزيتون، زيت جوز الهند، زيت اللافندر، العسل الطبيعي، زبدة الشيا",
        targetAudience_en: "All skin types, especially sensitive skin",
        targetAudience_ar: "جميع أنواع البشرة، خاصةً البشرة الحساسة",
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
        name_ar: "صابونة الفحم وشجرة الشاي",
        description_en: "Deep cleansing activated charcoal soap with tea tree oil. Perfect for oily and acne-prone skin.",
        description_ar: "صابونة الفحم النشط المطهّرة بزيت شجرة الشاي. مثالية للبشرة الدهنية والمعرضة لحب الشباب.",
        benefits_en: "Deep pore cleansing, controls oil, fights acne-causing bacteria",
        benefits_ar: "تنظيف عميق للمسام، التحكم في الدهون، مكافحة بكتيريا حب الشباب",
        ingredients_en: "Activated charcoal, coconut oil, tea tree essential oil, castor oil",
        ingredients_ar: "الفحم النشط، زيت جوز الهند، زيت شجرة الشاي، زيت الخروع",
        targetAudience_en: "Oily and combination skin, teens and adults with acne",
        targetAudience_ar: "البشرة الدهنية والمختلطة، المراهقون والبالغون المصابون بحب الشباب",
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
        name_ar: "صابونة الورد وحليب الماعز",
        description_en: "Luxurious soap with real rose petals and goat milk. Leaves skin silky soft.",
        description_ar: "صابونة فاخرة ببتلات الورد الحقيقية وحليب الماعز. تترك البشرة ناعمة كالحرير.",
        benefits_en: "Brightens complexion, softens skin, anti-aging properties",
        benefits_ar: "تفتيح البشرة، تنعيمها، خصائص مضادة للشيخوخة",
        ingredients_en: "Goat milk, rose petals, rose essential oil, shea butter, vitamin E",
        ingredients_ar: "حليب الماعز، بتلات الورد، زيت الورد، زبدة الشيا، فيتامين E",
        targetAudience_en: "Dry and mature skin, great as a gift",
        targetAudience_ar: "البشرة الجافة والناضجة، هدية رائعة",
        basePrice: 15.00,
        stockQty: 20,
        isFeatured: false,
        categories: { create: [{ categoryId: soapsCategory.id }] },
      },
    }),
    // Creams
    prisma.product.upsert({
      where: { slug: "shea-body-butter-cream" },
      update: {},
      create: {
        sku: "CREAM-001",
        type: ProductType.CREAM,
        slug: "shea-body-butter-cream",
        name_en: "Shea Body Butter Cream",
        name_ar: "كريم زبدة الشيا للجسم",
        description_en: "Rich, whipped body butter that melts into skin. Long-lasting moisture for dry skin.",
        description_ar: "كريم جسم غني يذوب في البشرة. ترطيب طويل الأمد للبشرة الجافة.",
        benefits_en: "Intense moisturisation, heals dry patches, improves skin elasticity",
        benefits_ar: "ترطيب مكثف، علاج البقع الجافة، تحسين مرونة البشرة",
        ingredients_en: "Shea butter, coconut oil, almond oil, vitamin E, lavender essential oil",
        ingredients_ar: "زبدة الشيا، زيت جوز الهند، زيت اللوز، فيتامين E، زيت اللافندر",
        targetAudience_en: "Dry to very dry skin, post-shower care",
        targetAudience_ar: "البشرة الجافة جدًا، العناية بعد الاستحمام",
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
        name_ar: "كريم الألوفيرا للوجه",
        description_en: "Lightweight daily moisturiser with aloe vera and cucumber extract. Ideal for sensitive skin.",
        description_ar: "مرطب يومي خفيف بالألوفيرا ومستخلص الخيار. مثالي للبشرة الحساسة.",
        benefits_en: "Soothes redness, hydrates without greasiness, calms inflammation",
        benefits_ar: "تهدئة الاحمرار، الترطيب بدون دهون، تهدئة الالتهابات",
        ingredients_en: "Aloe vera gel, cucumber extract, hyaluronic acid, chamomile, jojoba oil",
        ingredients_ar: "جل الألوفيرا، مستخلص الخيار، حمض الهيالورونيك، البابونج، زيت الجوجوبا",
        targetAudience_en: "Sensitive and normal skin, everyday use",
        targetAudience_ar: "البشرة الحساسة والعادية، الاستخدام اليومي",
        basePrice: 25.00,
        stockQty: 18,
        isFeatured: false,
        categories: { create: [{ categoryId: creamsCategory.id }] },
      },
    }),
    // Serum
    prisma.product.upsert({
      where: { slug: "vitamin-c-brightening-serum" },
      update: {},
      create: {
        sku: "SERUM-001",
        type: ProductType.SERUM,
        slug: "vitamin-c-brightening-serum",
        name_en: "Vitamin C Brightening Serum",
        name_ar: "سيروم فيتامين C للإشراق",
        description_en: "Potent vitamin C serum that fades dark spots and evens skin tone. Use morning and night.",
        description_ar: "سيروم فيتامين C القوي الذي يخفف البقع الداكنة ويوحد لون البشرة. استخدمه صباحًا ومساءً.",
        benefits_en: "Fades hyperpigmentation, boosts collagen, brightens dull skin",
        benefits_ar: "تخفيف التصبغ، تعزيز الكولاجين، إشراق البشرة الباهتة",
        ingredients_en: "Vitamin C (ascorbic acid), niacinamide, hyaluronic acid, ferulic acid",
        ingredients_ar: "فيتامين C (حمض الأسكوربيك)، نياسيناميد، حمض الهيالورونيك، حمض الفيروليك",
        targetAudience_en: "All skin types, especially uneven or dull skin",
        targetAudience_ar: "جميع أنواع البشرة، خاصةً البشرة غير المتوازنة أو الباهتة",
        basePrice: 35.00,
        stockQty: 12,
        isFeatured: true,
        categories: { create: [{ categoryId: serumsCategory.id }] },
      },
    }),
    // Gift basket
    prisma.product.upsert({
      where: { slug: "self-care-starter-basket" },
      update: {},
      create: {
        sku: "BASKET-001",
        type: ProductType.COMPOSITE_BASKET,
        slug: "self-care-starter-basket",
        name_en: "Self-Care Starter Basket",
        name_ar: "سلة العناية الذاتية للمبتدئين",
        description_en: "A curated gift basket with our bestselling soap bar, body cream, and a personalised card — all wrapped in a handmade crochet bag with a custom letter charm.",
        description_ar: "سلة هدايا منسقة تضم أفضل صابونة، كريم الجسم وبطاقة شخصية — كل ذلك ملفوف في حقيبة كروشيه مصنوعة يدويًا مع حرف مخصص.",
        benefits_en: "Perfect for gifting, fully customisable, includes crochet bag with letter",
        benefits_ar: "مثالية للإهداء، قابلة للتخصيص بالكامل، تتضمن حقيبة كروشيه مع حرف",
        targetAudience_en: "Gift buyers, special occasions, self-care lovers",
        targetAudience_ar: "مشترو الهدايا، المناسبات الخاصة، محبو العناية الذاتية",
        basePrice: 45.00,
        stockQty: 10,
        isFeatured: true,
        isCustomBasket: true,
        categories: { create: [{ categoryId: giftsCategory.id }] },
      },
    }),
  ]);

  console.log(`✓ ${products.length} products`);

  // ── Promo Code ───────────────────────────────────────────────────────────────
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
