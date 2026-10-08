# CH FURNITURE — Premium Wooden Furniture Catalog

A production-ready luxury furniture **catalog** website for **CH FURNITURE**, a premium custom wooden-furniture manufacturer in Sialkot, Pakistan.

This is **not** an eCommerce store — there is no cart or checkout. It is a polished digital catalog where customers browse designs and enquire directly via **WhatsApp**, plus a full admin CMS to manage everything.

Built with **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, **Prisma + PostgreSQL**, **NextAuth**, **Cloudinary**, and **Framer Motion**.

---

## Features

**Public site**
- Cinematic dark, brass-accented luxury design (Cormorant Garamond + Inter)
- Home with hero, animated stats, featured collections, best sellers, process, testimonials, FAQ
- Category listing + per-category pages with **style / wood-type filters**
- Product detail with image/video gallery, lightbox, specs, features, related items
- One-tap **WhatsApp enquiry** (general + product-specific prefilled messages)
- Live catalog **search**, contact form, About page, Google Map
- SEO: dynamic metadata, Open Graph, JSON-LD (FurnitureStore + Product), `sitemap.xml`, `robots.txt`
- Accessible, responsive, respects `prefers-reduced-motion`

**Admin CMS** (`/admin`)
- Single-admin email + password login (NextAuth, JWT)
- Manage categories, furniture (with Cloudinary image/video upload), testimonials
- Read/respond to contact messages
- Edit all site settings: contact details, WhatsApp number/message, socials, SEO, About content, stat counters

---

## Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 14 (App Router, RSC, Server Actions) |
| Language | TypeScript |
| Styling | TailwindCSS + custom design tokens |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth (Credentials, JWT sessions) |
| Media | Cloudinary (unsigned upload widget + server deletes) |
| Animation | Framer Motion |
| Icons | lucide-react |
| Deploy | Vercel (recommended) |

---

## Prerequisites

- **Node.js 18.17+** (or 20+)
- A **PostgreSQL** database — local, or hosted (Neon, Supabase, Vercel Postgres)
- A free **Cloudinary** account

---

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable | What it is |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` in dev; your domain in prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seeded admin login |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary API credentials (server-side deletes) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name (see below) |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for SEO/sitemap/OG |

## 3. Cloudinary unsigned upload preset

The admin media uploader uses an **unsigned** preset so images upload straight from the browser.

1. Cloudinary Dashboard → **Settings → Upload → Upload presets → Add**
2. Set **Signing Mode = Unsigned**
3. Name it to match `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (default `ch_furniture_unsigned`)
4. (Optional) set the target folder to `ch-furniture`
5. Save

## 4. Database setup

Push the schema and seed starter data (admin user, 11 categories, sample designs, testimonials, settings):

```bash
npm run db:push
npm run db:seed
```

> Seed images use Unsplash placeholders — replace them with your own uploads from the admin panel.

## 5. Run

```bash
npm run dev
```

- Public site → http://localhost:3000
- Admin → http://localhost:3000/admin/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

---

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Run the production build |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:seed` | Seed starter data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run lint` | Lint |

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it into **Vercel**.
3. Add all environment variables from `.env` to the Vercel project (set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Use a hosted Postgres (Neon / Supabase / Vercel Postgres) for `DATABASE_URL`.
5. Deploy. The build runs `prisma generate` automatically.
6. After the first deploy, seed the production database once — either run `npm run db:seed` locally against the production `DATABASE_URL`, or `npx prisma db push` then seed.

> **Editing content:** everything (contact info, WhatsApp number, SEO, About text, catalog) is editable from `/admin` — no redeploy needed. Public pages revalidate every 60 seconds.

---

## Project structure

```
src/
  app/
    (public routes)      home, about, categories, category/[slug], category/[slug]/[product], contact, search
    admin/               login + (panel) dashboard, categories, furniture, testimonials, messages, settings
    actions/             server actions (contact, admin CRUD)
    api/                 nextauth, search
    sitemap.ts robots.ts
  components/
    site/                navbar, footer, cards, gallery, filters, forms, home sections
    admin/               managers, forms, media uploader, sidebar
    motion/              reveal + counter animations
  lib/                   prisma, auth, cloudinary, queries, settings, constants, utils
prisma/
  schema.prisma          data model
  seed.ts                starter data
```

---

## Business details (pre-configured, editable in admin)

- **Brand:** CH FURNITURE
- **Tagline:** Crafting Premium Wooden Furniture with Timeless Elegance.
- **Phone / WhatsApp:** +92 341 6309652
- **Address:** Mohala Sardaaran, Near HBL Bank, Kalaswala, Pasrur, Sialkot, Punjab, Pakistan

---

## Notes & future enhancements

Not included in this core build (candidates for later): PWA/offline, light-mode toggle, infinite scroll, newsletter capture, analytics dashboard, and catalog import/export. The current focus is a polished public catalog + complete admin CMS.
