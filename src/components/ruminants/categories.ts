/**
 * Ruminant solution categories — drive the category grid and the
 * /products/ruminants/<id> category pages. `name` matches products.category;
 * the products themselves come from Supabase (lib/catalog.ts).
 * `image` is optional; the card shows a labelled placeholder when absent.
 */

export type RuminantCategory = {
  id: string;
  name: string;
  tagline: string; // short line for the nav card
  description: string; // section body
  image?: string;
};

export const RUMINANT_CATEGORIES: RuminantCategory[] = [
  {
    id: "rumen-protected-amino-acids",
    name: "Rumen Protected Amino Acids",
    tagline: "Bypass amino acids for milk & protein efficiency.",
    description:
      "Rumen-protected amino acids are designed to bypass rumen degradation and deliver essential amino acids like methionine and lysine directly to the small intestine, improving absorption, milk production, animal performance, and overall health.",
    image: "/images/agriprom-images/ruminants/rumen-protected-amino-acids.webp",
  },
  {
    id: "toxin-binders",
    name: "Toxin Binders",
    tagline: "Broad-spectrum mycotoxin management.",
    description:
      "Contaminated forage and feed threaten rumen function, liver health and milk quality. Our binders adsorb a broad spectrum of mycotoxins to protect intake, performance and food safety across the herd.",
    image: "/images/agriprom-images/ruminants/toxin-binders.webp",
  },
  {
    id: "organic-minerals",
    name: "Organic Minerals",
    tagline: "Chelated trace minerals for fertility & immunity.",
    description:
      "Amino-acid chelated trace minerals are highly bioavailable and resist rumen antagonism — supporting fertility, immunity, hoof integrity and udder health where inorganic salts fall short.",
    image: "/images/agriprom-images/ruminants/minerals.webp",
  },
  {
    id: "biosecurity",
    name: "Biosecurity Solutions",
    tagline: "Hygiene and disinfection that protect herds.",
    description:
      "Disease prevention starts at the gate. Our disinfection, teat-care and hygiene programmes keep pathogens out and udder health in — reducing treatment cost and safeguarding milk quality.",
    image: "/images/agriprom-images/ruminants/biosecurity-solutions.webp",
  },
  {
    id: "comfort",
    name: "Comfort Solutions",
    tagline: "Cow comfort for productivity & longevity.",
    description:
      "Comfortable cows eat more, produce more and last longer. Our comfort and welfare solutions address heat stress, resting behaviour and hygiene to protect productivity and herd longevity.",
    image: "/images/agriprom-images/ruminants/comfort.webp",
  },
  {
    id: "energy-boosters",
    name: "Energy Boosters",
    tagline: "Rapid energy & metabolic support for transition cows.",
    description: "Rapid energy & metabolic support for transition cows.",
    image: "/images/agriprom-images/ruminants/booster.webp",
  },
  {
    id: "yeast-culture",
    name: "Yeast Culture",
    tagline: "Rumen health & immune support for maximum yield.",
    description: "Rumen health & immune support for maximum yield.",
    image: "/images/agriprom-images/ruminants/yeast.webp",
  },
];

/** The .webp ruminant shots (comfort, energy) are shown whole — object-contain, never cropped. */
export const containRuminantImage = (src?: string) =>
  !!src &&
  (src.includes("/images/products/ruminants/") || src.includes("/images/agriprom-images/products/")) &&
  src.endsWith(".webp");
