"use client";

import { CatalogHero } from "@/components/products/CatalogHero";

/**
 * RUMINANTS · SCENE 01 — CINEMATIC HERO.
 *
 * Thin wrapper over the shared CatalogHero (full-bleed dairy-farm image, glass
 * breadcrumb, oversized headline on the intro clock) so it stays identical to
 * the poultry hero.
 */
export function RuminantHero() {
  return (
    <CatalogHero
      id="ruminant"
      crumb="Ruminants"
      eyebrow="Ruminant Nutrition"
      title="Ruminant"
      image={{ src: "/reuminant.jpg", alt: "Dairy and beef cattle — Agriprom Pakistan ruminant nutrition" }}
      description={
        <>
          Science-driven nutrition, health and comfort for dairy and beef cattle — engineered to
          lift milk yield, fertility, feed efficiency and herd longevity.
        </>
      }
    />
  );
}
