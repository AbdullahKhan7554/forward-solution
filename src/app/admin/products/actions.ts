"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { RUMINANT_CATEGORIES } from "@/components/ruminants/categories";
import {
  SECTIONS,
  formToData,
  slugify,
  type ProductFormValues,
  type ProductRow,
  type Section,
} from "@/lib/admin/products";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function signedInClient() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

const SIGNED_OUT = "Your session has expired. Please log in again.";

/** Public pages that render a product: catalogue, section, category and product page. */
function publicPaths(section: Section, category: string, slug: string) {
  const base = `/products/${section}`;
  const categoryId =
    section === "ruminants"
      ? RUMINANT_CATEGORIES.find((c) => c.name === category)?.id ?? slugify(category)
      : slugify(category);
  // the seed suffixes a slug shared across catalogues with "-ruminants"; the URL keeps the bare slug
  const urlSlug = section === "ruminants" ? slug.replace(/-ruminants$/, "") : slug;
  return [
    "/products",
    base,
    `${base}/${categoryId}`,
    `${base}/${categoryId}/${urlSlug}`,
    `${base}/${urlSlug}`,
  ];
}

function revalidateProduct(...rows: Pick<ProductRow, "section" | "category" | "slug">[]) {
  const paths = new Set(rows.flatMap((r) => publicPaths(r.section, r.category, r.slug)));
  paths.forEach((p) => revalidatePath(p));
  revalidatePath("/admin/products", "layout");
}

export async function saveProduct(
  id: string | null,
  form: ProductFormValues,
): Promise<Result<{ id: string }>> {
  const supabase = await signedInClient();
  if (!supabase) return { ok: false, error: SIGNED_OUT };

  const name = form.name.trim();
  const category = form.category.trim();
  if (!name) return { ok: false, error: "Product name is required." };
  if (!SECTIONS.some((s) => s.value === form.section)) return { ok: false, error: "Choose a section." };
  if (!category) return { ok: false, error: "Choose a category." };

  const fields = {
    section: form.section,
    category,
    name,
    subtitle: form.subtitle.trim() || null,
    image_url: form.imageUrl,
    is_live: form.isLive,
  };

  if (id) {
    const { data: existing, error: readError } = await supabase
      .from("products")
      .select("slug, section, category, data")
      .eq("id", id)
      .maybeSingle();
    if (readError) return { ok: false, error: `Couldn't load the product: ${readError.message}` };
    if (!existing) return { ok: false, error: "This product no longer exists." };

    const { error } = await supabase
      .from("products")
      .update({ ...fields, data: formToData(form, existing.data ?? {}) })
      .eq("id", id);
    if (error) return { ok: false, error: `Couldn't save: ${error.message}` };

    revalidateProduct(existing, { ...fields, slug: existing.slug });
    return { ok: true, id };
  }

  const base = slugify(name);
  if (!base) return { ok: false, error: "Product name needs at least one letter or number." };

  const { data: taken, error: slugError } = await supabase
    .from("products")
    .select("slug")
    .like("slug", `${base}%`);
  if (slugError) return { ok: false, error: `Couldn't save: ${slugError.message}` };
  const used = new Set((taken ?? []).map((r) => r.slug));
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;

  const { data: last } = await supabase
    .from("products")
    .select("sort_order")
    .eq("section", form.section)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: created, error } = await supabase
    .from("products")
    .insert({ ...fields, slug, sort_order: (last?.sort_order ?? -1) + 1, data: formToData(form) })
    .select("id")
    .single();
  if (error) return { ok: false, error: `Couldn't save: ${error.message}` };

  revalidateProduct({ ...fields, slug });
  return { ok: true, id: created.id };
}

export async function deleteProduct(id: string): Promise<Result> {
  const supabase = await signedInClient();
  if (!supabase) return { ok: false, error: SIGNED_OUT };

  const { data: deleted, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("slug, section, category");
  if (error) return { ok: false, error: `Couldn't delete: ${error.message}` };
  if (!deleted?.length) return { ok: false, error: "This product was already deleted." };

  revalidateProduct(...deleted);
  return { ok: true };
}
