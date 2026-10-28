import { createClient } from "@/lib/supabase/server";
import { FILTERS } from "@/lib/admin/blogs";

/** Distinct categories already used by blogs; the broad filter groups when there are none yet. */
export async function loadBlogCategories(): Promise<string[]> {
  const { data, error } = await createClient().from("blogs").select("category");
  if (error) throw new Error(`Couldn't load categories: ${error.message}`);
  const used = Array.from(new Set((data ?? []).map((r) => r.category))).sort((a, b) => a.localeCompare(b));
  return used.length ? used : [...FILTERS];
}
