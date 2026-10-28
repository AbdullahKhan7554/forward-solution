import type { MetadataRoute } from "next";
import { SITE, getCategoryPages, getProducts } from "@/lib/catalog";
import { getArticles } from "@/lib/blog";

/** Top-level + section routes; categories, products and blogs come from Supabase. */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact-us",
  "/blog",
  "/products",
  "/ruminants",
  "/products/ruminants",
  "/products/poultry",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [poultry, ruminants, products, articles] = await Promise.all([
    getCategoryPages("poultry"),
    getCategoryPages("ruminants"),
    getProducts(),
    getArticles(),
  ]);

  const routes = [
    ...STATIC_ROUTES,
    ...poultry.map((c) => `/products/poultry/${c.id}`),
    ...ruminants.map((c) => `/products/ruminants/${c.id}`),
    ...products.map((p) => p.href),
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/blog/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
