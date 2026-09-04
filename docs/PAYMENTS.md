# Payments (Paystack)

## Setup

1. Get your keys from the Paystack dashboard (Settings → API Keys & Webhooks).
2. Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` in `.env.local`.
3. In the Paystack dashboard, set the webhook URL to
   `${NEXT_PUBLIC_APP_URL}/api/payments/paystack/webhook`.
4. Set `NEXT_PUBLIC_APP_URL` to your real deployed URL in production —
   Paystack calls the webhook server-to-server, so `localhost` only works
   with a tunnel (e.g. `ngrok`) during local development.

## Flow

1. `initiateBidderDeposit()` (`src/lib/payments/deposits.ts`) creates a
   `bidder_deposits` row (`awaiting_payment`) + a `payments` row (`pending`),
   then calls Paystack's `/transaction/initialize` and returns the
   `authorization_url` the bidder is redirected to.
2. The bidder completes checkout on Paystack's hosted page.
3. Paystack redirects the browser back to
   `/api/payments/paystack/callback`, which does a best-effort server-side
   verify and redirects to a status page — **this is not what confirms the
   payment.**
4. Paystack also calls `/api/payments/paystack/webhook` server-to-server
   with a `charge.success` event. This handler:
   - Verifies the `x-paystack-signature` HMAC-SHA512 header before doing
     anything else.
   - Inserts the event into `payment_webhooks` under a
     `UNIQUE(provider, event_id)` constraint *before* processing — so a
     retried/duplicate webhook is detected and skipped, never double-applied.
   - Marks the `payments`/`bidder_deposits` rows accordingly
     (`awaiting_payment` → `paid`).
5. A human (finance/admin) explicitly verifies the deposit via
   `verifyDeposit()` (`paid` → `verified`), which is what actually
   transitions the bidder to `deposit_verified` and, from there, they can
   be moved to `bidding_enabled`. This mirrors the operational brief's
   distinction between "paid" and "verified" deposit statuses.

## Still to build

- The finance-facing UI for reviewing/verifying paid deposits and manual
  bank-transfer receipts (`bank_transfer_receipts` table already exists).
- Winning-bid settlement payments (currently only the deposit flow is wired).
- Retry/backoff handling if Paystack's initialize call fails transiently.
