# Architecture

## Principle: one authoritative auction state

Unicorn Auctions runs **hybrid** auctions — a single bidding engine serves
both online bidders and physical floor bidders through a clerk console.
There is no separate "online auction system" and "floor auction system."
Both paths converge on the same server-side function
(`place_bid` in `supabase/migrations/0004_place_bid_function.sql`), which:

1. Row-locks the lot (`select ... for update`) so simultaneous bids —
   online vs. floor vs. another online bidder — are serialized by Postgres.
2. Re-validates every eligibility rule server-side (auction is live, lot is
   active, bidder is eligible/has a valid paddle, bid clears the minimum
   increment).
3. Writes an immutable, sequenced `bids` row and updates
   `live_auction_state`, which is what the live auction room and clerk
   console both read — via Supabase Realtime — as ground truth.

The browser **never** decides whether a bid was accepted. It submits an
intent and renders whatever the server broadcasts back.

## Domain services (`src/lib/**`)

Each business domain gets its own service module rather than logic
scattered across route handlers or UI components:

```
lib/auth/         RBAC roles & permission table (type-level; see SECURITY.md)
lib/money/        Integer-kobo arithmetic, NGN formatting, tax/fee defaults
lib/bidding/       placeBid()-style services wrapping the DB RPC functions
lib/auctions/      Auction state-machine transitions
lib/lots/          Lot lifecycle, approval workflow
lib/bidders/       Bidder onboarding/eligibility state machine
lib/partners/      Partner onboarding, consignment
lib/brokers/       Referral tracking, commission calculation
lib/payments/      Paystack init/verify, webhook idempotency, bank transfer
lib/invoices/      Invoice generation from stored line items + rates
lib/settlements/   Partner settlement calculation
lib/taxes/         VAT/WHT/EMTL resolution (platform→auction→lot→partner→category precedence)
lib/notifications/ Abstract notification dispatch (email-ready, provider-agnostic)
lib/gate-passes/   Gate pass issuance/verification
lib/audit/         Audit log writer used by every privileged mutation
```

## Client tiers (`src/lib/supabase/*`)

| Client | Key | Used for | RLS applies? |
|---|---|---|---|
| `client.ts` | anon | Browser reads/writes as the logged-in user | Yes |
| `server.ts` | anon + session cookies | Server Components / Actions "as the user" | Yes |
| `service-role.ts` | service role | Trusted server-side domain services only | **No — bypassed** |

`service-role.ts` is marked `server-only` so any accidental client-bundle
import fails the build. Domain services that use it are themselves
responsible for authorization before calling out to it (see
`src/lib/bidding/place-bid.ts` for the pattern: authenticate → look up role
→ authorize → call service-role RPC).

## Phased delivery plan

- **Phase 1 — Foundation (this scaffold):** Next.js/TS/Tailwind setup,
  Supabase clients, RBAC types, core schema + RLS (`0001`–`0003`), the
  atomic `place_bid`/`close_lot` functions (`0004`), money/tax utilities.
- **Phase 2 — Public platform:** homepage, auction/lot catalog, Sanity CMS
  integration, Web3Forms.
- **Phase 3 — User portals:** bidder/partner/broker dashboards, KYC,
  deposit flow.
- **Phase 4 — Auction management:** auction/lot CRUD, approval workflows,
  paddle management.
- **Phase 5 — Realtime auction engine:** live auction room, clerk console,
  Supabase Realtime channel wiring (`auction:{id}`, `lot:{id}`).
- **Phase 6 — Financial system:** Paystack integration, webhook handling,
  bank transfer reconciliation, invoice/settlement generation, ledger.
- **Phase 7 — Gate pass:** QR generation, verification endpoint.
- **Phase 8 — Admin:** full admin dashboard, reporting/CSV export.
- **Phase 9 — Testing & hardening:** unit/integration/realtime tests,
  security review, performance pass.

Each phase should leave the repo in a runnable state — no phase depends on
faking data that a later phase is supposed to make real (no fake bid
timers, no `depositPaid = true` booleans, no localStorage as financial
source of truth).
