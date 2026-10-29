-- Forward Solution — security hardening (audit fixes).
-- Run in the Supabase SQL editor after schema.sql and team.sql. Safe to re-run.

-- ---------------------------------------------------------------------------
-- Storage: "media" bucket — public read, authenticated upload, admin-only update/delete
-- ---------------------------------------------------------------------------
update storage.buckets
set file_size_limit = 2097152, -- 2 MB
    allowed_mime_types = array['image/webp', 'image/png', 'image/jpeg']
where id = 'media';

drop policy if exists "media_auth_update" on storage.objects;
drop policy if exists "media_auth_delete" on storage.objects;
drop policy if exists "media_admin_update" on storage.objects;
drop policy if exists "media_admin_delete" on storage.objects;

create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- handle_new_user is a trigger function only — not callable over the REST API
-- ---------------------------------------------------------------------------
revoke execute on function public.handle_new_user() from public, anon, authenticated;
