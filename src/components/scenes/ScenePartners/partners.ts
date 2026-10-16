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
  { name: "Adisseo", logo: "/partners/Adisseo_logo_a3426a41f5.png", description: "Animal Nutrition & Amino Acids", weight: "feature" },
  { name: "CJ Bio", logo: "/partners/CJ%20BIO%20LOGO.png", description: "Bioscience & Amino Acids", weight: "standard" },
  { name: "Perstorp", logo: "/partners/perstorp.png", description: "Feed Additives & Organic Acids", weight: "offset" },
  { name: "Bornsun", logo: "/partners/bornsun.jpg.jpeg", description: "Feed Enzymes", weight: "standard" },
  { name: "Wellbe", logo: "/partners/Well%20Be.jpg", description: "Animal Health Solutions", weight: "feature" },
  { name: "Dr. Eckel", logo: "/partners/Gemini_Generated_Image_oof2v0oof2v0oof2.jpg.jpeg", description: "Plant-Based Feed Additives", weight: "offset" },
  { name: "Morningbio", logo: "/partners/morningbio.jpeg", description: "Feed Additives", weight: "standard" },
  { name: "Wellgreen", logo: "/partners/Gemini_Generated_Image_u7945ou7945ou794.jpg.jpeg", description: "Feed Additives", weight: "feature" },
  { name: "Solinkon", logo: "/partners/Picture4.png", description: "Animal Nutrition", weight: "standard" },
];
