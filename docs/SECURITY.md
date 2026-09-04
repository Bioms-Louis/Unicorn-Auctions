# Security

- **RLS is the real boundary.** `src/lib/auth/roles.ts` types exist for
  UI convenience; every table with user data has Row Level Security
  policies in `supabase/migrations/0001`–`0003`. Never gate a privileged
  action on a client-side role check alone.
- **Service-role key never reaches the browser.** `src/lib/supabase/service-role.ts`
  is `server-only` and used exclusively by domain services in `src/lib/**`
  that perform authentication + authorization *before* calling it.
- **Bid identity comes from the session, not the request body.** See
  `placeOnlineBid` — the bidder id is looked up from `auth.getUser()`,
  never accepted as a client-supplied field.
- **Webhook idempotency.** `payment_webhooks` records the provider's event
  id under a unique constraint before processing, so retried/duplicate
  Paystack webhooks can't double-apply a payment (Phase 6 will implement
  the handler against this table).
- **Financial/audit append-only.** `financial_ledger` and `audit_logs`
  reject `UPDATE`/`DELETE` at the trigger level.
- Still to implement in later phases: rate limiting on bid submission and
  auth endpoints, webhook signature verification for Paystack, signed URLs
  for private Storage documents (KYC/receipts), CSRF protections on any
  non-Server-Action mutation endpoints.
