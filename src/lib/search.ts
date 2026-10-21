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

const PRODUCTS: SearchItem[] = [
  { id: "prod-prophorce", title: "ProPhorce™ SR 130", group: "Products", category: "Organic Acids (SCFA)", href: "/products/poultry/organic-acids-scfa/prophorce-sr130", description: "Esterified tributyrin for gut health and performance.", keywords: "butyric tributyrin" },
  { id: "prod-anta-mix-me", title: "Anta®Mix ME", group: "Products", category: "Organic Acids", href: "/products/poultry/anta-mix-me", description: "Acid complex with microencapsulated acids and essential oils, for poultry gut health and performance." },
  { id: "prod-compound-enzyme", title: "KEMZYME® Poultry", group: "Products", category: "Enzymes", href: "/products/poultry/compound-enzyme-nsp", description: "Multi-enzyme complex that unlocks trapped nutrients." },
  { id: "prod-xylanase", title: "XYGEST™ HTX", group: "Products", category: "Enzymes", href: "/products/poultry/xylanase", description: "Targets arabinoxylans to raise feed efficiency." },
  { id: "prod-phytingest", title: "PHYTINGEST™ 10 G & 20 G (Phytase)", group: "Products", category: "Enzymes", href: "/products/poultry/phytingest", description: "Releases bound phosphorus from plant phytate." },
  { id: "prod-corgest", title: "MANNAGEST™", group: "Products", category: "Enzymes", href: "/products/poultry/corgest-m-mannanase", description: "Mannanase for gut integrity and immunity." },
  { id: "prod-elencofix", title: "ElencoFix-Super", group: "Products", category: "Toxin Binders", href: "/products/poultry/elencofix-super", description: "Broad-spectrum mycotoxin binder." },
  { id: "prod-probond", title: "PROBOND", group: "Products", category: "Toxin Binders", href: "/products/poultry/probond", description: "Advanced toxin adsorption technology." },
  { id: "prod-prosid-tb-207", title: "ProSid™ TB 207", group: "Products", category: "Toxin Binders", href: "/products/poultry/prosid-tb-207", description: "Multi-functional mycotoxin binder with phytogenics and calcium propionate." },
  { id: "prod-compound-antioxidant", title: "Compound Antioxidant", group: "Products", category: "Antioxidants", href: "/products/poultry/antioxidants/compound-antioxidant", description: "Protects feed and fats from oxidation." },
  { id: "prod-lysolip", title: "LysoLip", group: "Products", category: "Emulsifiers", href: "/products/poultry/emulsifier/lysolip", description: "Lyso-phospholipid emulsifier for energy uptake." },
  { id: "prod-bilepro", title: "BilePro", group: "Products", category: "Bile Acids", href: "/products/poultry/bile-acids/bilepro", description: "Bile acid additive for fat digestion and liver health." },
  { id: "prod-minlex", title: "Minlex Poultry", group: "Products", category: "Organic Minerals", href: "/products/poultry/organic-minerals/minlex-poultry", description: "Chelated organic trace minerals for poultry." },
  { id: "prod-alterion-ne", title: "Alterion® NE", group: "Products", category: "Probiotics", href: "/products/poultry/probiotics/alterion-ne", description: "Bacillus subtilis probiotic for gut health and poultry performance." },
  { id: "prod-antifly", title: "Antifly", group: "Products", category: "Fly Control", href: "/products/poultry/fly-control/antifly", description: "Poultry feed premix for fly control through larvae growth regulation." },
  { id: "prod-canthaxanthin-lutein", title: "Canthaxanthin & Lutein Feed Pigment", group: "Products", category: "Feed Pigment", href: "/products/poultry/feed-pigment/canthaxanthin-lutein", description: "Red and yellow carotenoid pigments for egg yolk and broiler skin colour." },
  { id: "prod-moldcid", title: "MoldCid", group: "Products", category: "Feed Hygienizer", href: "/products/poultry/feed-hygienizer/moldcid", description: "Propionic acid–based feed preservative against mold and spoilage." },
  { id: "prod-ruminant-matrixin", title: "MATRIXIN", group: "Products", category: "Rumen Protected Amino Acids", href: "/products/ruminants/rumen-protected-amino-acids/matrixin", description: "RP Lysine", keywords: "ruminant cattle" },
  { id: "prod-ruminant-matonin", title: "MATONIN", group: "Products", category: "Rumen Protected Amino Acids", href: "/products/ruminants/rumen-protected-amino-acids/matonin", description: "RP Methionine", keywords: "ruminant cattle" },
  { id: "prod-ruminant-banebe", title: "BaneBe", group: "Products", category: "Toxin Binders", href: "/products/ruminants/toxin-binders/banebe", description: "Toxin Binder", keywords: "ruminant cattle" },
  { id: "prod-ruminant-elencofix-super", title: "ElencoFix-Super", group: "Products", category: "Toxin Binders", href: "/products/ruminants/toxin-binders/elencofix-super", description: "Toxin Binder", keywords: "ruminant cattle" },
  { id: "prod-ruminant-minlex-cattle", title: "Minlex Cattle", group: "Products", category: "Organic Minerals", href: "/products/ruminants/organic-minerals/minlex-cattle", description: "Organic Trace Minerals", keywords: "ruminant cattle" },
  { id: "prod-ruminant-cleanex", title: "CLEANEX", group: "Products", category: "Biosecurity Solutions", href: "/products/ruminants/biosecurity/cleanex", description: "Biosecurity Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-germex", title: "GERMEX", group: "Products", category: "Biosecurity Solutions", href: "/products/ruminants/biosecurity/germex", description: "Biosecurity Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-puzzle-comfort-mat", title: "Puzzle Comfort Mat", group: "Products", category: "Comfort Solutions", href: "/products/ruminants/comfort/puzzle-comfort-mat", description: "Comfort Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-mammouth-mattress", title: "Mammouth Mattress", group: "Products", category: "Comfort Solutions", href: "/products/ruminants/comfort/mammouth-mattress", description: "Comfort Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-eva-horse-stable-mat", title: "EVA Horse Stable Mat", group: "Products", category: "Comfort Solutions", href: "/products/ruminants/comfort/eva-horse-stable-mat", description: "Comfort Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-standard-self-locks", title: "Standard Self Locks", group: "Products", category: "Comfort Solutions", href: "/products/ruminants/comfort/standard-self-locks", description: "Livestock Management", keywords: "ruminant cattle" },
  { id: "prod-ruminant-free-stall-systems", title: "Free Stall Systems", group: "Products", category: "Comfort Solutions", href: "/products/ruminants/comfort/free-stall-systems", description: "Housing Solution", keywords: "ruminant cattle" },
  { id: "prod-ruminant-energy-booster", title: "ENERGY BOOSTER", group: "Products", category: "Energy Boosters", href: "/products/ruminants/energy-boosters/energy-booster", description: "FRESH COW ENERGY", keywords: "ruminant cattle" },
  { id: "prod-ruminant-lactomin-boost", title: "LACTOMIN BOOST", group: "Products", category: "Energy Boosters", href: "/products/ruminants/energy-boosters/lactomin-boost", description: "ONE PREMIX - FOR LACTATION, FATTENING & GROWTH", keywords: "ruminant cattle" },
  { id: "prod-ruminant-yeastics-r", title: "Yeastics-R", group: "Products", category: "Yeast Culture", href: "/products/ruminants/yeast-culture/yeastics-r", description: "HIGH POLYSACCHARIDE TRADITIONAL CHINESE MEDICINE YEAST CULTURE", keywords: "ruminant cattle" },
  { id: "prod-coxield", title: "COXIELD", group: "Products", category: "Phytogenic Anticoccidials", href: "/products/poultry/phytogenic-anticoccidials/coxield", description: "Phytogenic anticoccidial with three modes of action." },
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
  PRODUCTS[0], // ProPhorce™ SR 130
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
