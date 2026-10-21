-- Consult requests from the Hoppy Home Edit website.
-- Run once in Supabase: SQL Editor → New query → paste → Run.

create table if not exists public.consult_requests (
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

alter table public.consult_requests enable row level security;

-- Visitors (anon) may submit requests, but can never read, edit, or delete them.
drop policy if exists "anyone can submit a consult request" on public.consult_requests;
create policy "anyone can submit a consult request"
  on public.consult_requests
  for insert
  to anon
  with check (status = 'new');

grant insert (name, email, phone, city, services, message, page) on public.consult_requests to anon;
revoke select, update, delete on public.consult_requests from anon;
