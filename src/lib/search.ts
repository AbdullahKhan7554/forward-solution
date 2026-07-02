import { articles } from "@/components/info-center/articles";

/**
 * Global search index + query engine.
 *
 * A single, dependency-free source of truth for site-wide search. Blog entries
 * are pulled live from the articles data; everything else (pages, services,
 * product categories and key products) is authored here against the real routes.
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
  { id: "cat-companion", title: "Companion Animals", group: "Categories", href: "/companion-animals", description: "Vaccines and healthcare for dogs and cats." },
  { id: "cat-enzymes", title: "Enzymes", group: "Categories", href: "/products/poultry/enzymes", description: "NSP and phytase enzymes for feed efficiency." },
  { id: "cat-organic-acids", title: "Organic Acids", group: "Categories", href: "/products/poultry/organic-acids", description: "Gut health and performance organic acids." },
  { id: "cat-antioxidants", title: "Antioxidants", group: "Categories", href: "/products/poultry/antioxidants", description: "Feed and fat stabilisation antioxidants." },
  { id: "cat-bile-acids", title: "Bile Acids", group: "Categories", href: "/products/poultry/bile-acids", description: "Fat digestion and liver support." },
  { id: "cat-emulsifier", title: "Emulsifiers", group: "Categories", href: "/products/poultry/emulsifier", description: "Lyso-phospholipid emulsifiers for energy uptake." },
  { id: "cat-toxin-binders", title: "Toxin Binders", group: "Categories", href: "/products/poultry/toxin-binders", description: "Broad-spectrum mycotoxin binders." },
  { id: "cat-organic-minerals", title: "Organic Minerals", group: "Categories", href: "/products/poultry/organic-minerals", description: "Chelated trace minerals with high bioavailability." },
  { id: "cat-alt-protein", title: "Alternative Protein", group: "Categories", href: "/products/poultry/alternative-protein", description: "Sustainable protein sources for feed." },
];

const PRODUCTS: SearchItem[] = [
  { id: "prod-prophorce", title: "ProPhorce SR 130", group: "Products", category: "Organic Acids (SCFA)", href: "/products/poultry/organic-acids-scfa/prophorce-sr130", description: "Esterified tributyrin for gut health and performance.", keywords: "butyric tributyrin" },
  { id: "prod-compound-enzyme", title: "Compound Enzyme (NSP)", group: "Products", category: "Enzymes", href: "/products/poultry/compound-enzyme-nsp", description: "Multi-enzyme complex that unlocks trapped nutrients." },
  { id: "prod-xylanase", title: "Xylanase", group: "Products", category: "Enzymes", href: "/products/poultry/xylanase", description: "Targets arabinoxylans to raise feed efficiency." },
  { id: "prod-phytingest", title: "PhytinGest (Phytase)", group: "Products", category: "Enzymes", href: "/products/poultry/phytingest", description: "Releases bound phosphorus from plant phytate." },
  { id: "prod-corgest", title: "CorGest M (Mannanase)", group: "Products", category: "Enzymes", href: "/products/poultry/corgest-m-mannanase", description: "Mannanase for gut integrity and immunity." },
  { id: "prod-elencofix", title: "Elenco Fix Super", group: "Products", category: "Toxin Binders", href: "/products/poultry/elencofix-super", description: "Broad-spectrum mycotoxin binder." },
  { id: "prod-probond", title: "Probond", group: "Products", category: "Toxin Binders", href: "/products/poultry/probond", description: "Advanced toxin adsorption technology." },
  { id: "prod-compound-antioxidant", title: "Compound Antioxidant", group: "Products", category: "Antioxidants", href: "/products/poultry/antioxidants/compound-antioxidant", description: "Protects feed and fats from oxidation." },
  { id: "prod-lysolip", title: "LysoLip", group: "Products", category: "Emulsifiers", href: "/products/poultry/emulsifier/lysolip", description: "Lyso-phospholipid emulsifier for energy uptake." },
  { id: "prod-minlex", title: "Minlex Poultry", group: "Products", category: "Organic Minerals", href: "/products/poultry/organic-minerals/minlex-poultry", description: "Chelated organic trace minerals for poultry." },
];

const BLOGS: SearchItem[] = articles.map((a) => ({
  id: `blog-${a.slug}`,
  title: a.title,
  group: "Blogs" as const,
  href: a.href,
  category: a.category,
  description: a.excerpt,
  date: a.date,
}));

export const SEARCH_INDEX: SearchItem[] = [
  ...PRODUCTS,
  ...CATEGORIES,
  ...SERVICES,
  ...BLOGS,
  ...PAGES,
];

/** Shown when the query is empty. */
export const DEFAULT_SUGGESTIONS: SearchItem[] = [
  PAGES[3], // Products
  PAGES[2], // Services
  PAGES[4], // Knowledge Center
  PRODUCTS[0], // ProPhorce SR 130
  CATEGORIES[0], // Poultry
  PAGES[5], // Contact
];

const CAP_PER_GROUP = 6;
const CAP_TOTAL = 24;

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

export function searchIndex(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEFAULT_SUGGESTIONS;

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { item: SearchItem; s: number }[] = [];
  for (const item of SEARCH_INDEX) {
    const s = score(item, tokens);
    if (s >= 0) scored.push({ item, s });
  }
  scored.sort((a, b) => b.s - a.s);

  // cap per group + overall, preserving score order
  const perGroup = new Map<SearchGroup, number>();
  const out: SearchItem[] = [];
  for (const { item } of scored) {
    if (out.length >= CAP_TOTAL) break;
    const n = perGroup.get(item.group) ?? 0;
    if (n >= CAP_PER_GROUP) continue;
    perGroup.set(item.group, n + 1);
    out.push(item);
  }
  return out;
}

/**
 * Uncapped, ranked search for the dedicated /search page. Returns every match
 * in relevance order; an empty query returns the whole index (so the results
 * page has content and its filters/sort stay usable).
 */
export function searchAll(query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...SEARCH_INDEX];

  const tokens = q.split(/\s+/).filter(Boolean);
  const scored: { item: SearchItem; s: number }[] = [];
  for (const item of SEARCH_INDEX) {
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
