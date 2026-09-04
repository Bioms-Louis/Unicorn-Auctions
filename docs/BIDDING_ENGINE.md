# Bidding Engine

## Flow

```
Online:  Browser → server action (auth check) → placeOnlineBid() service
                 → place_bid() DB function (row lock + validation)
                 → bids row + live_auction_state update + auction_events row
                 → Supabase Realtime broadcast → all clients (online + clerk console)

Floor:   Floor bidder → spotter → clerk terminal → placeFloorBid() service
                 (re-checks clerk's server-side permission + paddle validity)
                 → same place_bid() DB function → same broadcast path
```

Both paths converge on one function. There is no code path where the
browser decides a bid was accepted — see
`supabase/migrations/0004_place_bid_function.sql`.

## Concurrency

`place_bid()` opens with `select * from lots where id = p_lot_id for
update`, locking the lot row for the transaction's duration. If two bids
(any combination of online/floor) arrive near-simultaneously for the same
lot, Postgres serializes them; the second transaction sees the first
transaction's committed `current_bid_kobo` before evaluating its own
minimum-increment check. No client timestamp is ever trusted for ordering —
`bids.sequence_number` is assigned server-side by a dedicated sequence.

## Closing a lot ("the gavel")

`close_lot()` uses the same row-lock pattern: it locks the lot, checks
`status = 'active'` before proceeding, and only one concurrent call can
observe that precondition as true — the other receives
`LOT_NOT_ACTIVE_CANNOT_CLOSE`. Sold vs. unsold is decided by comparing the
final bid against `reserve_price_kobo`, all inside the same transaction
that flips lot status, updates `live_auction_state`, and writes the
`LOT_SOLD`/`LOT_PASSED` event.

## Error codes

`placeOnlineBid`/`placeFloorBid` in `src/lib/bidding/place-bid.ts` return a
structured `{ success, bid?, currentBid?, error?: { code, message } }`
shape. Codes: `UNAUTHENTICATED`, `FORBIDDEN`, `VALIDATION_ERROR`,
`LOT_NOT_FOUND`, `AUCTION_NOT_FOUND`, `AUCTION_NOT_LIVE`, `LOT_NOT_ACTIVE`,
`BIDDER_NOT_ELIGIBLE`, `PADDLE_REQUIRED`, `PADDLE_NOT_VALID`,
`BID_TOO_LOW`, `UNKNOWN_ERROR`.

## Still to build (Phase 5)

- Realtime channel subscription wiring in the live auction room and clerk
  console (`auction:{auctionId}`, `lot:{lotId}`).
- Reconnect/resync logic: on reconnect, re-fetch `live_auction_state`
  before trusting any further broadcast, so a dropped connection can never
  leave a client believing a stale bid is still current.
- Countdown extension rules, if/when configured.
