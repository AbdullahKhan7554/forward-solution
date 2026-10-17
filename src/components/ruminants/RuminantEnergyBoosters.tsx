"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.06 — ENERGY BOOSTERS.
 *
 * A cinematic header, then the products as full premium RuminantShowcase
 * presentations (alternating layout). Reuses RevealText, RuminantShowcase, GSAP.
 */

const PRODUCTS: RuminantProduct[] = [
  {
    name: "Energy Booster",
    type: "FRESH COW ENERGY",
    image: "",
    description:
      "Oral energy drench of propylene glycol and glycerin, fortified with vitamins A, D3, E, and niacin. Developed for fresh cows around calving, it boosts energy levels, stimulates appetite and activity, and helps prevent nutritional problems such as ketosis.",
    specs: [
      { label: "Category", value: "Energy Booster" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Form", value: "Liquid" },
      { label: "Packaging", value: "5 Litre / Can (5 KG)" },
    ],
    benefits: [
      "Fast energy support from glucose precursors right after calving",
      "Stimulates appetite and feed intake during the transition period",
      "Supports cows showing symptoms of ketosis and limits the effects of fatty liver",
      "Supports milk production, immunity, and fertility in early lactation",
    ],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows", "Fresh Cows Around Calving"],
  },
  {
    name: "Lactomin Boost",
    type: "ONE PREMIX - FOR LACTATION, FATTENING & GROWTH",
    image: "",
    description:
      "Comprehensive vitamin and mineral premix formulated for dairy cows, lactation, fattening, and growth to meet daily nutritional requirements, regulate microflora, and enhance performance.",
    specs: [
      { label: "Category", value: "Energy Booster" },
      { label: "Species", value: "Dairy Cows, Dry Cows, Heifers, Fattening Animals" },
      { label: "Form", value: "Powder Premix" },
      { label: "Packaging", value: "25 Kg Per Bag" },
    ],
    benefits: [
      "Meets vitamin and mineral requirements of dairy cows",
      "Regulates rumen and intestinal microflora",
      "Increases milk yield and improves milk quality when used regularly",
      "Supports proper udder health and high-quality colostrum",
      "Reduces metabolic disorders such as milk fever, ketosis, and retained placenta",
      "Increases fertility by regulating heat and maintaining body condition during the dry period",
      "Improves muscle deposition, carcass quality, and strengthens immunity during fattening",
    ],
    applications: ["Dairy Farms", "Commercial Farms", "Lactating & Dry Cows", "Heifers", "Fattening Animals"],
  },
];

export function RuminantEnergyBoosters() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-eb-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-eb-fade]", {
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
    <section id="energy-boosters" ref={rootRef} aria-labelledby="eb-heading" className="relative scroll-mt-24 overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(72% 55% at 22% 6%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <div data-eb-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">06</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Energy Boosters</span>
        </div>
        <h2 id="eb-heading" className="max-w-3xl font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Energy" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="Boosters" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <p data-eb-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
          Rapid energy &amp; metabolic support for transition cows.
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
