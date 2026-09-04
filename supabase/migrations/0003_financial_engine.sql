-- Unicorn Auctions — Payments, Invoicing, Settlements, Ledger, Tax, Gate Pass, Audit

create type payment_status as enum ('pending','processing','success','failed','reversed');
create type payment_channel as enum ('paystack','bank_transfer');

create table payments (
  id uuid primary key default gen_random_uuid(),
  payer_id uuid not null references profiles(id),
  purpose text not null, -- deposit | registration_fee | catalog_fee | settlement | other
  related_deposit_id uuid references bidder_deposits(id),
  amount_kobo bigint not null check (amount_kobo >= 0),
  channel payment_channel not null,
  status payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete cascade,
  provider text not null, -- paystack | bank
  provider_reference text not null,
  raw_response jsonb,
  status payment_status not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

-- Idempotent webhook ledger: every inbound Paystack webhook is recorded by
-- its event id before being processed, so retries/duplicates never double-apply.
create table payment_webhooks (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'paystack',
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_id)
);

create table bank_transfer_receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete cascade,
  bank_name text,
  account_reference text,
  amount_kobo bigint not null,
  receipt_storage_path text,
  status text not null default 'submitted', -- submitted | verified | rejected
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TAX RULES (configurable — see Fee/Tax Architecture)
-- ---------------------------------------------------------------------------
create table tax_rules (
  id uuid primary key default gen_random_uuid(),
  scope text not null, -- platform | auction | lot | partner | category
  scope_id uuid, -- null for platform-wide
  tax_type text not null, -- vat | wht | emtl | stamp_duty
  rate_bp integer not null check (rate_bp between 0 and 10000),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_at timestamptz not null default now()
);

create index idx_tax_rules_scope on tax_rules(scope, scope_id, tax_type);

create table tax_entries (
  id uuid primary key default gen_random_uuid(),
  tax_type text not null,
  amount_kobo bigint not null,
  related_invoice_id uuid,
  related_settlement_id uuid,
  related_broker_payout_id uuid,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- INVOICES / SETTLEMENTS / PAYOUTS
-- ---------------------------------------------------------------------------
create type invoice_status as enum ('draft','issued','partially_paid','paid','overdue','cancelled');

create table invoices (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id),
  bidder_id uuid not null references bidders(id),
  hammer_price_kobo bigint not null,
  buyer_premium_kobo bigint not null default 0,
  asset_vat_kobo bigint not null default 0,
  premium_vat_kobo bigint not null default 0,
  total_kobo bigint not null,
  amount_paid_kobo bigint not null default 0,
  status invoice_status not null default 'draft',
  payment_deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  amount_kobo bigint not null,
  line_type text not null -- hammer_price | buyer_premium | asset_vat | premium_vat | fee
);

create type settlement_status as enum (
  'pending','partially_paid','paid','verified','awaiting_release','released','disputed','cancelled'
);

create table settlements (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id),
  partner_id uuid not null references partners(id),
  hammer_price_kobo bigint not null,
  seller_commission_kobo bigint not null default 0,
  seller_commission_vat_kobo bigint not null default 0,
  net_settlement_kobo bigint not null,
  status settlement_status not null default 'pending',
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table settlement_items (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references settlements(id) on delete cascade,
  description text not null,
  amount_kobo bigint not null,
  line_type text not null
);

create table broker_commissions (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references brokers(id),
  lot_id uuid not null references lots(id),
  gross_commission_kobo bigint not null,
  wht_kobo bigint not null default 0,
  net_payout_kobo bigint not null,
  status text not null default 'pending', -- pending | paid
  created_at timestamptz not null default now()
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  payee_type text not null, -- partner | broker
  partner_settlement_id uuid references settlements(id),
  broker_commission_id uuid references broker_commissions(id),
  amount_kobo bigint not null,
  status text not null default 'pending', -- pending | processing | paid | failed
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- IMMUTABLE FINANCIAL LEDGER — never update/delete, only insert + adjustments
-- ---------------------------------------------------------------------------
create table financial_ledger (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null, -- debit | credit
  source text not null,     -- invoice | settlement | payout | deposit | adjustment
  amount_kobo bigint not null,
  currency text not null default 'NGN',
  reference text,
  auction_id uuid references auctions(id),
  lot_id uuid references lots(id),
  bidder_id uuid references bidders(id),
  partner_id uuid references partners(id),
  broker_id uuid references brokers(id),
  tax_category text,
  created_at timestamptz not null default now()
);

create or replace function prevent_ledger_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'financial_ledger is append-only; use an adjustment entry instead of % on row %', TG_OP, old.id;
  return old;
end;
$$;

create trigger trg_ledger_prevent_mutation before update or delete on financial_ledger
  for each row execute function prevent_ledger_mutation();

-- ---------------------------------------------------------------------------
-- GATE PASS
-- ---------------------------------------------------------------------------
create table gate_passes (
  id uuid primary key default gen_random_uuid(),
  gate_pass_number text not null unique,
  verification_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  lot_id uuid not null references lots(id),
  bidder_id uuid not null references bidders(id),
  issue_date timestamptz not null default now(),
  expiry_date timestamptz,
  status text not null default 'issued', -- issued | verified | expired | revoked
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS / WATCHLISTS
-- ---------------------------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lot_id uuid not null references lots(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lot_id)
);

-- ---------------------------------------------------------------------------
-- AUDIT LOG
-- ---------------------------------------------------------------------------
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor on audit_logs(actor_id, created_at);

create or replace function prevent_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_logs is append-only';
  return old;
end;
$$;

create trigger trg_audit_prevent_mutation before update or delete on audit_logs
  for each row execute function prevent_audit_mutation();

-- ---------------------------------------------------------------------------
-- SETTINGS (platform-level configurable defaults)
-- ---------------------------------------------------------------------------
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table payments enable row level security;
alter table payment_transactions enable row level security;
alter table payment_webhooks enable row level security;
alter table bank_transfer_receipts enable row level security;
alter table tax_rules enable row level security;
alter table tax_entries enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table settlements enable row level security;
alter table settlement_items enable row level security;
alter table broker_commissions enable row level security;
alter table payouts enable row level security;
alter table financial_ledger enable row level security;
alter table gate_passes enable row level security;
alter table notifications enable row level security;
alter table watchlists enable row level security;
alter table audit_logs enable row level security;
alter table settings enable row level security;

create policy "payments_owner_or_finance_select" on payments for select
  using (payer_id = auth.uid() or has_role('finance') or has_role('admin') or has_role('super_admin'));

create policy "invoices_owner_or_staff_select" on invoices for select
  using (
    exists (select 1 from bidders bd where bd.id = invoices.bidder_id and bd.user_id = auth.uid())
    or is_staff()
  );

create policy "settlements_partner_or_finance_select" on settlements for select
  using (
    exists (select 1 from partners p where p.id = settlements.partner_id and p.user_id = auth.uid())
    or has_role('finance') or has_role('admin') or has_role('super_admin')
  );

create policy "broker_commissions_owner_or_finance_select" on broker_commissions for select
  using (
    exists (select 1 from brokers b where b.id = broker_commissions.broker_id and b.user_id = auth.uid())
    or has_role('finance') or has_role('admin') or has_role('super_admin')
  );

create policy "gate_passes_owner_or_staff_select" on gate_passes for select
  using (
    exists (select 1 from bidders bd where bd.id = gate_passes.bidder_id and bd.user_id = auth.uid())
    or is_staff()
  );

create policy "notifications_owner_select" on notifications for select
  using (user_id = auth.uid());
create policy "notifications_owner_update" on notifications for update
  using (user_id = auth.uid());

create policy "watchlists_owner_all" on watchlists for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "audit_logs_staff_select" on audit_logs for select
  using (has_role('super_admin') or has_role('admin'));

create policy "financial_ledger_finance_select" on financial_ledger for select
  using (has_role('finance') or has_role('admin') or has_role('super_admin'));

comment on table financial_ledger is 'Append-only. Corrections must be new adjustment entries, never UPDATE/DELETE — enforced by trigger.';
comment on table audit_logs is 'Append-only. Every financially/operationally significant action must write here — see AUDIT_FIRST principle in project docs.';
