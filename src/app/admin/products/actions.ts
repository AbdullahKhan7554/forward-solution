"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, logActivity } from "@/lib/admin/session";
import { CONFLICT, LIMITS, tooLong } from "@/lib/admin/limits";
import { removeOrphanedMedia } from "@/lib/admin/storage";
import { productUrlError } from "@/lib/admin/validate";
import { categoryPath, productPath } from "@/lib/catalog";
import {
  SECTIONS,
  formToData,
  slugify,
  type ProductFormValues,
  type ProductRow,
  type Section,
} from "@/lib/admin/products";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const SIGNED_OUT = "Your session has expired. Please log in again.";
const ADMINS_ONLY = "Only admins can delete products.";

/** Public pages that render a product: catalogue, section, category and product page, search and sitemap. */
function publicPaths(section: Section, category: string, slug: string) {
  return [
    "/products",
    `/products/${section}`,
    ...(section === "ruminants" ? ["/ruminants"] : []),
    categoryPath(section, category),
    productPath(section, category, slug),
    "/search",
    "/sitemap.xml",
  ];
}

function revalidateProduct(...rows: Pick<ProductRow, "section" | "category" | "slug">[]) {
  const paths = new Set(rows.flatMap((r) => publicPaths(r.section, r.category, r.slug)));
  paths.forEach((p) => revalidatePath(p));
  revalidatePath("/admin/products", "layout");
}

/** `updatedAt` is the row's updated_at when the form was loaded; a newer row means someone else saved meanwhile. */
export async function saveProduct(
  id: string | null,
  form: ProductFormValues,
  updatedAt: string | null,
): Promise<Result<{ id: string }>> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SIGNED_OUT };
  const { supabase, me } = session;

  const name = form.name.trim();
  const category = form.category.trim();
  if (!name) return { ok: false, error: "Product name is required." };
  if (!SECTIONS.some((s) => s.value === form.section)) return { ok: false, error: "Choose a section." };
  if (!category) return { ok: false, error: "Choose a category." };

  const { data: all, error: listError } = await supabase.from("products").select("id, slug, name, section, category, subtitle, data");
  if (listError) return { ok: false, error: `Couldn't save: ${listError.message}` };
  const stored = id ? all.find((r) => r.id === id) : undefined;
  const lengthError =
    tooLong("Product name", name, LIMITS.productName, stored?.name) ??
    tooLong("Subtitle", form.subtitle, LIMITS.subtitle, stored?.subtitle) ??
    tooLong("Meta description", form.metaDescription, LIMITS.metaDescription, stored?.data?.metaDescription);
  if (lengthError) return { ok: false, error: lengthError };

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
      .select("slug, section, category, is_live, image_url, data, updated_at")
      .eq("id", id)
      .maybeSingle();
    if (readError) return { ok: false, error: `Couldn't load the product: ${readError.message}` };
    if (!existing) return { ok: false, error: "This product no longer exists." };
    if (!updatedAt || existing.updated_at !== updatedAt) return { ok: false, error: CONFLICT };

    const urlError = productUrlError({ id, slug: existing.slug, name, section: fields.section, category }, all);
    if (urlError) return { ok: false, error: urlError };

    // the updated_at match makes the write fail if someone saved between the read and here
    const { data: written, error } = await supabase
      .from("products")
      .update({ ...fields, data: formToData(form, existing.data ?? {}, existing.image_url ?? existing.data?.assets?.hero ?? null) })
      .eq("id", id)
      .eq("updated_at", updatedAt)
      .select("id");
    if (error) return { ok: false, error: `Couldn't save: ${error.message}` };
    if (!written?.length) return { ok: false, error: CONFLICT };

    revalidateProduct(existing, { ...fields, slug: existing.slug });
    const action = existing.is_live === fields.is_live ? "updated" : fields.is_live ? "published" : "hidden";
    await logActivity(me.id, action, { type: "product", id, name });
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

  const urlError = productUrlError({ id: null, slug, name, section: fields.section, category }, all);
  if (urlError) return { ok: false, error: urlError };

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
  await logActivity(me.id, "created", { type: "product", id: created.id, name });
  return { ok: true, id: created.id };
}

export async function deleteProduct(id: string): Promise<Result> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: SIGNED_OUT };
  if (session.me.role !== "admin") return { ok: false, error: ADMINS_ONLY };
  const { supabase, me } = session;

  const { data: deleted, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("name, slug, section, category, image_url, data");
  if (error) return { ok: false, error: `Couldn't delete: ${error.message}` };
  if (!deleted?.length) return { ok: false, error: "This product was already deleted." };

  revalidateProduct(...deleted);
  await removeOrphanedMedia(supabase, deleted);
  await logActivity(me.id, "deleted", { type: "product", id, name: deleted[0].name });
  return { ok: true };
}
