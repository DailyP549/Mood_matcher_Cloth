-- OutfitWise app_state table
-- Run this in: Supabase Dashboard > SQL Editor > New query  > Run

create table if not exists public.app_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb
);

insert into public.app_state (key, value) values
  ('items', '[]'::jsonb),
  ('favorites', '[]'::jsonb),
  ('plans', '{}'::jsonb)
on conflict (key) do nothing;

alter table public.app_state enable row level security;

drop policy if exists "app_state_select" on public.app_state;
create policy "app_state_select" on public.app_state for select using (true);

drop policy if exists "app_state_insert" on public.app_state;
create policy "app_state_insert" on public.app_state for insert with check (true);

drop policy if exists "app_state_update" on public.app_state;
create policy "app_state_update" on public.app_state for update using (true) with check (true);
