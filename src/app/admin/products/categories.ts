import { createClient } from "@/lib/supabase/server";
import type { Section } from "@/lib/admin/products";

/** Distinct categories already used by products, per section. */
export async function loadCategories(): Promise<Record<Section, string[]>> {
  const { data, error } = await createClient().from("products").select("section, category");
  if (error) throw new Error(`Couldn't load categories: ${error.message}`);
  const sorted = (section: Section) =>
    Array.from(new Set((data ?? []).filter((r) => r.section === section).map((r) => r.category))).sort((a, b) =>
      a.localeCompare(b),
    );
  return { poultry: sorted("poultry"), ruminants: sorted("ruminants") };
}
