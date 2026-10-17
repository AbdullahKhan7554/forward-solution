/**
 * Ruminant solution categories — drive the category grid and the
 * /products/ruminants/<id> category pages. `products` lists product slugs; each
 * product's data lives in product-detail/products.ts under ruminantProductKey().
 * `image` is optional; the card shows a labelled placeholder when absent.
 */
export const ruminantProductKey = (categoryId: string, slug: string) => `ruminants/${categoryId}/${slug}`;

export type RuminantCategory = {
  id: string;
  name: string;
  tagline: string; // short line for the nav card
  description: string; // section body
  products: string[]; // product slugs → /products/ruminants/<id>/<slug>
  image?: string;
};

export const RUMINANT_CATEGORIES: RuminantCategory[] = [
  {
    id: "rumen-protected-amino-acids",
    name: "Rumen Protected Amino Acids",
    tagline: "Bypass amino acids for milk & protein efficiency.",
    description:
      "Rumen-protected amino acids are designed to bypass rumen degradation and deliver essential amino acids like methionine and lysine directly to the small intestine, improving absorption, milk production, animal performance, and overall health.",
    products: ["matrixin", "matonin"],
    image: "/images/products/ruminants/Matrixin.jpg",
  },
  {
    id: "toxin-binders",
    name: "Toxin Binders",
    tagline: "Broad-spectrum mycotoxin management.",
    description:
      "Contaminated forage and feed threaten rumen function, liver health and milk quality. Our binders adsorb a broad spectrum of mycotoxins to protect intake, performance and food safety across the herd.",
    products: ["banebe", "elencofix-super"],
    image: "/images/products/ruminants/ElencoFix-Super-768x949.jpg",
  },
  {
    id: "organic-minerals",
    name: "Organic Minerals",
    tagline: "Chelated trace minerals for fertility & immunity.",
    description:
      "Amino-acid chelated trace minerals are highly bioavailable and resist rumen antagonism — supporting fertility, immunity, hoof integrity and udder health where inorganic salts fall short.",
    products: ["minlex-cattle"],
    image: "/images/products/ruminants/Minlex-Cattle-768x949.jpg",
  },
  {
    id: "biosecurity",
    name: "Biosecurity Solutions",
    tagline: "Hygiene and disinfection that protect herds.",
    description:
      "Disease prevention starts at the gate. Our disinfection, teat-care and hygiene programmes keep pathogens out and udder health in — reducing treatment cost and safeguarding milk quality.",
    products: ["cleanex", "germex"],
    image: "/images/products/ruminants/CleanEx-768x949.jpg",
  },
  {
    id: "comfort",
    name: "Comfort Solutions",
    tagline: "Cow comfort for productivity & longevity.",
    description:
      "Comfortable cows eat more, produce more and last longer. Our comfort and welfare solutions address heat stress, resting behaviour and hygiene to protect productivity and herd longevity.",
    products: ["puzzle-comfort-mat", "mammouth-mattress", "eva-horse-stable-mat", "standard-self-locks", "free-stall-systems"],
    image: "/images/products/ruminants/BaneBe-768x949.jpg",
  },
  {
    id: "energy-boosters",
    name: "Energy Boosters",
    tagline: "Rapid energy & metabolic support for transition cows.",
    description: "Rapid energy & metabolic support for transition cows.",
    products: ["energy-booster", "lactomin-boost"],
  },
  {
    id: "yeast-culture",
    name: "Yeast Culture",
    tagline: "Rumen health & immune support for maximum yield.",
    description: "Rumen health & immune support for maximum yield.",
    products: ["yeastics-r"],
  },
];
