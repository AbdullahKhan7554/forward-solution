"use client";

import { CatalogHero } from "@/components/products/CatalogHero";

/**
 * POULTRY · SECTION 01 — HERO.
 *
 * Thin wrapper over the shared CatalogHero so it matches the ruminant hero.
 */
export function PoultryHero() {
  return (
    <CatalogHero
      id="poultry"
      crumb="Poultry"
      eyebrow="Poultry Nutrition"
      title="Poultry"
      image={{ src: "/images/agriprom-images/poultry/front-blur.webp", alt: "Poultry farm — Agriprom Pakistan nutritional technologies" }}
      description={
        <>
          Agriprom Pakistan delivers scientifically proven nutritional technologies that
          improve bird health, feed efficiency and farm profitability.
        </>
      }
    />
  );
}
