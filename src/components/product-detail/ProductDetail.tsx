"use client";

import { IntroProvider } from "@/components/providers/IntroProvider";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { Navbar } from "@/components/navbar/Navbar";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Footer } from "@/components/layout/Footer";
import { ProductMedia } from "./ProductMedia";
import { ProductCompact } from "./ProductCompact";
import type { ProductDetailData } from "./products";

/** Image slot — LabPlate procedural art, or a drop-in placeholder when the
 *  product opts into `media: "placeholder"`. Same size/mask either way. */
function SlotImage({
  media,
  alt,
  label,
  sizes,
  src,
}: {
  media: ProductDetailData["media"];
  alt: string;
  label: string;
  sizes?: string;
  src?: string;
}) {
  if (media === "placeholder") {
    return <ProductMedia label={label} alt={alt} src={src} sizes={sizes} className="h-full w-full" />;
  }
  return <LabPlate src={src} alt={alt} />;
}

/**
 * PRODUCT DETAIL — the poultry and ruminant product page, rendered with the shared
 * ProductCompact layout (same as ruminant products). Only hero, specs,
 * benefits, applications and CTA are rendered; overview, flow, gallery,
 * downloads and related data stay in products.ts but are not shown.
 */
export function ProductDetail({ data }: { data: ProductDetailData }) {
  const ruminants = data.catalog === "ruminants";
  return (
    <IntroProvider>
      <Preloader caption={`N°01 — ${data.name}`} ariaLabel={`Entering Agriprom Pakistan — ${data.name}`} />
      <Navbar />
      <main className="bg-base">
        <ProductCompact
          as="h1"
          className="mx-auto w-full max-w-container px-6 pb-16 md:pb-24 pt-[22vh] md:px-12 xl:px-20"
          eyebrow={
            <a href={ruminants ? "/products/ruminants" : "/products/poultry"} className="transition-colors hover:text-primary-700">
              {data.eyebrow}
            </a>
          }
          product={{
            name: data.name,
            tagline: data.subtitle,
            intro: data.intro,
            image: (
              <SlotImage
                media={data.media}
                label="Hero Product Image"
                alt={`${data.name} — Agriprom Pakistan ${ruminants ? "ruminant" : "poultry"} solution`}
                src={data.assets?.hero}
              />
            ),
            specs: data.specs,
            benefits: data.benefits,
            applications: data.applications,
          }}
          cta={ruminants ? { primaryLabel: "Contact Our Experts" } : {
            heading: `${data.cta?.top ?? "Talk To Our"} ${data.cta?.bottom ?? "Experts"}`,
            body: data.cta?.body ?? `Get tailored recommendations for ${data.name} built around your birds, your feed and your goals.`,
            primaryLabel: data.cta?.primaryLabel ?? "Talk To Our Experts",
            secondaryLabel: data.cta?.secondaryLabel,
            secondaryHref: data.cta?.secondaryLabel ? data.cta.secondaryHref ?? "/products/poultry" : undefined,
          }}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
