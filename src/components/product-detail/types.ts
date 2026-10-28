/**
 * Product detail shape. One shape drives the shared ProductDetail template, so
 * every product reads as the same premium page. Rows come from the Supabase
 * products table (see lib/catalog.ts).
 */

export type SpecRow = { label: string; values: string[] };

export type ProductDetailData = {
  slug: string;
  /** which catalogue the product belongs to — drives back-links and CTA copy. Default "poultry". */
  catalog?: "poultry" | "ruminants";
  eyebrow: string; // e.g. "Poultry · Enzymes"
  name: string;
  intro: string; // hero scientific introduction
  overviewLead: string; // opening paragraph of the overview
  overviewPoints: string[]; // scientific bullet points
  benefits: string[];
  flow: string[]; // How It Works — ordered steps
  applications: string[];
  specs: SpecRow[];
  metaTitle: string;
  metaDescription: string;
  /** image treatment — "plate" (procedural LabPlate) or "placeholder" (drop-in). Default "plate". */
  media?: "plate" | "placeholder";
  /** gallery slot labels — defaults to Product / Packaging / Application. */
  gallery?: string[];
  /** optional scientific subtitle shown under the hero name. */
  subtitle?: string;
  /** when set, the Overview renders image-left / text-right with this placeholder label. */
  overviewImageLabel?: string;
  /** optional related products (same category); the section hides when absent. */
  related?: { name: string; blurb: string; href: string }[];
  /** optional final-CTA copy override (defaults to "Talk To Our Experts"). */
  cta?: {
    top: string;
    bottom: string;
    body: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  /** optional real image asset URLs. Overlaid on the
   *  placeholder when present; `gallery` aligns by index with the gallery labels. */
  assets?: { hero?: string; overview?: string; gallery?: string[] };
  /** optional download card labels — defaults to Brochure / Technical Sheet / MSDS. */
  downloads?: string[];
};
