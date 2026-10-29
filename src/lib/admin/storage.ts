// Server-only: cleans up media-bucket files after a product or blog is deleted.
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "media";
const PUBLIC_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

/** Object paths of every media-bucket URL anywhere in `value` (columns, data jsonb, editor HTML). */
function mediaPaths(value: unknown): Set<string> {
  const text = JSON.stringify(value) ?? "";
  const paths = new Set<string>();
  let i = text.indexOf(PUBLIC_PREFIX);
  while (i !== -1) {
    const rest = text.slice(i + PUBLIC_PREFIX.length);
    const path = rest.match(/^[^"'\s)<>?#\\]+/)?.[0];
    if (path) paths.add(decodeURIComponent(path));
    i = text.indexOf(PUBLIC_PREFIX, i + PUBLIC_PREFIX.length);
  }
  return paths;
}

/**
 * Removes the files the deleted rows pointed to, except ones another product or blog
 * still uses. Best-effort: the row is already gone, so a failure is only logged.
 */
export async function removeOrphanedMedia(supabase: SupabaseClient, deleted: unknown[]) {
  try {
    const candidates = mediaPaths(deleted);
    if (candidates.size === 0) return;

    const [products, blogs] = await Promise.all([
      supabase.from("products").select("image_url, data"),
      supabase.from("blogs").select("cover_url, content, data"),
    ]);
    if (products.error || blogs.error) {
      console.error("media cleanup skipped:", (products.error ?? blogs.error)?.message);
      return;
    }
    const inUse = mediaPaths([products.data, blogs.data]);
    const orphans = [...candidates].filter((p) => !inUse.has(p));
    if (orphans.length === 0) return;

    const { error } = await supabase.storage.from(BUCKET).remove(orphans);
    if (error) console.error("media cleanup failed:", error.message);
  } catch (e) {
    console.error("media cleanup failed:", e);
  }
}
