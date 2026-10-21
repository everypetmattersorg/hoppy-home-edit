-- Consult requests from the Hoppy Home Edit website.
-- Lives in the confluence-creative-co Supabase project, prefixed so it stays separate.
-- Already applied (Oct 2026). Kept here as a record; safe to re-run on a fresh project.

create table if not exists public.hoppy_consult_requests (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 200),
  email       text not null check (char_length(email) between 3 and 320 and email like '%@%'),
  phone       text check (phone is null or char_length(phone) <= 40),
  city        text check (city is null or char_length(city) <= 120),
  services    text[] not null default '{}'
              check (services <@ array['organize','sell','thrift','not sure']::text[]),
  message     text not null check (char_length(message) between 1 and 5000),
  page        text check (page is null or char_length(page) <= 200),
  status      text not null default 'new' check (status in ('new','contacted','booked','closed'))
);

alter table public.hoppy_consult_requests enable row level security;

-- Visitors (anon) may submit requests, but can never read, edit, or delete them.
drop policy if exists "anyone can submit a consult request" on public.hoppy_consult_requests;
create policy "anyone can submit a consult request"
  on public.hoppy_consult_requests
  for insert
  to anon
  with check (status = 'new');

grant insert on public.hoppy_consult_requests to anon;
-- Supabase gives new public tables broad default privileges; keep insert only.
revoke select, update, delete, truncate, references, trigger on public.hoppy_consult_requests from anon, authenticated;
