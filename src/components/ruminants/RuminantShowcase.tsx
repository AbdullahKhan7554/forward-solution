"use client";

import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { ProductCompact } from "@/components/product-detail/ProductCompact";

/**
 * RuminantShowcase — a single ruminant product inside its category section,
 * rendered with the shared ProductCompact layout (same as poultry products).
 */
export type RuminantProduct = {
  name: string;
  type: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  benefits: string[];
  applications: string[];
};

export function RuminantShowcase({ product }: { product: RuminantProduct; index?: number }) {
  return (
    <ProductCompact
      product={{
        name: product.name,
        tagline: product.type,
        intro: product.description,
        image: (
          <ProductMedia
            label={product.name}
            alt={`${product.name} — ${product.type}, Agriprom Pakistan`}
            src={product.image}
            className="h-full w-full"
          />
        ),
        specs: product.specs.map((s) => ({ label: s.label, values: [s.value] })),
        benefits: product.benefits,
        applications: product.applications,
      }}
      cta={{ primaryLabel: "Contact Our Experts" }}
    />
  );
}
