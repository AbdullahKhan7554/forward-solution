/**
 * Ruminant solution categories — shared by the Scene 03 navigation cards and the
 * Scene 04 cinematic sections (nav cards anchor-link to each section id).
 *
 * Product lists are representative category contents (no invented brand SKUs);
 * `image` uses a relevant photo where one exists, otherwise the procedural
 * LabPlate (undefined) which reads as premium science photography.
 */
export type RuminantCategory = {
  id: string;
  name: string;
  tagline: string; // short line for the nav card
  description: string; // section body
  products: string[];
  image?: string;
};

export const RUMINANT_CATEGORIES: RuminantCategory[] = [
  {
    id: "rumen-protected-amino-acids",
    name: "Rumen Protected Amino Acids",
    tagline: "Bypass amino acids for milk & protein efficiency.",
    description:
      "Rumen-protected amino acids are designed to bypass rumen degradation and deliver essential amino acids like methionine and lysine directly to the small intestine, improving absorption, milk production, animal performance, and overall health.",
    products: ["MATRIXIN (RP Lysine)", "MATONIN (RP Methionine)"],
    image: "/images/products/ruminants/Matrixin.jpg",
  },
  {
    id: "toxin-binders",
    name: "Toxin Binders",
    tagline: "Broad-spectrum mycotoxin management.",
    description:
      "Contaminated forage and feed threaten rumen function, liver health and milk quality. Our binders adsorb a broad spectrum of mycotoxins to protect intake, performance and food safety across the herd.",
    products: ["Broad-Spectrum Toxin Binder", "Clay-Based Toxin Binder"],
    image: "/images/products/ruminants/ElencoFix-Super-768x949.jpg",
  },
  {
    id: "organic-minerals",
    name: "Organic Minerals",
    tagline: "Chelated trace minerals for fertility & immunity.",
    description:
      "Amino-acid chelated trace minerals are highly bioavailable and resist rumen antagonism — supporting fertility, immunity, hoof integrity and udder health where inorganic salts fall short.",
    products: ["Chelated Zinc", "Chelated Copper", "Chelated Manganese", "Selenium Yeast"],
    image: "/images/products/ruminants/Minlex-Cattle-768x949.jpg",
  },
  {
    id: "vaccines",
    name: "Vaccines",
    tagline: "Globally-qualified preventive herd health.",
    description:
      "Preventive vaccination is the foundation of herd health. Agriprom brings globally-qualified vaccines and cold-chain reliability to protect cattle against the diseases that cost most.",
    products: ["FMD Vaccine", "HS Vaccine", "Clostridial Vaccine"],
    image: "/images/products/ruminants/Supravac-10-768x949.jpg",
  },
  {
    id: "biosecurity",
    name: "Biosecurity Solutions",
    tagline: "Hygiene and disinfection that protect herds.",
    description:
      "Disease prevention starts at the gate. Our disinfection, teat-care and hygiene programmes keep pathogens out and udder health in — reducing treatment cost and safeguarding milk quality.",
    products: ["Farm Disinfectants", "Teat Dips", "Hygiene Programmes"],
    image: "/images/products/ruminants/CleanEx-768x949.jpg",
  },
  {
    id: "comfort",
    name: "Comfort Solutions",
    tagline: "Cow comfort for productivity & longevity.",
    description:
      "Comfortable cows eat more, produce more and last longer. Our comfort and welfare solutions address heat stress, resting behaviour and hygiene to protect productivity and herd longevity.",
    products: ["Cooling Solutions", "Cubicle Comfort", "Bedding Conditioners"],
    image: "/images/products/ruminants/BaneBe-768x949.jpg",
  },
];
