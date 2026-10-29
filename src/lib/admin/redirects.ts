// Server-only. Old public paths → new ones, 301'd by the middleware (supabase/redirects.sql).
import type { SupabaseClient } from "@supabase/supabase-js";

/** A path that is live again must not redirect away. Best-effort: never fails the caller. */
export async function clearRedirect(supabase: SupabaseClient, path: string) {
  const { error } = await supabase.from("redirects").delete().eq("old_path", path);
  if (error) console.error("clearRedirect failed:", error.message);
}

/** Saves `oldPath` → `newPath`, repointing older redirects so chains collapse to one hop. Best-effort. */
export async function recordRedirect(supabase: SupabaseClient, oldPath: string, newPath: string) {
  if (oldPath === newPath) return;
  await clearRedirect(supabase, newPath);
  const repoint = await supabase.from("redirects").update({ new_path: newPath }).eq("new_path", oldPath);
  const save = await supabase.from("redirects").upsert({ old_path: oldPath, new_path: newPath });
  const error = repoint.error ?? save.error;
  if (error) console.error("recordRedirect failed:", error.message);
}
