"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.02 — TOXIN BINDERS.
 *
 * A cinematic header, then the products as full premium RuminantShowcase
 * presentations (alternating layout). Reuses RevealText, RuminantShowcase, GSAP.
 */

const PRODUCTS: RuminantProduct[] = [
  {
    name: "BaneBe",
    type: "Toxin Binder",
    image: "/images/products/ruminants/BaneBe-768x949.jpg",
    description:
      "Advanced mycotoxin binder formulated to reduce the harmful effects of feed-borne mycotoxins, supporting healthier livestock, improved feed efficiency, and optimal production performance.",
    specs: [
      { label: "Category", value: "Toxin Binder" },
      { label: "Species", value: "Ruminants" },
      { label: "Form", value: "Powder / Granules" },
      { label: "Packaging", value: "25 KG" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Binds harmful mycotoxins",
      "Improves feed quality",
      "Supports liver health",
      "Enhances immunity",
      "Increases productivity",
    ],
    applications: ["Dairy Farms", "Beef Cattle Farms", "Commercial Feed Mills", "Livestock Nutrition Programs"],
  },
  {
    name: "ELENCOFIX SUPER",
    type: "Toxin Binder",
    image: "/images/products/ruminants/ElencoFix-Super-768x949.jpg",
    description:
      "Premium broad-spectrum mycotoxin binder developed to protect livestock against multiple toxin challenges while maintaining animal performance and feed safety.",
    specs: [
      { label: "Category", value: "Toxin Binder" },
      { label: "Species", value: "Ruminants" },
      { label: "Form", value: "Powder" },
      { label: "Packaging", value: "25 KG" },
      { label: "Manufacturer", value: "Elanco" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Broad-spectrum toxin protection",
      "Supports digestive health",
      "Improves nutrient absorption",
      "Maintains production efficiency",
      "Reduces mycotoxin risks",
    ],
    applications: ["Dairy Farms", "Feed Manufacturing Plants", "Commercial Livestock Operations", "Nutrition Programs"],
  },
];

export function RuminantToxinBinders() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-tb-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-tb-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="toxin-binders" ref={rootRef} aria-labelledby="tb-heading" className="relative scroll-mt-24 overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(72% 55% at 22% 6%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <div data-tb-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">02</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Toxin Binders</span>
        </div>
        <h2 id="tb-heading" className="max-w-3xl font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Broad-Spectrum" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="Mycotoxin Protection" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <p data-tb-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
          Feed-borne mycotoxins silently erode intake, liver health and productivity. Our binders
          adsorb a broad spectrum of toxins to protect the herd, the feed and the bottom line.
        </p>

        <div className="mt-[12vh] flex flex-col gap-[14vh]">
          {PRODUCTS.map((p, i) => (
            <RuminantShowcase key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
