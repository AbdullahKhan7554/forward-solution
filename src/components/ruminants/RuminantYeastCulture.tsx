"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.07 — YEAST CULTURE.
 *
 * A cinematic header, then the products as full premium RuminantShowcase
 * presentations (alternating layout). Reuses RevealText, RuminantShowcase, GSAP.
 */

const PRODUCTS: RuminantProduct[] = [
  {
    name: "Yeastics-R",
    type: "HIGH POLYSACCHARIDE TRADITIONAL CHINESE MEDICINE YEAST CULTURE",
    image: "",
    description:
      "High polysaccharide traditional Chinese medicine yeast culture using Astragalus extract as a fermentation substrate, designed to regulate rumen health and improve production efficiency.",
    specs: [
      { label: "Category", value: "Yeast Culture" },
      { label: "Species", value: "Dairy Cows, Beef Cattle, Calves, Sheep, Goat" },
      { label: "Form", value: "Uniform color, no caking" },
      { label: "Packaging", value: "25 KG Bag" },
    ],
    benefits: [
      "Regulates rumen health and improves rumen fermentation parameters",
      "Enhances immunity and boosts disease and stress resistance through Astragalus polysaccharides",
      "Improves milk quality (milk fat, protein, and lower somatic cell counts)",
      "Boosts growth performance in beef cattle and livestock productivity",
    ],
    applications: ["Dairy Farms", "Commercial Farms", "Dairy Cows", "Beef Cattle", "Calves", "Sheep & Goats"],
  },
];

export function RuminantYeastCulture() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-yc-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-yc-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="yeast-culture" ref={rootRef} aria-labelledby="yc-heading" className="relative scroll-mt-24 overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(72% 55% at 22% 6%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <div data-yc-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">07</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Yeast Culture</span>
        </div>
        <h2 id="yc-heading" className="max-w-3xl font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Yeast" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="Culture" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <p data-yc-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
          Rumen health &amp; immune support for maximum yield.
        </p>

        {PRODUCTS.length > 0 && (
          <div className="mt-[12vh] flex flex-col gap-[14vh]">
            {PRODUCTS.map((p, i) => (
              <RuminantShowcase key={p.name} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
