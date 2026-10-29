/** Save-time checks that a product's category and URL won't break or shadow another page. */
import { categoryPath, productPath } from "@/lib/catalog";
import { slugify, type Section } from "@/lib/admin/products";
import { POULTRY_CATEGORIES } from "@/components/poultry/categories";
import { RUMINANT_CATEGORIES } from "@/components/ruminants/categories";

type Ref = { id: string | null; slug: string; name: string; section: Section; category: string };

/** Error message, or null when `self` gets its own category page and product URL. */
export function productUrlError(self: Ref, others: Ref[]): string | null {
  const rest = others.filter((r) => r.id !== self.id);

  if (!slugify(self.category)) return "The category name needs at least one letter or number.";
  const clash = rest.find(
    (r) => r.section === self.section && r.category !== self.category && slugify(r.category) === slugify(self.category),
  );
  if (clash) {
    return `The category "${self.category}" would share a web address with "${clash.category}". Choose "${clash.category}" or use a different name.`;
  }

  const path = productPath(self.section, self.category, self.slug);
  const taken = rest.find((r) => productPath(r.section, r.category, r.slug) === path);
  if (taken) return `"${taken.name}" already uses the address ${path}. Rename this product.`;

  const categoryPages = new Set([
    ...POULTRY_CATEGORIES.map((c) => `/products/poultry/${c.id}`),
    ...RUMINANT_CATEGORIES.map((c) => `/products/ruminants/${c.id}`),
    ...rest.map((r) => categoryPath(r.section, r.category)),
  ]);
  if (categoryPages.has(path)) return `The address ${path} is already a category page. Rename this product.`;
  return null;
}
