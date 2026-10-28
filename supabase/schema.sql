-- Forward Solution — products & blogs content schema.
-- Run once in the Supabase SQL editor. Safe to re-run.

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- products
--   data jsonb holds every remaining ProductDetailData field:
--   eyebrow, intro, overviewLead, overviewPoints, benefits, flow, applications,
--   specs, metaTitle, metaDescription, media, gallery, overviewImageLabel,
--   related, cta, assets, downloads
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  section     text not null check (section in ('poultry', 'ruminants')),
  category    text not null,
  name        text not null,
  subtitle    text,
  image_url   text,
  is_live     boolean not null default true,
  sort_order  integer not null default 0,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create index if not exists products_section_sort_idx on public.products (section, sort_order);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- blogs
--   data jsonb holds the remaining Article fields:
--   filter, author, date, readingTime, href, intro, sections, takeaways
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  category      text not null,
  excerpt       text,
  cover_url     text,
  content       text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  data          jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

create index if not exists blogs_status_published_idx on public.blogs (status, published_at desc);

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;
alter table public.blogs    enable row level security;

-- products: public reads live rows; signed-in users read all and write.
drop policy if exists "products_public_read"  on public.products;
drop policy if exists "products_auth_read"    on public.products;
drop policy if exists "products_auth_insert"  on public.products;
drop policy if exists "products_auth_update"  on public.products;
drop policy if exists "products_auth_delete"  on public.products;

create policy "products_public_read" on public.products
  for select to anon using (is_live);
create policy "products_auth_read" on public.products
  for select to authenticated using (true);
create policy "products_auth_insert" on public.products
  for insert to authenticated with check (true);
create policy "products_auth_update" on public.products
  for update to authenticated using (true) with check (true);
create policy "products_auth_delete" on public.products
  for delete to authenticated using (true);

-- blogs: public reads published rows; signed-in users read all and write.
drop policy if exists "blogs_public_read"  on public.blogs;
drop policy if exists "blogs_auth_read"    on public.blogs;
drop policy if exists "blogs_auth_insert"  on public.blogs;
drop policy if exists "blogs_auth_update"  on public.blogs;
drop policy if exists "blogs_auth_delete"  on public.blogs;

create policy "blogs_public_read" on public.blogs
  for select to anon using (status = 'published');
create policy "blogs_auth_read" on public.blogs
  for select to authenticated using (true);
create policy "blogs_auth_insert" on public.blogs
  for insert to authenticated with check (true);
create policy "blogs_auth_update" on public.blogs
  for update to authenticated using (true) with check (true);
create policy "blogs_auth_delete" on public.blogs
  for delete to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Storage: "media" bucket — public read, authenticated write
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read"  on storage.objects;
drop policy if exists "media_auth_insert"  on storage.objects;
drop policy if exists "media_auth_update"  on storage.objects;
drop policy if exists "media_auth_delete"  on storage.objects;

create policy "media_public_read" on storage.objects
  for select to public using (bucket_id = 'media');
create policy "media_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "media_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "media_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
