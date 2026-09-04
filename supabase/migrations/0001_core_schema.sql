-- Unicorn Auctions — Core Schema (Phase 1: Foundation)
-- Money columns are BIGINT storing KOBO (integer minor units, 100 kobo = ₦1)
-- per the financial-precision requirement. Never use FLOAT/REAL for money.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------------------------
create type app_role as enum (
  'super_admin', 'admin', 'auction_manager', 'auctioneer', 'clerk',
  'finance', 'kyc_officer', 'partner', 'broker', 'bidder', 'floor_bidder'
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index idx_user_roles_user_id on user_roles(user_id);

-- Helper: does the current user hold a given role? Used throughout RLS.
create or replace function has_role(_role app_role)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = _role
  );
$$;

create or replace function is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
      and role in ('super_admin','admin','auction_manager','auctioneer','clerk','finance','kyc_officer')
  );
$$;

-- ---------------------------------------------------------------------------
-- ORGANIZATIONS / PARTNERS / BROKERS
-- ---------------------------------------------------------------------------
create type partner_status as enum ('pending','under_review','approved','rejected','suspended');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  registration_number text,
  tin text,
  address text,
  created_at timestamptz not null default now()
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid references organizations(id),
  partner_type text not null, -- financial_institution | corporate_fleet | government_agency | liquidator | private_owner
  status partner_status not null default 'pending',
  msa_signed boolean not null default false,
  tin text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table partner_contacts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  full_name text not null,
  role_title text,
  email text,
  phone text
);

create type broker_status as enum ('pending','under_review','approved','rejected','suspended');

create table brokers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  referral_code text not null unique,
  status broker_status not null default 'pending',
  tin text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  commission_split_bp integer not null default 1500 check (commission_split_bp between 0 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table broker_referrals (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references brokers(id) on delete cascade,
  bidder_id uuid not null,
  created_at timestamptz not null default now(),
  unique (broker_id, bidder_id)
);

-- ---------------------------------------------------------------------------
-- BIDDERS / KYC / DEPOSITS / PADDLES
-- ---------------------------------------------------------------------------
create type bidder_state as enum (
  'pending','kyc_pending','kyc_approved','deposit_pending',
  'deposit_verified','bidding_enabled','suspended','rejected'
);

create table bidders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  state bidder_state not null default 'pending',
  referred_by_broker_id uuid references brokers(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table broker_referrals
  add constraint broker_referrals_bidder_fk foreign key (bidder_id) references bidders(id) on delete cascade;

create type kyc_status as enum ('pending','in_review','approved','rejected');

create table kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  bidder_id uuid references bidders(id) on delete cascade,
  partner_id uuid references partners(id) on delete cascade,
  broker_id uuid references brokers(id) on delete cascade,
  subject_type text not null, -- bidder | partner | broker
  status kyc_status not null default 'pending',
  identity_info jsonb not null default '{}',
  address_info jsonb not null default '{}',
  organization_info jsonb not null default '{}',
  tin text,
  review_notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (subject_type = 'bidder' and bidder_id is not null) or
    (subject_type = 'partner' and partner_id is not null) or
    (subject_type = 'broker' and broker_id is not null)
  )
);

create table kyc_documents (
  id uuid primary key default gen_random_uuid(),
  kyc_submission_id uuid not null references kyc_submissions(id) on delete cascade,
  document_type text not null,
  storage_path text not null, -- private Supabase Storage path; access via signed URL only
  uploaded_at timestamptz not null default now()
);

create type deposit_status as enum (
  'pending','awaiting_payment','paid','verified',
  'refunded','partially_applied','forfeited','failed'
);

create table bidder_deposits (
  id uuid primary key default gen_random_uuid(),
  bidder_id uuid not null references bidders(id) on delete cascade,
  auction_id uuid, -- fk added in 0002 after auctions exists
  amount_kobo bigint not null check (amount_kobo >= 0),
  status deposit_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table paddles (
  id uuid primary key default gen_random_uuid(),
  bidder_id uuid not null references bidders(id) on delete cascade,
  auction_id uuid, -- fk added in 0002
  paddle_number text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger trg_partners_updated_at before update on partners
  for each row execute function set_updated_at();
create trigger trg_brokers_updated_at before update on brokers
  for each row execute function set_updated_at();
create trigger trg_bidders_updated_at before update on bidders
  for each row execute function set_updated_at();
create trigger trg_bidder_deposits_updated_at before update on bidder_deposits
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — enable now; policies defined per-table
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table organizations enable row level security;
alter table partners enable row level security;
alter table partner_contacts enable row level security;
alter table brokers enable row level security;
alter table broker_referrals enable row level security;
alter table bidders enable row level security;
alter table kyc_submissions enable row level security;
alter table kyc_documents enable row level security;
alter table bidder_deposits enable row level security;
alter table paddles enable row level security;

-- profiles: user manages their own; staff can view all
create policy "profiles_self_select" on profiles for select
  using (id = auth.uid() or is_staff());
create policy "profiles_self_update" on profiles for update
  using (id = auth.uid());
create policy "profiles_self_insert" on profiles for insert
  with check (id = auth.uid());

-- user_roles: only staff (admin tier) can view/manage; users can see their own roles
create policy "user_roles_self_or_staff_select" on user_roles for select
  using (user_id = auth.uid() or has_role('super_admin') or has_role('admin'));
create policy "user_roles_admin_write" on user_roles for all
  using (has_role('super_admin') or has_role('admin'))
  with check (has_role('super_admin') or has_role('admin'));

-- partners: partner sees own org; staff sees all
create policy "partners_owner_or_staff_select" on partners for select
  using (user_id = auth.uid() or is_staff());
create policy "partners_owner_update" on partners for update
  using (user_id = auth.uid() or is_staff());
create policy "partners_staff_insert" on partners for insert
  with check (user_id = auth.uid() or is_staff());

create policy "partner_contacts_owner_or_staff" on partner_contacts for select
  using (
    exists (select 1 from partners p where p.id = partner_contacts.partner_id and (p.user_id = auth.uid() or is_staff()))
  );

-- brokers: broker sees own record; staff sees all
create policy "brokers_owner_or_staff_select" on brokers for select
  using (user_id = auth.uid() or is_staff());
create policy "brokers_owner_update" on brokers for update
  using (user_id = auth.uid() or is_staff());

create policy "broker_referrals_owner_or_staff" on broker_referrals for select
  using (
    exists (select 1 from brokers b where b.id = broker_referrals.broker_id and (b.user_id = auth.uid() or is_staff()))
  );

-- bidders: bidder sees own record; staff sees all
create policy "bidders_owner_or_staff_select" on bidders for select
  using (user_id = auth.uid() or is_staff());
create policy "bidders_owner_update" on bidders for update
  using (user_id = auth.uid());

-- kyc: subject owner or staff (kyc_officer/admin) only — sensitive
create policy "kyc_submissions_owner_or_staff" on kyc_submissions for select
  using (
    is_staff() or
    exists (select 1 from bidders bd where bd.id = kyc_submissions.bidder_id and bd.user_id = auth.uid()) or
    exists (select 1 from partners p where p.id = kyc_submissions.partner_id and p.user_id = auth.uid()) or
    exists (select 1 from brokers br where br.id = kyc_submissions.broker_id and br.user_id = auth.uid())
  );
create policy "kyc_documents_owner_or_staff" on kyc_documents for select
  using (
    is_staff() or
    exists (
      select 1 from kyc_submissions k
      left join bidders bd on bd.id = k.bidder_id
      left join partners p on p.id = k.partner_id
      left join brokers br on br.id = k.broker_id
      where k.id = kyc_documents.kyc_submission_id
        and (bd.user_id = auth.uid() or p.user_id = auth.uid() or br.user_id = auth.uid())
    )
  );

-- deposits: bidder sees own; finance/admin can manage
create policy "deposits_owner_or_finance_select" on bidder_deposits for select
  using (
    exists (select 1 from bidders bd where bd.id = bidder_deposits.bidder_id and bd.user_id = auth.uid())
    or has_role('finance') or has_role('admin') or has_role('super_admin')
  );

-- paddles: bidder sees own; staff manage
create policy "paddles_owner_or_staff_select" on paddles for select
  using (
    exists (select 1 from bidders bd where bd.id = paddles.bidder_id and bd.user_id = auth.uid())
    or is_staff()
  );

comment on table bidder_deposits is 'Refundable cautionary deposits gating bidding eligibility. Never trust a boolean depositPaid flag — this table + payments/payment_transactions is the source of truth.';
comment on column bidder_deposits.amount_kobo is 'Integer minor units (kobo). 100 kobo = NGN 1.';
