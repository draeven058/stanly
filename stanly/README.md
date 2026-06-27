# Stanly — Stan-Style Creator Platform

A production-ready creator monetization platform built with Next.js 15, Supabase, and TypeScript.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (SSR-compatible)
- **Storage**: Supabase Storage
- **Charts**: Recharts
- **Deployment**: Vercel

## Quick Start

### 1. Clone and install

```bash
git clone <repo>
cd stanly
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New project.

### 3. Run the SQL schema

In the Supabase dashboard → SQL Editor, paste and run the contents of `supabase/schema.sql`.

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for dev |

### 5. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth route group (no sidebar)
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/           # Protected creator dashboard
│   │   ├── layout.tsx       # Sidebar + mobile nav wrapper
│   │   ├── page.tsx         # Overview with stats
│   │   ├── products/        # Product CRUD
│   │   ├── orders/          # Order history
│   │   ├── store/           # Store link management
│   │   ├── analytics/       # Revenue + views charts
│   │   └── settings/        # Profile settings
│   ├── store/[username]/    # Public creator page
│   └── layout.tsx           # Root layout (dark theme)
│
├── components/
│   ├── ui/                  # Primitive UI components (shadcn-style)
│   ├── dashboard/           # Dashboard-specific components
│   └── analytics/           # Recharts wrappers
│
├── lib/
│   ├── supabase/            # client.ts / server.ts / middleware.ts
│   └── utils/               # cn(), formatCurrency(), slugify(), etc.
│
├── actions/                 # Server Actions (auth, products, profile)
├── types/                   # TypeScript interfaces
├── middleware.ts             # Auth route protection
└── styles/globals.css       # CSS variables + Tailwind base
```

## Key Features

### Authentication
- Email/password signup with username claim
- Supabase Auth SSR (cookies, no localStorage)
- Route protection via Next.js middleware
- Forgot password with email reset

### Products
- Create/edit/delete digital products
- Product types: Digital, Course, Membership, Link
- Publish/unpublish toggle
- File upload to Supabase Storage

### Public Store (`/store/[username]`)
- SEO metadata via `generateMetadata`
- Avatar, bio, social links
- Product cards with buy button
- Custom links section

### Dashboard
- Revenue, orders, views, product count stats
- Recent orders table
- 30-day analytics with Recharts (area + bar charts)
- Responsive: full sidebar on desktop, sheet on mobile

## Supabase Schema

5 tables with full RLS:
- `profiles` — auto-created on signup via trigger
- `stores` — one store per creator (1:1 with profile)
- `products` — digital products belonging to a store
- `orders` — purchase records
- `links` — custom bio links

## Deployment

```bash
# Vercel (recommended)
npx vercel

# Add environment variables in Vercel dashboard
# Set NEXT_PUBLIC_SITE_URL to your production domain
```

## Adding Stripe Payments

1. Install: `npm install stripe @stripe/stripe-js`
2. Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create `/api/checkout/route.ts` — Stripe Checkout session
4. Create `/api/webhooks/stripe/route.ts` — fulfill orders on `checkout.session.completed`
5. Wire up the "Buy now" button on the public store page
