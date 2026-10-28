import type { CatalogProduct, CategoryCard } from "@/lib/catalog";
import type { Article } from "@/components/info-center/types";

/**
 * Global search index + query engine.
 *
 * A single, dependency-free source of truth for site-wide search. Products and
 * blog entries come from Supabase (built on the server by the /search page);
 * pages, services and product categories are authored here against the real routes.
 * The query engine is a small ranked-substring matcher — instant, debounce-
 * friendly and allocation-light. Results are grouped in a stable order and
 * capped per group so the modal never renders an unbounded list (no layout
 * shift, effectively windowed).
 */

export type SearchGroup = "Products" | "Categories" | "Services" | "Blogs" | "Pages";

export type SearchItem = {
  id: string;
  title: string;
  group: SearchGroup;
  href: string;
  category?: string;
  description?: string;
  /** ISO-parseable date (blogs) — used by the "Newest" sort */
  date?: string;
  /** extra terms to match on (not displayed) */
  keywords?: string;
};

export const GROUP_ORDER: SearchGroup[] = [
  "Products",
  "Categories",
  "Services",
  "Blogs",
  "Pages",
];

const PAGES: SearchItem[] = [
  { id: "page-home", title: "Home", group: "Pages", href: "/", description: "Empowering animal health through innovative feed additives." },
  { id: "page-about", title: "About Us", group: "Pages", href: "/about", description: "Caring for animals, caring for you — our story and values." },
  { id: "page-services", title: "Services", group: "Pages", href: "/services", description: "Technical support, consultation and partnership solutions.", keywords: "consultation support" },
  { id: "page-products", title: "Products", group: "Pages", href: "/products", description: "Explore every category of animal health solutions." },
  { id: "page-blog", title: "Knowledge Center", group: "Pages", href: "/blog", description: "Insights, research and industry articles.", keywords: "blog articles insights news info center" },
  { id: "page-contact", title: "Contact", group: "Pages", href: "/contact-us/", description: "Talk to our experts — Lahore, open 24 hours.", keywords: "contact address phone email location" },
];

const SERVICES: SearchItem[] = [
  { id: "svc-consultation", title: "Technical Consultation", group: "Services", href: "/services", description: "Expert technical guidance tailored to your operation." },
  { id: "svc-vet", title: "Veterinary Support", group: "Services", href: "/services", description: "Direct access to veterinary expertise." },
  { id: "svc-product", title: "Product Recommendations", group: "Services", href: "/services", description: "The right product for the right challenge." },
  { id: "svc-feed", title: "Feed Optimization", group: "Services", href: "/services", description: "Strategies that improve feed efficiency and performance." },
  { id: "svc-disease", title: "Disease Management Guidance", group: "Services", href: "/services", description: "Practical biosecurity and disease prevention." },
  { id: "svc-distributor", title: "Distributor Support", group: "Services", href: "/services", description: "Commercial and technical partnership for distributors." },
];

const CATEGORIES: SearchItem[] = [
  { id: "cat-poultry", title: "Poultry", group: "Categories", href: "/products/poultry", description: "Nutrition, gut health and performance for poultry." },
  { id: "cat-ruminants", title: "Ruminants", group: "Categories", href: "/ruminants", description: "Health and productivity for dairy and beef cattle." },
  { id: "cat-ruminant-rumen-protected-amino-acids", title: "Rumen Protected Amino Acids", group: "Categories", href: "/products/ruminants/rumen-protected-amino-acids", description: "Bypass amino acids for milk & protein efficiency.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-toxin-binders", title: "Toxin Binders", group: "Categories", href: "/products/ruminants/toxin-binders", description: "Broad-spectrum mycotoxin management.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-organic-minerals", title: "Organic Minerals", group: "Categories", href: "/products/ruminants/organic-minerals", description: "Chelated trace minerals for fertility & immunity.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-biosecurity", title: "Biosecurity Solutions", group: "Categories", href: "/products/ruminants/biosecurity", description: "Hygiene and disinfection that protect herds.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-comfort", title: "Comfort Solutions", group: "Categories", href: "/products/ruminants/comfort", description: "Cow comfort for productivity & longevity.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-energy-boosters", title: "Energy Boosters", group: "Categories", href: "/products/ruminants/energy-boosters", description: "Rapid energy & metabolic support for transition cows.", keywords: "ruminant cattle" },
  { id: "cat-ruminant-yeast-culture", title: "Yeast Culture", group: "Categories", href: "/products/ruminants/yeast-culture", description: "Rumen health & immune support for maximum yield.", keywords: "ruminant cattle" },
  { id: "cat-enzymes", title: "Enzymes", group: "Categories", href: "/products/poultry/enzymes", description: "NSP and phytase enzymes for feed efficiency." },
  { id: "cat-organic-acids", title: "Organic Acids", group: "Categories", href: "/products/poultry/organic-acids", description: "Gut health and performance organic acids." },
  { id: "cat-antioxidants", title: "Antioxidants", group: "Categories", href: "/products/poultry/antioxidants", description: "Feed and fat stabilisation antioxidants." },
  { id: "cat-bile-acids", title: "Bile Acids", group: "Categories", href: "/products/poultry/bile-acids", description: "Fat digestion and liver support." },
  { id: "cat-emulsifier", title: "Emulsifiers", group: "Categories", href: "/products/poultry/emulsifier", description: "Lyso-phospholipid emulsifiers for energy uptake." },
  { id: "cat-toxin-binders", title: "Toxin Binders", group: "Categories", href: "/products/poultry/toxin-binders", description: "Broad-spectrum mycotoxin binders." },
  { id: "cat-organic-minerals", title: "Organic Minerals", group: "Categories", href: "/products/poultry/organic-minerals", description: "Chelated trace minerals with high bioavailability." },
  { id: "cat-alt-protein", title: "Alternative Protein", group: "Categories", href: "/products/poultry/alternative-protein", description: "Sustainable protein sources for feed." },
  { id: "cat-probiotics", title: "Probiotics", group: "Categories", href: "/products/poultry/probiotics", description: "Gut health that fuels performance." },
  { id: "cat-fly-control", title: "Fly Control", group: "Categories", href: "/products/poultry/fly-control", description: "Break the fly cycle at the source." },
  { id: "cat-feed-pigment", title: "Feed Pigment", group: "Categories", href: "/products/poultry/feed-pigment", description: "Consistent color without compromise" },
  { id: "cat-feed-hygienizer", title: "Feed Hygienizer", group: "Categories", href: "/products/poultry/feed-hygienizer", description: "Fresher feed, fewer toxin risks" },
  { id: "cat-phytogenic-anticoccidials", title: "Phytogenic Anticoccidials", group: "Categories", href: "/products/poultry/phytogenic-anticoccidials", description: "Plant-powered protection against coccidiosis." },
];

/** First sentence of a product intro, as a short result description. */
const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

/** The full index: live products, published blogs and the authored entries above. */
export function buildSearchIndex(
  products: CatalogProduct[],
  articles: Article[],
  extraCategories: CategoryCard[] = [],
): SearchItem[] {
  const productItems: SearchItem[] = products.map((p) => ({
    id: `prod-${p.section}-${p.slug}`,
    title: p.data.name,
    group: "Products",
    category: p.category,
    href: p.href,
    description: p.data.subtitle ?? firstSentence(p.data.intro),
    ...(p.section === "ruminants" ? { keywords: "ruminant cattle" } : {}),
  }));

  const categoryItems: SearchItem[] = extraCategories.map((c) => ({
    id: `cat-${c.href}`,
    title: c.name,
    group: "Categories",
    href: c.href,
    description: c.blurb,
  }));

  const blogItems: SearchItem[] = articles.map((a) => ({
    id: `blog-${a.slug}`,
    title: a.title,
    group: "Blogs",
    href: a.href,
    category: a.category,
    description: a.excerpt,
    date: a.date,
  }));

  return [...productItems, ...CATEGORIES, ...categoryItems, ...SERVICES, ...blogItems, ...PAGES];
}

function haystack(item: SearchItem): string {
  return `${item.title} ${item.category ?? ""} ${item.description ?? ""} ${item.keywords ?? ""}`.toLowerCase();
}

/** Rank: title prefix (3) > title word-start (2) > title contains (1) > body contains (0). */
function score(item: SearchItem, tokens: string[]): number {
  const title = item.title.toLowerCase();
  const hay = haystack(item);
  let total = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return -1; // every token must match somewhere
    if (title.startsWith(t)) total += 3;
    else if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) total += 2;
    else if (title.includes(t)) total += 1;
  }
  return total;
}

/**
 * Uncapped, ranked search for the dedicated /search page. Returns every match
 * in relevance order; an empty query returns the whole index (so the results
 * page has content and its filters/sort stay usable).
 */
export function searchAll(index: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...index];

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { item: SearchItem; s: number }[] = [];
  for (const item of index) {
    const s = score(item, tokens);
    if (s >= 0) scored.push({ item, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.map((x) => x.item);
}

export type SearchSection = { group: SearchGroup; items: SearchItem[] };

/** Group a flat result list into stable-ordered sections. */
export function groupResults(items: SearchItem[]): SearchSection[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((i) => i.group === group),
  })).filter((s) => s.items.length > 0);
}
