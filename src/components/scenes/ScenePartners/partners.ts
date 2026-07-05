export type PartnerWeight = "feature" | "standard" | "offset";

export type Partner = {
  name: string;
  logo: string;
  description: string;
  weight: PartnerWeight;
};

/**
 * Data-driven partner list. Add a partner here and the editorial masonry
 * reflows automatically - no layout rework required. Logos are the official
 * brand PNGs in /public/partners (spaces URL-encoded).
 */
export const partners: Partner[] = [
  { name: "Evonik", logo: "/partners/Evonik.jpg", description: "Animal Nutrition & Amino Acids", weight: "feature" },
  { name: "CJ Bio", logo: "/partners/CJ%20Bio.jpg", description: "Bioscience & Amino Acids", weight: "standard" },
  { name: "Perstorp", logo: "/partners/Perstorp.jpg", description: "Feed Additives & Organic Acids", weight: "offset" },
  { name: "Vegamax", logo: "/partners/Vegamax.jpg", description: "Feed Additives", weight: "standard" },
  { name: "Wellbe", logo: "/partners/Well%20Be.jpg", description: "Animal Health Solutions", weight: "feature" },
  { name: "Better Pharma", logo: "/partners/Better%20Pharma.jpg", description: "Veterinary Pharmaceuticals", weight: "offset" },
  { name: "Dechra", logo: "/partners/Dechra.jpg", description: "Veterinary Pharmaceuticals", weight: "standard" },
  { name: "Elanco", logo: "/partners/Elanco.jpg", description: "Global Animal Health", weight: "feature" },
  { name: "Solinko", logo: "/partners/solinkon.jpg", description: "Animal Nutrition", weight: "standard" },
];
