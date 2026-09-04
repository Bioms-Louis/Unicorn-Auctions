-- Unicorn Auctions — Split profiles.full_name into first_name / last_name
--
-- Written as an additive migration (rather than editing 0001) since 0001
-- may already be applied against a live project. Safe to run even if some
-- profiles rows already exist: it backfills first_name/last_name from the
-- existing full_name column on a best-effort basis before dropping it.

alter table profiles
  add column if not exists first_name text,
  add column if not exists last_name text;

-- Best-effort backfill for any pre-existing rows: first word -> first_name,
-- remainder -> last_name. Single-word names leave last_name null rather
-- than failing the migration.
update profiles
set
  first_name = coalesce(nullif(split_part(full_name, ' ', 1), ''), full_name),
  last_name = nullif(trim(substring(full_name from position(' ' in full_name) + 1)), '')
where first_name is null and full_name is not null;

alter table profiles
  alter column first_name set not null;

alter table profiles
  drop column if exists full_name;

comment on column profiles.first_name is 'Required. Collected at registration.';
comment on column profiles.last_name is 'Collected at registration; nullable at the DB level for legacy/edge-case single-word names, but required by the registration form.';
