# AI Context

## Proactive Suggestions

You are urged to **continuously propose ideas** throughout conversations — regarding business model, product line, marketing, architecture, features, UX, or anything else that could benefit the Organics Business. Don't wait to be asked. Surface relevant suggestions naturally as you work.

## Notion — Source of Truth

Partners and developers maintain the **Organics Business** Notion space as the authoritative source for requirements, brand guidelines, and architecture decisions. Do not fetch them unless told to sync.

### Notion pages

- [Organics Business](https://www.notion.so/36401de35ed28072978af467b8a9c985) — root page
  - [Business Model](https://www.notion.so/36401de35ed2805c8f88c347c202c99a)
    - [Brand Identity](https://www.notion.so/36401de35ed2807fa21bddfc051816cc)
    - [Products](https://www.notion.so/36401de35ed2805c930bd059c99a8560)
    - [Social Media](https://www.notion.so/36401de35ed2802aa2b1c6008a7999c9)
  - [Software](https://www.notion.so/36401de35ed280658139d8c85262839d)
    - [Architecture](https://www.notion.so/36401de35ed2804a9b0dfb6d05a5e232)
    - [Requirements](https://www.notion.so/36401de35ed28061979be19842269f0b)

### Syncing context

When the user says **"sync notion"**, fetch the relevant Notion pages and paste their content below under a `## Notion Content` section. Do not fetch Notion automatically — only when explicitly triggered.

## Notion Content

_Last synced: 2026-05-19_

### Business Stage

Pre-launch under this brand. The team already sells products under a different business name, so there is existing operational experience. This website is the launchpad for the new Organics brand identity.

### Brand Identity

**Keywords:** Organic, Homemade, Healthy, Cute, Gift, Self Care

**Logo:** Soap inside a crochet bag in cartoon style.

**Target Market:** Local Lebanese market.

**Target Audience:**

- Women aged 19–40 (primary)
- Boyfriends buying gifts for their girlfriends
- Engaged or marrying couples
- New parents (baby gifts / self-care)

**Positioning:**

- Brand speaks equally to **self-care** (buying for yourself) and **gifting** (buying for others)
- Do NOT position as gift-only — this alienates the primary self-care audience
- The crochet bag + customisable letter + card is the signature gift experience, but products stand alone as self-care items too

### Products

- Basic Soap Bar
- Creams
- Serums
- Loafs
- Composite product / "basket" bundling multiple items
- Souvenirs and special requests
- Crochet Mini Bags + customisable letter (brand identity item)
- Customisable card inside the crochet bag

### Social Media

- Realistic AI-generated images
- AI video trends
- Content ideas: solution-focused posts, influencer marketing
- Meta Ads (managed by Dad)

### Architecture

**Stack:**

- **Framework:** Next.js (App Router, SSR + SSG for SEO)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (supports toggleable themes)
- **i18n / RTL:** next-intl (English + Arabic from day one)
- **Database:** PostgreSQL + Prisma ORM — hosted on **Neon**
- **Auth:** NextAuth.js — providers: **Google + Email OTP** (via Resend, 3k emails/month free)
  - Phone number collected as plain field at checkout (delivery contact only, no verification)
  - Rationale: SMS OTP costs $0.05–0.15/message to Lebanese numbers — not viable for near-zero cost
- **Images:** Cloudinary
- **Deployment:** Vercel
- **Chatbot:** Claude API (Haiku model) — product recommendation only
- **Admin Panel:** Custom-built under `/admin` route in the same Next.js app

**Principles:**

- Scalable and clean file structure — store rules in md files
- Clear and consistent UI design system with toggleable themes (color scheme, name, logo all dynamically changeable at runtime — temporary feature)
- No overcomplicated logic — keep things simple and maintainable
- Bilingual DB fields pattern: `name_en` / `name_ar`, `description_en` / `description_ar` (English-first, full Arabic translation)
- Cart and orders persisted in DB (not localStorage/session)
- Orders submitted via WhatsApp deeplink AND stored in DB for delivery tracking

**Coding Conventions:**

- App Router structure under `src/app/`
- Feature-based folders: `src/features/`, `src/components/`, `src/lib/`, `src/hooks/`
- kebab-case for all files and folders
- PascalCase for React component names
- Named exports only (except Next.js pages and layouts)
- Zod for all validation schemas
- Server Components by default — use `"use client"` only when necessary

### Requirements

#### Client

- Browse products with benefits, ingredients, target audience, and categories
- **Auth:** Google + Email OTP (customers must authenticate to prevent fake orders)
  - Phone number collected as plain field at checkout for delivery contact
- **Cart:** DB-persisted (survives sessions, tied to account)
- **Order submission:** WhatsApp deeplink to notify shop + DB record for tracking (cash on delivery only, no online payment)
- **Build-your-own basket:** Customer picks 2–5 products, chooses crochet bag letter, adds a card message — presented as a single composite order item
- Delivery tracking — manual status set by admin (delivered / not delivered) + feedback collection on website
- WhatsApp icon redirecting to business number
- **Chatbot:** Claude API (Haiku) — suggests products based on customer needs
- English and Arabic support (RTL required from day one, not an afterthought — English-first, full Arabic translation)
- Promo codes: multi-use, percentage discount or free shipping

#### Administrator

- Create/manage products, categories, raw materials, product costing
- Raw material management (when to buy what)
- Create baskets, promo codes, sales
- Stock management
- Basic accounting and reporting
- **Manual order entry:** Log orders placed outside the website (e.g. WhatsApp, in-person) directly from the admin panel — same DB record and tracking as website orders

### Progress

Infrastructure

- Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui bootstrapped
- All dependencies installed (NextAuth v5, Prisma v7, Neon, Cloudinary, Resend, Anthropic SDK, Zod)

Database

- Full Prisma schema — 20 models, all migrated to Neon ✓
- Users, Auth (Google + Email OTP), Products (bilingual), Categories, Cart, Orders, Baskets, Promo Codes,
  Raw Materials, Costing, Chat, Site Settings

Backend structure

- src/lib/ — db, auth, cloudinary, resend, claude, whatsapp, i18n (EN+AR), utils
- src/features/ — 12 feature folders with Zod schemas + stubbed actions/queries
- src/auth.ts — NextAuth v5 config
- src/proxy.ts — route protection for /admin, /account, /checkout (migrated from middleware.ts)
- src/types/ — NextAuth type augmentation, BasketConfig type
- Chat API route (/api/chat) — Claude Haiku streaming

---

Done ✅

- All 9 pages with real data fetching
- All UI components (homepage, shop, product detail, cart, checkout, basket builder, account, admin)
- Backend: products, cart, checkout (with atomic order transaction), orders, reports, promo codes, raw materials
- Auth sign-in page (polished UI)
- Chat API route (streaming Claude Haiku)
- Admin panel (dashboard, products, orders, reports, raw materials, promo codes)
- middleware.ts → proxy.ts migration (Next.js 16 deprecation fix)
- Seed script (prisma/seed.ts) — categories, products, promo codes; run with `npm run seed`
- Deployed to Vercel ✓ — DATABASE_URL, DIRECT_URL, AUTH_SECRET set; shop/homepage pages set to force-dynamic


---

What's left

Critical (blocking launch)

| # | Task |
|---|------|
| 1 | Env vars still missing on Vercel: GOOGLE_CLIENT_ID/SECRET, RESEND_API_KEY, RESEND_FROM_EMAIL, ANTHROPIC_API_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER, WHATSAPP_NUMBER, Cloudinary vars — need domain first for Resend |
| 2 | Wire ChatWidget — component is done but never rendered in any layout |
| 3 | Basket-builder actions — src/features/basket-builder/ is an empty stub (add/remove items to basket in cart) |

Important (pre-launch quality)

| # | Task |
|---|------|
| 4 | Auth pages — verify-request and error pages are 12-line stubs, need proper styling |
| 5 | Product detail page — src/app/(shop)/products/[slug]/page.tsx needs a check |
| 6 | Admin CRUD forms — tables exist but no create/edit modals wired up |
| 7 | Costing feature — src/features/costing/ is empty (needed for profit margin reports) |

Later (post-launch)

| # | Task |
|---|------|
| 8 | i18n — Arabic translations exist (en.json/ar.json) but next-intl is not wired; components use hardcoded English |
| 9 | Cloudinary image upload in admin product form |

---

The core customer flow (browse → cart → checkout → WhatsApp order) is fully implemented. Site is live on Vercel with seed data. Remaining blockers are env vars (needs domain for email) and unimplemented basket-builder actions.
