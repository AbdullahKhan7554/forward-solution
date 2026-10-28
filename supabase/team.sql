-- Forward Solution — admin team: profiles, roles, activity log.
-- Run in the Supabase SQL editor after schema.sql. Safe to re-run.

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  email         text,
  role          text not null default 'editor' check (role in ('admin', 'editor')),
  last_seen_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- New auth users get an editor profile; the invite action sets the chosen role.
-- (Role is never taken from user metadata, so a self sign-up can't become admin.)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    case when lower(new.email) = 'info@agriprompakistan.com' then 'admin' else 'editor' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that existed before this script.
insert into public.profiles (id, full_name, email)
select u.id, nullif(u.raw_user_meta_data ->> 'full_name', ''), u.email
from auth.users u
on conflict (id) do nothing;

update public.profiles set role = 'admin' where lower(email) = 'info@agriprompakistan.com';

-- ---------------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles (id) on delete set null,
  action       text not null check (action in ('created', 'updated', 'deleted', 'published', 'hidden', 'logged_in')),
  entity_type  text check (entity_type in ('product', 'blog', 'user')),
  entity_id    uuid,
  entity_name  text,
  created_at   timestamptz not null default now()
);

create index if not exists activity_log_created_idx on public.activity_log (created_at desc);
create index if not exists activity_log_user_idx on public.activity_log (user_id);

-- ---------------------------------------------------------------------------
-- RLS — signed-in users read; writes only via the service role (server actions)
-- ---------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "profiles_auth_read"     on public.profiles;
drop policy if exists "activity_log_auth_read" on public.activity_log;

create policy "profiles_auth_read" on public.profiles
  for select to authenticated using (true);
create policy "activity_log_auth_read" on public.activity_log
  for select to authenticated using (true);

-- Only admins may delete products and blogs.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "products_auth_delete" on public.products;
create policy "products_auth_delete" on public.products
  for delete to authenticated using (public.is_admin());

drop policy if exists "blogs_auth_delete" on public.blogs;
create policy "blogs_auth_delete" on public.blogs
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Realtime on activity_log
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'activity_log'
  ) then
    alter publication supabase_realtime add table public.activity_log;
  end if;
end;
$$;
