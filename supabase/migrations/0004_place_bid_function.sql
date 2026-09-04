-- Unicorn Auctions — Atomic bid placement.
--
-- This function is the single authoritative gate for accepting a bid,
-- whether it originates online or from the floor via a clerk. It must be
-- called via the service-role client from the server-side placeBid()
-- service (src/lib/bidding/place-bid.ts) AFTER application-level
-- authentication/eligibility checks — this function re-validates the
-- critical invariants itself so it is safe even if called directly.
--
-- Concurrency safety: `select ... for update` row-locks the lot for the
-- duration of the transaction, so simultaneous bids (online vs floor vs
-- another online bidder) are serialized by Postgres itself. The DB, not
-- client timestamps, decides ordering (see bid_sequence_seq / server_created_at).

create or replace function place_bid(
  p_auction_id uuid,
  p_lot_id uuid,
  p_bidder_id uuid,
  p_paddle_id uuid,
  p_amount_kobo bigint,
  p_source bid_source,
  p_created_by uuid
) returns bids
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lot lots%rowtype;
  v_auction auctions%rowtype;
  v_min_next_bid bigint;
  v_bid bids;
  v_rejection text;
begin
  -- Lock the lot row so concurrent bids on the same lot serialize here.
  select * into v_lot from lots where id = p_lot_id for update;
  select * into v_auction from auctions where id = p_auction_id;

  if v_lot.id is null then
    v_rejection := 'LOT_NOT_FOUND';
  elsif v_auction.id is null then
    v_rejection := 'AUCTION_NOT_FOUND';
  elsif v_auction.status <> 'live' then
    v_rejection := 'AUCTION_NOT_LIVE';
  elsif v_lot.status <> 'active' then
    v_rejection := 'LOT_NOT_ACTIVE';
  elsif p_source in ('online') and not exists (
    select 1 from bidders where id = p_bidder_id and state = 'bidding_enabled'
  ) then
    v_rejection := 'BIDDER_NOT_ELIGIBLE';
  elsif p_source in ('floor','clerk') and p_paddle_id is null then
    v_rejection := 'PADDLE_REQUIRED';
  elsif p_paddle_id is not null and not exists (
    select 1 from paddles where id = p_paddle_id and bidder_id = p_bidder_id
      and auction_id = p_auction_id and is_active
  ) then
    v_rejection := 'PADDLE_NOT_VALID';
  else
    v_min_next_bid := coalesce(v_lot.current_bid_kobo, v_lot.starting_bid_kobo) + v_lot.bid_increment_kobo;
    if v_lot.current_bid_kobo is null then
      -- first bid on the lot must clear the starting bid
      v_min_next_bid := v_lot.starting_bid_kobo;
    end if;

    if p_amount_kobo < v_min_next_bid then
      v_rejection := 'BID_TOO_LOW';
    end if;
  end if;

  if v_rejection is not null then
    insert into bids (auction_id, lot_id, bidder_id, paddle_id, amount_kobo, source, result, rejection_reason, created_by)
    values (p_auction_id, p_lot_id, p_bidder_id, p_paddle_id, p_amount_kobo, p_source, 'rejected', v_rejection, p_created_by)
    returning * into v_bid;
    return v_bid;
  end if;

  insert into bids (auction_id, lot_id, bidder_id, paddle_id, amount_kobo, source, result, created_by)
  values (p_auction_id, p_lot_id, p_bidder_id, p_paddle_id, p_amount_kobo, p_source, 'accepted', p_created_by)
  returning * into v_bid;

  update lots
    set current_bid_kobo = p_amount_kobo,
        highest_bidder_id = p_bidder_id,
        updated_at = now()
    where id = p_lot_id;

  insert into live_auction_state (lot_id, auction_id, is_open_for_bids, current_bid_kobo, next_min_bid_kobo, highest_bidder_id, updated_at)
  values (p_lot_id, p_auction_id, true, p_amount_kobo, p_amount_kobo + v_lot.bid_increment_kobo, p_bidder_id, now())
  on conflict (lot_id) do update
    set current_bid_kobo = excluded.current_bid_kobo,
        next_min_bid_kobo = excluded.next_min_bid_kobo,
        highest_bidder_id = excluded.highest_bidder_id,
        updated_at = now();

  -- Realtime clients subscribe to auction_events for BID_ACCEPTED notifications.
  insert into auction_events (auction_id, lot_id, event_type, payload, created_by)
  values (p_auction_id, p_lot_id, 'BID_ACCEPTED', jsonb_build_object(
    'bid_id', v_bid.id, 'amount_kobo', p_amount_kobo, 'source', p_source, 'bidder_id', p_bidder_id
  ), p_created_by);

  return v_bid;
end;
$$;

comment on function place_bid is 'Single authoritative entry point for accepting/rejecting a bid. Row-locks the lot to serialize concurrent online/floor bids. Call only from the server-side bidding service, never directly from client code.';

-- Atomic lot closing — "the gavel". Ensures only one operator can close a
-- given lot even under simultaneous close attempts (row lock + status check).
create or replace function close_lot(
  p_lot_id uuid,
  p_closed_by uuid
) returns lots
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lot lots%rowtype;
begin
  select * into v_lot from lots where id = p_lot_id for update;

  if v_lot.id is null then
    raise exception 'LOT_NOT_FOUND';
  end if;
  if v_lot.status <> 'active' then
    raise exception 'LOT_NOT_ACTIVE_CANNOT_CLOSE';
  end if;

  if v_lot.current_bid_kobo is not null
     and (v_lot.reserve_price_kobo is null or v_lot.current_bid_kobo >= v_lot.reserve_price_kobo) then
    update lots set status = 'sold', updated_at = now() where id = p_lot_id returning * into v_lot;
  else
    update lots set status = 'unsold', updated_at = now() where id = p_lot_id returning * into v_lot;
  end if;

  update live_auction_state set is_open_for_bids = false, updated_at = now() where lot_id = p_lot_id;

  insert into auction_events (auction_id, lot_id, event_type, payload, created_by)
  values (v_lot.auction_id, p_lot_id,
    case when v_lot.status = 'sold' then 'LOT_SOLD' else 'LOT_PASSED' end,
    jsonb_build_object('final_bid_kobo', v_lot.current_bid_kobo, 'winning_bidder_id', v_lot.highest_bidder_id),
    p_closed_by
  );

  insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (p_closed_by, 'lot.close', 'lot', p_lot_id, jsonb_build_object('resulting_status', v_lot.status));

  return v_lot;
end;
$$;

comment on function close_lot is 'Atomically closes a lot (the "gavel"). Row lock + status guard ensures only one concurrent close attempt succeeds; the other receives LOT_NOT_ACTIVE_CANNOT_CLOSE.';
