"use client";

import { CatalogHero, type CatalogHeroFeature } from "@/components/products/CatalogHero";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const FEATURES: CatalogHeroFeature[] = [
  {
    label: "Gut Health",
    icon: (
      <svg {...iconProps}>
        <path d="M7 4c-2 2-2 5 0 6s5 1 6 3-1 5-4 5" />
        <path d="M14 4c2 0 4 2 3 4s-4 2-4 4 3 3 5 2" />
      </svg>
    ),
  },
  {
    label: "Better Immunity",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Feed Efficiency",
    icon: (
      <svg {...iconProps}>
        <path d="M4 19h16" />
        <path d="M5 15l4-4 3 3 6-6" />
        <path d="M14 8h4v4" />
      </svg>
    ),
  },
  {
    label: "Natural & Safe",
    icon: (
      <svg {...iconProps}>
        <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
        <path d="M5 19l8-8" />
      </svg>
    ),
  },
];

/**
 * POULTRY · SECTION 01 — HERO.
 *
 * Thin wrapper over the shared CatalogHero so it matches the ruminant hero,
 * plus the right-side feature list.
 */
export function PoultryHero() {
  return (
    <CatalogHero
      id="poultry"
      crumb="Poultry"
      eyebrow="Poultry Nutrition"
      title="Poultry"
      image={{ src: "/images/agriprom-images/poultry/front.jpeg", alt: "Poultry farm — Agriprom Pakistan nutritional technologies" }}
      description={
        <>
          Agriprom Pakistan delivers scientifically proven nutritional technologies that
          improve bird health, feed efficiency and farm profitability.
        </>
      }
      features={FEATURES}
    />
  );
}
