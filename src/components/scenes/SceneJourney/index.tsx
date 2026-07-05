"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ChapterLayer } from "./ChapterLayer";
import { useJourneyChoreography } from "./useJourneyChoreography";

/**
 * SCENE 06 - PRODUCT JOURNEY.
 *
 * A documentary walk through Agriprom's five existing product categories, each
 * a full-viewport museum chapter. Desktop + motion: sticky chapters that melt
 * (the next covers the previous on scroll) with a slow image push. Mobile /
 * reduced motion: sequential vertical storytelling. Enters from white, resolves
 * into white. Reuses MaskedReveal, RevealText, LabPlate + established GSAP.
 *
 * Content: the five existing categories only. No invented products / SKUs.
 */
const CHAPTERS: {
  name: string;
  description: string;
  side: "left" | "right";
  imageSrc?: string;
}[] = [
  {
    name: "Poultry",
    description: "Enhancing poultry nutrition, gut health and performance.",
    side: "right",
    imageSrc: "/poultry.jpg",
  },
  {
    name: "Ruminants",
    description: "Supporting better health, growth and performance.",
    side: "left",
    imageSrc: "/reuminant.jpg",
  },
  {
    name: "Companion Animals",
    description: "Helping companion animals live longer, healthier lives.",
    side: "right",
    imageSrc: "/animal%20comapnion.jpg",
  },
  {
    name: "Bio Security",
    description: "Disease prevention and hygiene that keep herds protected.",
    side: "left",
    imageSrc: "/biosecurity.jpg",
  },
  {
    name: "Nutrition",
    description:
      "Research-driven nutrition that improves feed conversion and productivity.",
    side: "right",
    imageSrc: "/nutrition.jpg",
  },
];

export function SceneJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  useJourneyChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-label="Product Journey — Agriprom Pakistan animal health ecosystem"
      className="relative bg-pure"
    >
      {CHAPTERS.map((chapter, i) => (
        <ChapterLayer
          key={chapter.name}
          index={i}
          name={chapter.name}
          description={chapter.description}
          imageSrc={chapter.imageSrc}
          side={chapter.side}
          sticky={!reduced}
        />
      ))}

      {/* large white breathing space - the final chapter disappears into light */}
      <div aria-hidden="true" className="relative h-[70svh] w-full bg-pure" />
    </section>
  );
}
