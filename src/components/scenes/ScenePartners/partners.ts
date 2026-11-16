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
 * brand logos in /public/partners/new.
 */
export const partners: Partner[] = [
  { name: "Adisseo", logo: "/partners/new/adisseo.webp", description: "Animal Nutrition & Amino Acids", weight: "feature" },
  { name: "CJ Bio", logo: "/partners/new/cj-bio.webp", description: "Bioscience & Amino Acids", weight: "standard" },
  { name: "Perstorp", logo: "/partners/new/perstorp.webp", description: "Feed Additives & Organic Acids", weight: "offset" },
  { name: "Bornsun", logo: "/partners/new/bornsun.webp", description: "Feed Enzymes", weight: "standard" },
  { name: "Wellbe", logo: "/partners/new/wellbe.webp", description: "Animal Health Solutions", weight: "feature" },
  { name: "Dr. Eckel", logo: "/partners/new/dr-eckel.webp", description: "Plant-Based Feed Additives", weight: "offset" },
  { name: "Morningbio", logo: "/partners/morningbio.webp", description: "Feed Additives", weight: "standard" },
  { name: "Wellgreen", logo: "/partners/new/wellgreen.webp", description: "Feed Additives", weight: "feature" },
  { name: "Solinkon", logo: "/partners/new/solinkon.webp", description: "Animal Nutrition", weight: "standard" },
  { name: "Vegamax", logo: "/partners/new/vegamax.webp", description: "Feed Additives", weight: "offset" },
  { name: "Kemin", logo: "/partners/new/kemin.webp", description: "Animal Nutrition & Health", weight: "feature" },
];
