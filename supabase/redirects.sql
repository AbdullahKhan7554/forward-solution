-- Forward Solution — old-URL redirects.
-- When a blog slug or a product's category/slug changes in the admin, the old public path is
-- saved here and the middleware 301s it to the new one.
-- Run in the Supabase SQL editor after schema.sql and team.sql. Safe to re-run.

create table if not exists public.redirects (
  old_path   text primary key check (old_path like '/%'),
  new_path   text not null check (new_path like '/%' and new_path <> old_path),
  created_at timestamptz not null default now()
);

alter table public.redirects enable row level security;

-- public reads (the middleware uses the anon key); signed-in users write.
drop policy if exists "redirects_public_read" on public.redirects;
drop policy if exists "redirects_auth_read"   on public.redirects;
drop policy if exists "redirects_auth_insert" on public.redirects;
drop policy if exists "redirects_auth_update" on public.redirects;
drop policy if exists "redirects_auth_delete" on public.redirects;

create policy "redirects_public_read" on public.redirects
  for select to anon using (true);
create policy "redirects_auth_read" on public.redirects
  for select to authenticated using (true);
create policy "redirects_auth_insert" on public.redirects
  for insert to authenticated with check (true);
create policy "redirects_auth_update" on public.redirects
  for update to authenticated using (true) with check (true);
create policy "redirects_auth_delete" on public.redirects
  for delete to authenticated using (true);
