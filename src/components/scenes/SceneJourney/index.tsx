"use client";

import { useRef } from "react";
import { ChapterLayer } from "./ChapterLayer";
import { useJourneyChoreography } from "./useJourneyChoreography";

/**
 * SCENE 06 - PRODUCT JOURNEY.
 *
 * A documentary walk through Agriprom's five existing product categories, each
 * a full-viewport museum chapter, stacked as sequential vertical storytelling. Reuses MaskedReveal, RevealText, LabPlate + established GSAP.
 *
 * Content: the four existing categories only. No invented products / SKUs.
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
    name: "Bio Security",
    description: "Disease prevention and hygiene that keep herds protected.",
    side: "right",
    imageSrc: "/biosecurity.jpg",
  },
  {
    name: "Nutrition",
    description:
      "Research-driven nutrition that improves feed conversion and productivity.",
    side: "left",
    imageSrc: "/nutrition.jpg",
  },
];

export function SceneJourney() {
  const rootRef = useRef<HTMLElement>(null);
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
        />
      ))}
    </section>
  );
}
