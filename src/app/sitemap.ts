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
  "/products/ruminants",
  // product categories
  "/products/poultry",
  "/products/poultry/enzymes",
  "/products/poultry/organic-acids",
  "/products/poultry/antioxidants",
  "/products/poultry/bile-acids",
  "/products/poultry/bile-acids/bilepro",
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
  "/products/poultry/alternative-protein/msg-single-cell-protein",
  // ruminant categories + products
  "/products/ruminants/rumen-protected-amino-acids",
  "/products/ruminants/rumen-protected-amino-acids/matrixin",
  "/products/ruminants/rumen-protected-amino-acids/matonin",
  "/products/ruminants/toxin-binders",
  "/products/ruminants/toxin-binders/banebe",
  "/products/ruminants/toxin-binders/elencofix-super",
  "/products/ruminants/organic-minerals",
  "/products/ruminants/organic-minerals/minlex-cattle",
  "/products/ruminants/biosecurity",
  "/products/ruminants/biosecurity/cleanex",
  "/products/ruminants/biosecurity/germex",
  "/products/ruminants/comfort",
  "/products/ruminants/comfort/puzzle-comfort-mat",
  "/products/ruminants/comfort/mammouth-mattress",
  "/products/ruminants/comfort/eva-horse-stable-mat",
  "/products/ruminants/comfort/standard-self-locks",
  "/products/ruminants/comfort/free-stall-systems",
  "/products/ruminants/energy-boosters",
  "/products/ruminants/energy-boosters/energy-booster",
  "/products/ruminants/energy-boosters/lactomin-boost",
  "/products/ruminants/yeast-culture",
  "/products/ruminants/yeast-culture/yeastics-r",
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
