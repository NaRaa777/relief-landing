-- waitlist_survey: matches what app/api/survey/route.ts inserts.
-- Safe to re-run. Paste into the Supabase SQL Editor and click Run.
--
-- The code sends exactly these fields (lib/waitlist.ts -> sanitizeSurvey):
--   email            text     from the encrypted signup cookie (link to waitlist)
--   pain_level       text     'barely' | 'mild' | 'moderate' | 'strong' | 'ruins_my_day' | null
--   current_methods  text[]   any of 'painkillers', 'heating_pad', 'tracker_app',
--                             'rest_cancel_plans', 'nothing', 'other' (can be empty)
--   would_pay        text     'yes' | 'maybe' | 'no' | null
--   completed        boolean  true = finished survey, false = partial save

-- 1. Table and columns --------------------------------------------------------

create table if not exists public.waitlist_survey (
  id          bigint generated always as identity primary key,
  email       text not null,
  created_at  timestamptz not null default now()
);

alter table public.waitlist_survey
  add column if not exists email           text,
  add column if not exists pain_level      text,
  add column if not exists current_methods text[] not null default '{}',
  add column if not exists would_pay       text,
  add column if not exists completed       boolean not null default false,
  add column if not exists created_at      timestamptz not null default now();

-- 2. Constraints, including the link to the waitlist signup -------------------

do $$
begin
  if not exists (select 1 from public.waitlist_survey where email is null) then
    alter table public.waitlist_survey alter column email set not null;
  end if;

  -- The foreign key needs waitlist.email to be unique.
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.waitlist'::regclass and conname = 'waitlist_email_unique'
  ) then
    alter table public.waitlist add constraint waitlist_email_unique unique (email);
  end if;

  -- Each answer belongs to a waitlist signup. Deleting a signup deletes its
  -- answers too. NOT VALID: older rows are not checked, new rows are.
  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_email_fkey') then
    alter table public.waitlist_survey
      add constraint waitlist_survey_email_fkey
      foreign key (email) references public.waitlist (email) on delete cascade
      not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_pain_level_check') then
    alter table public.waitlist_survey add constraint waitlist_survey_pain_level_check
      check (pain_level in ('barely', 'mild', 'moderate', 'strong', 'ruins_my_day')) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_would_pay_check') then
    alter table public.waitlist_survey add constraint waitlist_survey_would_pay_check
      check (would_pay in ('yes', 'maybe', 'no')) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'waitlist_survey_current_methods_check') then
    alter table public.waitlist_survey add constraint waitlist_survey_current_methods_check
      check (current_methods <@ array['painkillers', 'heating_pad', 'tracker_app',
                                      'rest_cancel_plans', 'nothing', 'other']::text[]) not valid;
  end if;
end $$;

create index if not exists waitlist_survey_email_idx on public.waitlist_survey (email);

-- 3. Row Level Security: anon can insert, nothing else -------------------------

alter table public.waitlist_survey enable row level security;

-- Remove every existing policy on this table so no select/update/delete
-- policy survives, then add the single insert policy.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'waitlist_survey'
  loop
    execute format('drop policy %I on public.waitlist_survey', p.policyname);
  end loop;
end $$;

create policy "anon can insert into waitlist_survey"
  on public.waitlist_survey for insert to anon with check (true);

revoke all on table public.waitlist_survey from anon;
grant insert on table public.waitlist_survey to anon;

-- 4. Make the API see the new columns right away -------------------------------
-- (fixes "Could not find the 'completed' column ... in the schema cache")

notify pgrst, 'reload schema';
