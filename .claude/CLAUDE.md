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

_Last synced: 2026-05-18 20:41_

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
