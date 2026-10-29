"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, logActivity } from "@/lib/admin/session";
import { CONFLICT, LIMITS, tooLong } from "@/lib/admin/limits";
import { removeOrphanedMedia } from "@/lib/admin/storage";
import type { FilterCategory } from "@/components/info-center/types";
import { FILTERS, formToBlogColumns, formToBlogData, slugify, type BlogFormValues, type BlogStatus } from "@/lib/admin/blogs";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const SIGNED_OUT = "Your session has expired. Please log in again.";
const ADMINS_ONLY = "Only admins can delete blogs.";
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Public pages that render a post: home (latest posts), blog listing, the post page, search and sitemap. */
function revalidateBlog(...slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/search");
  revalidatePath("/sitemap.xml");
  new Set(slugs).forEach((s) => revalidatePath(`/blog/${s}`));
  revalidatePath("/admin/blogs", "layout");
}

/** `updatedAt` is the row's updated_at when the form was loaded; a newer row means someone else saved meanwhile. */
export async function saveBlog(
  id: string | null,
  form: BlogFormValues,
  status: BlogStatus,
  updatedAt: string | null,
): Promise<Result<{ id: string; slug: string }>> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SIGNED_OUT };
  const { supabase, me } = session;

  const title = form.title.trim();
  const category = form.category.trim();
  const slug = slugify(form.slug || title);
  if (!title) return { ok: false, error: "Title is required." };
  if (!slug) return { ok: false, error: "The URL slug needs at least one letter or number." };
  if (!category) return { ok: false, error: "Choose a category." };
  if (!ISO_DAY.test(form.publishDate)) return { ok: false, error: "Choose a publish date." };

  const { data: clash, error: slugError } = await supabase
    .from("blogs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (slugError) return { ok: false, error: `Couldn't save: ${slugError.message}` };
  if (clash && clash.id !== id) return { ok: false, error: `Another blog already uses the URL "/blog/${slug}".` };

  // the public filter pills group posts broadly; reuse the group other posts in this category use
  const { data: sibling } = await supabase
    .from("blogs")
    .select("data->>filter")
    .eq("category", category)
    .neq("id", id ?? "00000000-0000-0000-0000-000000000000")
    .limit(1)
    .maybeSingle();
  const siblingFilter = (sibling as { filter?: string } | null)?.filter;

  // the form's listing group wins; new posts without one get the sibling/category guess
  const pickFilter = (existing?: string): FilterCategory =>
    ([form.filter, siblingFilter, category, existing].find((f) => FILTERS.includes(f as FilterCategory)) as FilterCategory) ??
    "Industry News";

  if (id) {
    const { data: existing, error: readError } = await supabase
      .from("blogs")
      .select("slug, title, status, excerpt, published_at, data, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (readError) return { ok: false, error: `Couldn't load the blog: ${readError.message}` };
    if (!existing) return { ok: false, error: "This blog no longer exists." };
    if (!updatedAt || existing.updated_at !== updatedAt) return { ok: false, error: CONFLICT };
    const lengthError = tooLong("Title", title, LIMITS.blogTitle, existing.title);
    if (lengthError) return { ok: false, error: lengthError };

    const data = existing.data ?? {};
    // the updated_at match makes the write fail if someone saved between the read and here
    const { data: written, error } = await supabase
      .from("blogs")
      .update({
        ...formToBlogColumns(form, existing),
        slug,
        status,
        data: formToBlogData(form, slug, pickFilter(data.filter), data, existing.published_at?.slice(0, 10)),
      })
      .eq("id", id)
      .eq("updated_at", updatedAt)
      .select("id");
    if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
    if (!written?.length) return { ok: false, error: CONFLICT };

    revalidateBlog(existing.slug, slug);
    const action = existing.status === status ? "updated" : status === "published" ? "published" : "hidden";
    await logActivity(me.id, action, { type: "blog", id, name: title });
    return { ok: true, id, slug };
  }

  const lengthError = tooLong("Title", title, LIMITS.blogTitle);
  if (lengthError) return { ok: false, error: lengthError };

  const { data: created, error } = await supabase
    .from("blogs")
    .insert({ ...formToBlogColumns(form), slug, status, data: formToBlogData(form, slug, pickFilter()) })
    .select("id")
    .single();
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };

  revalidateBlog(slug);
  await logActivity(me.id, status === "published" ? "published" : "created", { type: "blog", id: created.id, name: title });
  return { ok: true, id: created.id, slug };
}

export async function deleteBlog(id: string): Promise<Result> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SIGNED_OUT };
  if (session.me.role !== "admin") return { ok: false, error: ADMINS_ONLY };
  const { supabase, me } = session;

  const { data: deleted, error } = await supabase.from("blogs").delete().eq("id", id).select("slug, title, cover_url, content, data");
  if (error) return { ok: false, error: `Couldn't delete: ${error.message}` };
  if (!deleted?.length) return { ok: false, error: "This blog was already deleted." };

  revalidateBlog(...deleted.map((d) => d.slug));
  await removeOrphanedMedia(supabase, deleted);
  await logActivity(me.id, "deleted", { type: "blog", id, name: deleted[0].title });
  return { ok: true };
}
