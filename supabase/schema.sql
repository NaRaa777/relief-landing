-- Relief waitlist schema. Paste into the Supabase SQL Editor and run.
-- Safe to run more than once: it creates what's missing, adds missing
-- columns to tables that already exist, and resets the RLS policies.
-- The public (anon) key can only INSERT. It cannot read, update or delete
-- rows; read your data in the Supabase dashboard (Table Editor).
--
-- Columns match the inserts in:
--   app/api/waitlist/route.ts  -> waitlist
--   app/api/survey/route.ts    -> waitlist_survey
--   app/api/events/route.ts    -> events
-- (all via insertRow() in lib/supabase.ts; field names from lib/waitlist.ts)

-- 1. Tables ---------------------------------------------------------------

create table if not exists public.waitlist (
  id          bigint generated always as identity primary key,
  email       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.waitlist_survey (
  id          bigint generated always as identity primary key,
  email       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.events (
  id          bigint generated always as identity primary key,
  name        text not null,
  created_at  timestamptz not null default now()
);

-- 2. Columns (added if missing, so older tables catch up) ------------------

-- waitlist: { email, source, utm_*, referrer, landing_path }
alter table public.waitlist
  add column if not exists email        text,
  add column if not exists source       text,
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content  text,
  add column if not exists utm_term     text,
  add column if not exists referrer     text,
  add column if not exists landing_path text,
  add column if not exists created_at   timestamptz not null default now();

-- waitlist_survey: { email, pain_level, current_methods, would_pay, completed }
-- email comes from the encrypted signup cookie, never from the browser.
-- completed = false marks a partial save (visitor left /welcome mid-way).
alter table public.waitlist_survey
  add column if not exists email           text,
  add column if not exists pain_level      text,
  add column if not exists current_methods text[] not null default '{}',
  add column if not exists would_pay       text,
  add column if not exists completed       boolean not null default false,
  add column if not exists created_at      timestamptz not null default now();

-- events: { name, session_id, path, props, utm_*, referrer, landing_path }
alter table public.events
  add column if not exists name         text,
  add column if not exists session_id   text,
  add column if not exists path         text,
  add column if not exists props        jsonb not null default '{}',
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content  text,
  add column if not exists utm_term     text,
  add column if not exists referrer     text,
  add column if not exists landing_path text,
  add column if not exists created_at   timestamptz not null default now();

-- 3. Constraints (added only if missing) -----------------------------------

do $$
begin
  -- Unique email on the waitlist. The API relies on the 23505 error from
  -- this constraint to answer "already joined".
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.waitlist'::regclass and conname = 'waitlist_email_unique'
  ) then
    if exists (
      select email from public.waitlist group by email having count(*) > 1
    ) then
      raise exception 'public.waitlist has duplicate emails. Remove the duplicates, then run this script again.';
    end if;
    alter table public.waitlist add constraint waitlist_email_unique unique (email);
  end if;

  -- NOT NULL where the code always sends a value (skipped if old rows have nulls).
  if not exists (select 1 from public.waitlist where email is null) then
    alter table public.waitlist alter column email set not null;
  end if;
  if not exists (select 1 from public.waitlist_survey where email is null) then
    alter table public.waitlist_survey alter column email set not null;
  end if;
  if not exists (select 1 from public.events where name is null) then
    alter table public.events alter column name set not null;
  end if;

  -- Allowed values, matching lib/waitlist.ts. NOT VALID = checked on new
  -- rows only, so existing rows never block the script.
  if not exists (select 1 from pg_constraint where conname = 'waitlist_email_format') then
    alter table public.waitlist add constraint waitlist_email_format
      check (email = lower(email) and length(email) <= 254) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'waitlist_source_check') then
    alter table public.waitlist add constraint waitlist_source_check
      check (source is null or source in ('hero', 'final_cta')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_pain_level_check') then
    alter table public.waitlist_survey add constraint waitlist_survey_pain_level_check
      check (pain_level in ('barely', 'mild', 'moderate', 'strong', 'ruins_my_day')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_would_pay_check') then
    alter table public.waitlist_survey add constraint waitlist_survey_would_pay_check
      check (would_pay in ('yes', 'maybe', 'no')) not valid;
  end if;
end $$;

-- Event names, matching EVENT_NAMES in lib/waitlist.ts. Dropped and re-added
-- every run so the list stays current when new events are added.
alter table public.events drop constraint if exists events_name_check;
alter table public.events add constraint events_name_check
  check (name in (
    'page_view', 'form_focus', 'signup_submitted',
    'welcome_viewed', 'survey_step_completed', 'survey_skipped',
    'survey_completed', 'share_clicked'
  )) not valid;

create index if not exists waitlist_survey_email_idx on public.waitlist_survey (email);
create index if not exists events_name_created_idx on public.events (name, created_at);

-- 4. Row Level Security: insert-only for anon -------------------------------

alter table public.waitlist        enable row level security;
alter table public.waitlist_survey enable row level security;
alter table public.events          enable row level security;

-- Remove every existing policy on these tables, so no older select, update
-- or delete policy survives. Only the three insert policies below remain.
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('waitlist', 'waitlist_survey', 'events')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

create policy "anon can insert into waitlist"
  on public.waitlist for insert to anon with check (true);

create policy "anon can insert into waitlist_survey"
  on public.waitlist_survey for insert to anon with check (true);

create policy "anon can insert into events"
  on public.events for insert to anon with check (true);

-- Table privileges to match: anon may insert, nothing else.
revoke all on table public.waitlist, public.waitlist_survey, public.events from anon;
grant insert on table public.waitlist, public.waitlist_survey, public.events to anon;

-- 5. Views for reading results in the dashboard (not reachable by anon) ----

create or replace view public.waitlist_with_survey
with (security_invoker = true) as
select
  w.email,
  w.created_at as signed_up_at,
  w.source,
  w.utm_source,
  w.utm_campaign,
  s.pain_level,
  s.current_methods,
  s.would_pay
from public.waitlist w
left join lateral (
  -- Prefer the finished survey over a partial save, then the latest.
  select * from public.waitlist_survey ws
  where ws.email = w.email
  order by ws.completed desc, ws.created_at desc
  limit 1
) s on true;

-- Dropped first: Postgres can't add columns to the middle of an existing view.
drop view if exists public.funnel_daily;
create view public.funnel_daily
with (security_invoker = true) as
select
  date_trunc('day', created_at)::date as day,
  coalesce(utm_source, '(none)') as utm_source,
  count(distinct session_id) filter (where name = 'page_view')        as visitors,
  count(distinct session_id) filter (where name = 'form_focus')       as focused_form,
  count(distinct session_id) filter (where name = 'signup_submitted') as signed_up,
  count(distinct session_id) filter (where name = 'welcome_viewed')   as saw_welcome,
  count(distinct session_id) filter (where name = 'survey_completed') as answered_survey,
  count(distinct session_id) filter (where name = 'share_clicked')    as shared
from public.events
group by 1, 2
order by 1 desc, 2;

revoke all on public.waitlist_with_survey, public.funnel_daily from anon, authenticated;
