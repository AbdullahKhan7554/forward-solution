/**
 * Public product catalogue — live rows from the Supabase products table, plus
 * the URL scheme the site has always used for them. Server-only.
 */
import { cache } from "react";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { slugify, type ProductRow, type Section } from "@/lib/admin/products";
import type { ProductDetailData } from "@/components/product-detail/types";
import { FLAT_POULTRY_CATEGORIES, POULTRY_CATEGORIES } from "@/components/poultry/categories";
import { RUMINANT_CATEGORIES } from "@/components/ruminants/categories";

export const SITE = "https://agriprompakistan.com";

export type CatalogProduct = {
  slug: string;
  section: Section;
  category: string;
  href: string;
  updatedAt: string;
  data: ProductDetailData;
};

/** Id of the category page that lists `category` (/products/<section>/<id>). */
export function categoryId(section: Section, category: string) {
  const known =
    section === "ruminants"
      ? RUMINANT_CATEGORIES.find((c) => c.name === category)?.id
      : POULTRY_CATEGORIES.find((c) => c.categories.includes(category))?.id;
  return known ?? slugify(category);
}

/** The ruminant ElencoFix-Super is stored as "elencofix-super-ruminants"; its URL keeps the bare slug. */
export const urlSlug = (section: Section, slug: string) =>
  section === "ruminants" ? slug.replace(/-ruminants$/, "") : slug;

export function productPath(section: Section, category: string, slug: string) {
  const base = `/products/${section}`;
  const s = urlSlug(section, slug);
  if (section === "poultry") {
    // nested product URLs use the category's own slug ("organic-acids-scfa"), not its listing page id
    return FLAT_POULTRY_CATEGORIES.has(category) ? `${base}/${s}` : `${base}/${slugify(category)}/${s}`;
  }
  return `${base}/${categoryId(section, category)}/${s}`;
}

export const categoryPath = (section: Section, category: string) =>
  `/products/${section}/${categoryId(section, category)}`;

type Row = Pick<ProductRow, "slug" | "section" | "category" | "name" | "subtitle" | "image_url" | "data" | "updated_at">;

function toProduct(row: Row): CatalogProduct {
  const d = row.data ?? {};
  const hero = row.image_url ?? d.assets?.hero;
  return {
    slug: row.slug,
    section: row.section,
    category: row.category,
    href: productPath(row.section, row.category, row.slug),
    updatedAt: row.updated_at,
    data: {
      eyebrow: `${row.section === "ruminants" ? "Ruminants" : "Poultry"} · ${row.category}`,
      intro: "",
      overviewLead: "",
      overviewPoints: [],
      benefits: [],
      flow: [],
      applications: [],
      specs: [],
      metaTitle: `${row.name} — Agriprom Pakistan`,
      metaDescription: "",
      ...d,
      ...(hero ? { assets: { ...d.assets, hero } } : {}),
      slug: row.slug,
      catalog: row.section,
      name: row.name,
      ...(row.subtitle ? { subtitle: row.subtitle } : {}),
    },
  };
}

/** Every live product, in admin sort order. Deduped per render. */
export const getProducts = cache(async (): Promise<CatalogProduct[]> => {
  const { data, error } = await createPublicClient()
    .from("products")
    .select("slug, section, category, name, subtitle, image_url, data, updated_at")
    .eq("is_live", true)
    .order("sort_order")
    .order("name");
  if (error) throw new Error(`Couldn't load products: ${error.message}`);
  return (data as Row[]).map(toProduct);
});

export async function getSectionProducts(section: Section) {
  return (await getProducts()).filter((p) => p.section === section);
}

export async function findProduct(href: string) {
  return (await getProducts()).find((p) => p.href === href);
}

/** A category page: the configured one for `id`, else one generated for an admin-added category. */
export type CategoryPage = {
  id: string;
  label: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  title: string;
  description: string;
  products: CatalogProduct[];
};

export async function getCategoryPages(section: Section): Promise<CategoryPage[]> {
  const products = await getSectionProducts(section);
  const configured: CategoryPage[] =
    section === "poultry"
      ? POULTRY_CATEGORIES.map((c) => ({
          ...c,
          products: products.filter((p) => c.categories.includes(p.category) && !c.unlisted?.includes(p.slug)),
        }))
      : RUMINANT_CATEGORIES.map((c) => ({
          id: c.id,
          label: `Ruminant ${c.name}`,
          eyebrow: `Ruminants · ${c.name}`,
          titleTop: "Ruminant",
          titleBottom: c.name,
          intro: c.description,
          title: `Ruminant ${c.name} — Agriprom Pakistan`,
          description: c.description,
          products: products.filter((p) => p.category === c.name),
        }));

  const sectionLabel = section === "ruminants" ? "Ruminants" : "Poultry";
  const singular = section === "ruminants" ? "Ruminant" : "Poultry";
  const extra = new Map<string, CategoryPage>();
  for (const p of products) {
    const id = categoryId(section, p.category);
    if (configured.some((c) => c.id === id)) continue;
    const page = extra.get(id) ?? {
      id,
      label: `${singular} ${p.category}`,
      eyebrow: `${sectionLabel} · ${p.category}`,
      titleTop: singular,
      titleBottom: p.category,
      intro: `Explore Agriprom Pakistan's ${singular.toLowerCase()} ${p.category.toLowerCase()} range.`,
      title: `${singular} ${p.category} — Agriprom Pakistan`,
      description: `Agriprom Pakistan's ${singular.toLowerCase()} ${p.category.toLowerCase()} range.`,
      products: [],
    };
    page.products.push(p);
    extra.set(id, page);
  }
  return [...configured, ...extra.values()];
}

export async function getCategoryPage(section: Section, id: string) {
  return (await getCategoryPages(section)).find((c) => c.id === id);
}

export function productMetadata(p: CatalogProduct): Metadata {
  const { metaTitle: title, metaDescription: description } = p.data;
  const url = `${SITE}${p.href}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: "Agriprom Pakistan" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Product + Breadcrumb structured data (JSON-LD). */
export function productJsonLd(p: CatalogProduct) {
  const url = `${SITE}${p.href}`;
  const sectionName = p.section === "ruminants" ? "Ruminants" : "Poultry";
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.data.name,
      category: p.category,
      description: p.data.metaDescription,
      brand: { "@type": "Brand", name: "Agriprom Pakistan" },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE}/products` },
        { "@type": "ListItem", position: 3, name: sectionName, item: `${SITE}/products/${p.section}` },
        { "@type": "ListItem", position: 4, name: p.category, item: `${SITE}${categoryPath(p.section, p.category)}` },
        { "@type": "ListItem", position: 5, name: p.data.name, item: url },
      ],
    },
  ];
}

/** Section-grid cards for categories added in the admin (configured ones have their own art and copy). */
export async function getExtraCategoryCards(section: Section) {
  const configured = new Set<string>(
    section === "poultry" ? POULTRY_CATEGORIES.map((c) => c.id) : RUMINANT_CATEGORIES.map((c) => c.id),
  );
  return (await getCategoryPages(section))
    .filter((c) => !configured.has(c.id))
    .map((c) => ({
      name: c.titleBottom,
      blurb: c.description,
      href: `/products/${section}/${c.id}`,
      image: c.products[0]?.data.assets?.hero,
    }));
}

export type CategoryCard = Awaited<ReturnType<typeof getExtraCategoryCards>>[number];
