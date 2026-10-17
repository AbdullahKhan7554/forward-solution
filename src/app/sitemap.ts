import type { MetadataRoute } from "next";
import { articles } from "@/components/info-center/articles";

const SITE = "https://agriprompakistan.com";

/** Top-level + section + product routes (mirrors the app router). */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact-us",
  "/blog",
  "/products",
  "/ruminants",
  // product categories
  "/products/poultry",
  "/products/poultry/enzymes",
  "/products/poultry/organic-acids",
  "/products/poultry/antioxidants",
  "/products/poultry/bile-acids",
  "/products/poultry/emulsifier",
  "/products/poultry/toxin-binders",
  "/products/poultry/organic-minerals",
  "/products/poultry/alternative-protein",
  "/products/poultry/probiotics",
  "/products/poultry/fly-control",
  "/products/poultry/feed-pigment",
  "/products/poultry/feed-hygienizer",
  "/products/poultry/phytogenic-anticoccidials",
  // product detail pages
  "/products/poultry/compound-enzyme-nsp",
  "/products/poultry/corgest-m",
  "/products/poultry/corgest-m-mannanase",
  "/products/poultry/xylanase",
  "/products/poultry/phytingest",
  "/products/poultry/probond",
  "/products/poultry/elencofix-super",
  "/products/poultry/antioxidants/compound-antioxidant",
  "/products/poultry/emulsifier/lysolip",
  "/products/poultry/organic-minerals/minlex-poultry",
  "/products/poultry/organic-acids-scfa/prophorce-sr130",
  "/products/poultry/anta-mix-me",
  "/products/poultry/prosid-tb-207",
  "/products/poultry/probiotics/alterion-ne",
  "/products/poultry/fly-control/antifly",
  "/products/poultry/feed-pigment/canthaxanthin-lutein",
  "/products/poultry/feed-hygienizer/moldcid",
  "/products/poultry/phytogenic-anticoccidials/coxield",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
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
