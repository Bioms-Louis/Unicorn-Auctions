# Unicorn Auctions

A hybrid (physical floor + online) auction-management platform for a Nigerian
auction house. See `docs/` for the full architecture, database, bidding
engine, financial engine, and security design.

**Status: in progress.** Auth/RBAC, core domain schema, the atomic bidding
engine, Storage buckets, money/tax utilities, sign-up/sign-in, bidder
onboarding (KYC + Paystack deposit flow, idempotent webhook), the public
site (homepage/auction/lot catalog), and the realtime live auction room +
clerk console are built. See `docs/ARCHITECTURE.md` for what's left
(partner/broker portals, invoicing/settlement UI, gate pass, admin
dashboard, Sanity/Web3Forms, testing/hardening).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Realtime, Storage, Row Level Security)
- Paystack (payments) + direct bank transfer reconciliation
- Sanity (public/editorial CMS content only — never transactional data)
- Web3Forms (public contact/enquiry forms only)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real credentials
```

### Supabase setup

1. Create a Supabase project.
2. Apply the migrations in order:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
   (or paste each file in `supabase/migrations/` into the SQL editor, in
   numeric order — `0001_...` through `0005_...`).
3. Generate typed client bindings:
   ```bash
   npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

   ```
4. Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. **Never** expose the service
   role key with a `NEXT_PUBLIC_` prefix.

### Run

```bash
npm run dev
```

### Test

```bash
npm run test
```

Runs the financial engine and state-machine unit tests (`src/lib/**/*.test.ts`).

## Project layout

```
src/
  app/                Next.js App Router routes
  components/ui/       Shared UI primitives
  lib/
    auth/               RBAC roles/permissions (type-level; DB RLS is the real boundary)
    money/              Integer-kobo money utilities, tax/fee defaults
    bidding/            placeBid() etc. — the only sanctioned way to submit a bid
    auctions/ lots/ ...  (domain service stubs — see docs/ARCHITECTURE.md)
    supabase/           client.ts (browser/anon) · server.ts (server/anon+session)
                        · service-role.ts (server-only, bypasses RLS)
supabase/
  migrations/          Ordered SQL migrations — schema, RLS, bidding functions
docs/                  Architecture, database, bidding engine, financial engine, security docs
```

## Key design decisions

- **Money** is always stored/computed as integer kobo (`BIGINT`), never
  floats. See `src/lib/money`.
- **Bids are immutable once accepted** — enforced by a Postgres trigger.
  Corrections are compensating `bid_events`, never `UPDATE`/`DELETE`.
- **The database is authoritative** for bid acceptance, lot state, and
  auction countdowns. Clients render server state; they never decide it.
  See `supabase/migrations/0004_place_bid_function.sql`.
- **RLS + server-side service checks**, not frontend role checks, are the
  security boundary. See `docs/SECURITY.md`.
- **Payment webhooks are idempotent by construction** — every inbound
  event is recorded under a unique constraint before it's processed. See
  `docs/PAYMENTS.md`.
