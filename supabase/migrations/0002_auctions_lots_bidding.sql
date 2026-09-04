-- Unicorn Auctions — Auctions, Lots, and the Hybrid Bidding Engine

create type auction_status as enum (
  'draft','pending_review','scheduled','registration_open',
  'inspection_open','live','paused','completed','cancelled','archived'
);

create table auctions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  venue text,
  status auction_status not null default 'draft',
  starts_at timestamptz,
  registration_deadline timestamptz,
  inspection_starts_at timestamptz,
  inspection_ends_at timestamptz,
  default_bid_increment_kobo bigint not null default 1000000, -- ₦10,000
  default_deposit_kobo bigint not null default 0,
  buyer_premium_bp integer check (buyer_premium_bp between 0 and 10000),
  seller_commission_bp integer check (seller_commission_bp between 0 and 10000),
  vat_bp integer not null default 750, -- 7.5% default per operational brief
  wht_bp integer not null default 500, -- 5% default per operational brief
  auctioneer_id uuid references profiles(id),
  clerk_id uuid references profiles(id),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Valid auction state machine — enforced in application code (src/lib/auctions)
-- as well as here as a defensive backstop comment for schema readers:
--   draft -> pending_review -> scheduled -> registration_open -> inspection_open
--   -> live <-> paused -> completed
--   any non-terminal state -> cancelled; completed/cancelled -> archived

alter table bidder_deposits
  add constraint bidder_deposits_auction_fk foreign key (auction_id) references auctions(id);
alter table paddles
  add constraint paddles_auction_fk foreign key (auction_id) references auctions(id);
alter table paddles
  add constraint paddles_unique_per_auction unique (auction_id, paddle_number);

create table auction_staff (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (auction_id, user_id, role)
);

create type lot_status as enum (
  'draft','pending_review','approved','scheduled','active',
  'sold','unsold','passed','withdrawn','cancelled'
);

create table lots (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id) on delete cascade,
  partner_id uuid references partners(id),
  lot_number text not null,
  title text not null,
  description text,
  category text not null, -- vehicles | real_estate | industrial_machinery | commercial_inventory | ...
  asset_type text,
  starting_bid_kobo bigint not null check (starting_bid_kobo >= 0),
  reserve_price_kobo bigint check (reserve_price_kobo >= 0),
  bid_increment_kobo bigint not null,
  current_bid_kobo bigint,
  highest_bidder_id uuid references bidders(id),
  status lot_status not null default 'draft',
  vat_applicable boolean not null default true,
  condition_notes text,
  location text,
  auction_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (auction_id, lot_number)
);

create index idx_lots_auction_id on lots(auction_id);
create index idx_lots_status on lots(status);

create table lot_media (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id) on delete cascade,
  media_type text not null, -- photo | video
  storage_path text not null,
  sort_order integer not null default 0
);

create table lot_documents (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id) on delete cascade,
  document_type text not null,
  storage_path text not null
);

create table lot_inspections (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id) on delete cascade,
  inspector_notes text,
  inspected_at timestamptz,
  created_by uuid references profiles(id)
);

-- ---------------------------------------------------------------------------
-- BIDDING ENGINE — server/database-authoritative
-- ---------------------------------------------------------------------------
create type bid_source as enum ('online','floor','clerk','admin');
create type bid_result as enum ('accepted','rejected');

-- Accepted bids are immutable (enforced by trigger below). Corrections must
-- go through a compensating event, never an UPDATE/DELETE on an accepted bid.
create table bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id),
  lot_id uuid not null references lots(id),
  bidder_id uuid references bidders(id), -- null allowed for rejected/malformed attempts prior to resolution
  paddle_id uuid references paddles(id),
  amount_kobo bigint not null check (amount_kobo >= 0),
  source bid_source not null,
  result bid_result not null,
  rejection_reason text,
  sequence_number bigint not null, -- monotonic per-lot ordering, assigned by DB function
  created_by uuid references profiles(id), -- operator/clerk who entered it, if applicable
  server_created_at timestamptz not null default now()
);

create index idx_bids_lot_id on bids(lot_id);
create index idx_bids_lot_sequence on bids(lot_id, sequence_number);

create sequence bid_sequence_seq;

-- Per-lot monotonic sequence numbers, assigned atomically at insert time.
create or replace function assign_bid_sequence()
returns trigger language plpgsql as $$
begin
  new.sequence_number := nextval('bid_sequence_seq');
  new.server_created_at := now();
  return new;
end;
$$;

create trigger trg_bids_assign_sequence before insert on bids
  for each row execute function assign_bid_sequence();

-- Immutability guard: block UPDATE/DELETE on accepted bids entirely.
-- Corrections must be modeled as new compensating bid_events, not mutation.
create or replace function prevent_accepted_bid_mutation()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'DELETE' and old.result = 'accepted' then
    raise exception 'Accepted bids are immutable and cannot be deleted (bid %)', old.id;
  end if;
  if TG_OP = 'UPDATE' and old.result = 'accepted' then
    raise exception 'Accepted bids are immutable and cannot be updated (bid %)', old.id;
  end if;
  return old;
end;
$$;

create trigger trg_bids_prevent_mutation before update or delete on bids
  for each row execute function prevent_accepted_bid_mutation();

-- Audit/compensating events layered on top of bids (corrections, cancellations)
create table bid_events (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid references bids(id),
  event_type text not null, -- e.g. 'correction', 'void', 'note'
  metadata jsonb not null default '{}',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- General auction-level realtime events (lot start/pause/sold, announcements)
create table auction_events (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references auctions(id),
  lot_id uuid references lots(id),
  event_type text not null, -- LOT_STARTED | LOT_PAUSED | LOT_SOLD | ANNOUNCEMENT | ...
  payload jsonb not null default '{}',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_auction_events_auction_id on auction_events(auction_id, created_at);

-- Single authoritative "current state" row per lot — what the live room reads.
-- Written only by server-side bidding/lot-closing functions, never by clients.
create table live_auction_state (
  lot_id uuid primary key references lots(id) on delete cascade,
  auction_id uuid not null references auctions(id),
  is_open_for_bids boolean not null default false,
  current_bid_kobo bigint,
  next_min_bid_kobo bigint,
  highest_bidder_id uuid references bidders(id),
  ends_at timestamptz, -- server-authoritative countdown target; browser only renders it
  updated_at timestamptz not null default now()
);

alter table auctions enable row level security;
alter table auction_staff enable row level security;
alter table lots enable row level security;
alter table lot_media enable row level security;
alter table lot_documents enable row level security;
alter table lot_inspections enable row level security;
alter table bids enable row level security;
alter table bid_events enable row level security;
alter table auction_events enable row level security;
alter table live_auction_state enable row level security;

-- Public can read auctions that have left draft/pending_review; staff sees all
create policy "auctions_public_or_staff_select" on auctions for select
  using (status not in ('draft','pending_review') or is_staff());
create policy "auctions_staff_write" on auctions for all
  using (has_role('super_admin') or has_role('admin') or has_role('auction_manager'))
  with check (has_role('super_admin') or has_role('admin') or has_role('auction_manager'));

create policy "lots_public_or_staff_select" on lots for select
  using (
    status in ('scheduled','active','sold','unsold','passed') or is_staff()
    or exists (select 1 from partners p where p.id = lots.partner_id and p.user_id = auth.uid())
  );
create policy "lots_staff_write" on lots for all
  using (is_staff())
  with check (is_staff());

-- Bids: bidders see their own bids + all *accepted* bids for lots they can view (public bid history);
-- staff/clerk see everything for lots they operate.
create policy "bids_select" on bids for select
  using (
    result = 'accepted'
    or is_staff()
    or exists (select 1 from bidders bd where bd.id = bids.bidder_id and bd.user_id = auth.uid())
  );
-- No direct client INSERT policy: all bid placement goes through server-side
-- service-role functions (src/lib/bidding) after full eligibility validation.

create policy "live_auction_state_public_select" on live_auction_state for select
  using (true);

create policy "auction_events_public_select" on auction_events for select
  using (true);

comment on table bids is 'Immutable once accepted. All inserts must go through the server-side placeBid() service — never insert directly from client code.';
comment on table live_auction_state is 'The ONE authoritative source the live auction room reads. Written only by server-side bid-acceptance / lot-closing logic and broadcast via Supabase Realtime.';
