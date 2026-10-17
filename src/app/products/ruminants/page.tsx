import type { Metadata } from "next";

// Same page as /ruminants (hero, intro, category grid), served under /products/
// like /products/poultry. Canonical points at /ruminants to avoid duplicates.
export { default } from "@/app/ruminants/page";

export const metadata: Metadata = {
  title: "Ruminant Solutions — Agriprom Pakistan | Dairy & Beef Cattle Nutrition",
  description:
    "Science-driven ruminant nutrition, health and comfort for dairy and beef cattle — rumen-protected amino acids, toxin binders, organic minerals, biosecurity, comfort, energy boosters and yeast culture.",
  alternates: { canonical: "https://agriprompakistan.com/ruminants" },
};
