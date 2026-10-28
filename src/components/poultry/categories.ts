/**
 * Poultry category pages (/products/poultry/<id>). `categories` lists the
 * products.category values each page shows; a page can group several.
 * Categories saved in the admin that aren't listed here get a generic page.
 */
export type PoultryCategory = {
  id: string;
  categories: string[];
  /** Preloader caption / aria label suffix. */
  label: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  title: string;
  description: string;
  /** product slugs kept off the listing (their pages still exist) */
  unlisted?: string[];
};

export const POULTRY_CATEGORIES: PoultryCategory[] = [
  {
    id: "enzymes",
    categories: ["Enzymes"],
    label: "Poultry Enzymes",
    eyebrow: "Poultry · Enzymes",
    titleTop: "Poultry",
    titleBottom: "Enzymes",
    intro:
      "Scientifically proven feed enzymes that unlock more nutrition from every gram of feed — improving digestibility, gut health and performance across the flock.",
    title: "Poultry Enzymes — Agriprom Pakistan | Feed Enzyme Technologies",
    description:
      "Explore Agriprom Pakistan's poultry enzyme portfolio — KEMZYME® Poultry, MANNAGEST™, XYGEST™ HTX and PHYTINGEST™ 10 G & 20 G (Phytase) — for better digestibility, feed efficiency and performance.",
    // legacy duplicate of corgest-m (same product); its URL stays live
    unlisted: ["corgest-m-mannanase"],
  },
  {
    id: "organic-acids",
    categories: ["Organic Acids (SCFA)", "Organic Acids"],
    label: "Poultry Organic Acids",
    eyebrow: "Poultry · Organic Acids (SCFA)",
    titleTop: "Organic",
    titleBottom: "Acids",
    intro:
      "Short-chain fatty acid technologies that lower gut pH, strengthen intestinal integrity and improve feed efficiency across the flock.",
    title: "Poultry Organic Acids (SCFA) — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry organic acid (SCFA) range — including ProPhorce™ SR 130 esterified butyric acid — for gut integrity, immunity and feed efficiency.",
  },
  {
    id: "toxin-binders",
    categories: ["Toxin Binders"],
    label: "Poultry Toxin Binders",
    eyebrow: "Poultry · Toxin Binders",
    titleTop: "Toxin",
    titleBottom: "Binders",
    intro: "Broad-spectrum mycotoxin management that protects feed quality, liver health and flock performance.",
    title: "Poultry Toxin Binders — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry toxin binder range — ElencoFix-Super (algae-based) and PROBOND (clay-based) — for broad-spectrum mycotoxin management and feed safety.",
  },
  {
    id: "antioxidants",
    categories: ["Antioxidants"],
    label: "Poultry Antioxidants",
    eyebrow: "Poultry · Antioxidants",
    titleTop: "Feed",
    titleBottom: "Antioxidants",
    intro: "Antioxidant technologies that prevent oxidation, preserve nutrients and keep feed stable from mill to feeder.",
    title: "Poultry Antioxidants — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry antioxidant range — including Compound Antioxidant (EQ + BHT) — to protect fat-soluble vitamins, extend feed shelf life and preserve nutrients.",
  },
  {
    id: "emulsifier",
    categories: ["Emulsifier"],
    label: "Poultry Emulsifiers",
    eyebrow: "Poultry · Emulsifier",
    titleTop: "Feed",
    titleBottom: "Emulsifiers",
    intro:
      "Emulsifier technologies that improve fat emulsification, lipid digestion and energy utilization for stronger performance.",
    title: "Poultry Emulsifiers — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry emulsifier range — including LysoLip lysophospholipid emulsifier — for better fat digestion, gut health and feed efficiency.",
  },
  {
    id: "bile-acids",
    categories: ["Bile Acids"],
    label: "Poultry Bile Acids",
    eyebrow: "Poultry · Bile Acids",
    titleTop: "Bile",
    titleBottom: "Acids",
    intro:
      "Bile acid technologies that improve fat emulsification, lipid digestion, liver health and energy utilization.",
    title: "Poultry Bile Acids — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry bile acid range for improved fat emulsification, lipid digestion, liver health and feed efficiency.",
  },
  {
    id: "organic-minerals",
    categories: ["Organic Minerals"],
    label: "Poultry Organic Minerals",
    eyebrow: "Poultry · Organic Minerals",
    titleTop: "Organic",
    titleBottom: "Minerals",
    intro:
      "Amino-acid chelated (biochelated) trace minerals with high bioavailability — for better absorption, immunity and productivity.",
    title: "Poultry Organic Minerals — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry organic mineral range — including Minlex Poultry biochelated trace minerals — for immunity, growth, skeletal development and feed efficiency.",
  },
  {
    id: "alternative-protein",
    categories: ["Alternative Protein"],
    label: "Alternative Protein",
    eyebrow: "Poultry · Alternative Protein",
    titleTop: "Alternative",
    titleBottom: "Protein",
    intro:
      "Sustainable, highly digestible protein sources that support growth performance and reduce reliance on conventional feed proteins.",
    title: "Poultry Alternative Protein — Agriprom Pakistan",
    description:
      "Agriprom Pakistan's poultry alternative protein range — sustainable, highly digestible protein sources that reduce reliance on conventional feed proteins.",
  },
  {
    id: "probiotics",
    categories: ["Probiotics"],
    label: "Poultry Probiotics",
    eyebrow: "Poultry · Probiotics",
    titleTop: "Poultry",
    titleBottom: "Probiotics",
    intro: "Gut health that fuels performance.",
    title: "Poultry Probiotics — Agriprom Pakistan",
    description: "Gut health that fuels performance.",
  },
  {
    id: "fly-control",
    categories: ["Fly Control"],
    label: "Poultry Fly Control",
    eyebrow: "Poultry · Fly Control",
    titleTop: "Fly",
    titleBottom: "Control",
    intro: "Break the fly cycle at the source.",
    title: "Poultry Fly Control — Agriprom Pakistan",
    description: "Break the fly cycle at the source.",
  },
  {
    id: "feed-pigment",
    categories: ["Feed Pigment"],
    label: "Poultry Feed Pigment",
    eyebrow: "Poultry · Feed Pigment",
    titleTop: "Feed",
    titleBottom: "Pigment",
    intro: "Consistent color without compromise",
    title: "Poultry Feed Pigment — Agriprom Pakistan",
    description: "Consistent color without compromise",
  },
  {
    id: "feed-hygienizer",
    categories: ["Feed Hygienizer"],
    label: "Poultry Feed Hygienizer",
    eyebrow: "Poultry · Feed Hygienizer",
    titleTop: "Feed",
    titleBottom: "Hygienizer",
    intro: "Fresher feed, fewer toxin risks",
    title: "Poultry Feed Hygienizer — Agriprom Pakistan",
    description: "Fresher feed, fewer toxin risks",
  },
  {
    id: "phytogenic-anticoccidials",
    categories: ["Phytogenic Anticoccidials"],
    label: "Poultry Phytogenic Anticoccidials",
    eyebrow: "Poultry · Phytogenic Anticoccidials",
    titleTop: "Phytogenic",
    titleBottom: "Anticoccidials",
    intro: "Plant-powered protection against coccidiosis.",
    title: "Poultry Phytogenic Anticoccidials — Agriprom Pakistan",
    description: "Plant-powered protection against coccidiosis.",
  },
];

/** Product pages in these categories live at /products/poultry/<slug>; the rest at /products/poultry/<category>/<slug>. */
export const FLAT_POULTRY_CATEGORIES = new Set(["Enzymes", "Toxin Binders", "Organic Acids"]);
