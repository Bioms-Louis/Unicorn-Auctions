# Database

PostgreSQL via Supabase. Migrations live in `supabase/migrations/`, applied
in numeric order. All money columns are `bigint` storing **kobo** (integer
minor units) — never `numeric`/`float` for currency.

- `0001_core_schema.sql` — roles/RBAC, profiles, organizations, partners,
  brokers, bidders, KYC, deposits, paddles + RLS.
- `0002_auctions_lots_bidding.sql` — auctions, lots, bids, bid_events,
  auction_events, live_auction_state + RLS.
- `0003_financial_engine.sql` — payments, webhooks, tax_rules, invoices,
  settlements, broker_commissions, payouts, financial_ledger (append-only),
  gate_passes, notifications, watchlists, audit_logs (append-only), settings.
- `0004_place_bid_function.sql` — `place_bid()` and `close_lot()`, the
  atomic, row-locked functions that are the only sanctioned way bids get
  accepted or lots get closed.
- `0005_storage_buckets.sql` — RLS policies on `storage.objects` for the
  KYC/receipt/lot-media/lot-document buckets. **Does not create the
  buckets themselves** — `storage.buckets` is owned by Supabase's internal
  storage role, so a direct `INSERT` from the SQL Editor fails with `must
  be owner of table buckets`. Create the buckets first with
  `npm run setup:storage` (or by hand in Dashboard → Storage), then run
  this migration.

## Invariants enforced at the database layer (not just app code)

- Accepted `bids` rows are immutable — a trigger blocks `UPDATE`/`DELETE`.
- `financial_ledger` and `audit_logs` are append-only — triggers block
  `UPDATE`/`DELETE` entirely; corrections are new rows.
- `bids.sequence_number` is assigned atomically by a `bid_sequence_seq`
  sequence in a `BEFORE INSERT` trigger — ordering is never derived from
  client-supplied timestamps.
- Row Level Security is enabled on every table with user-facing data;
  service-role access (which bypasses RLS) is confined to `src/lib/**`
  domain services that perform their own authorization first.

## Regenerating types

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```
