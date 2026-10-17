"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.03 — ORGANIC MINERALS · MINLEX CATTLE.
 *
 * Section slate, then the product in the shared ProductCompact layout
 * (via RuminantShowcase), same as every other ruminant and poultry product.
 */

const PRODUCT: RuminantProduct = {
  name: "MINLEX CATTLE",
  type: "Organic Trace Minerals",
  image: "/images/products/ruminants/Minlex-Cattle-768x949.jpg",
  description:
    "MINLEX CATTLE is a premium organic trace mineral solution formulated to improve mineral bioavailability, strengthen immunity, support reproductive performance, and enhance overall productivity in dairy and beef cattle. Its highly bioavailable organic mineral complexes ensure superior absorption and optimal animal performance.",
  specs: [
    { label: "Category", value: "Organic Trace Minerals" },
    { label: "Species", value: "Dairy & Beef Cattle" },
    { label: "Form", value: "Powder / Granules (Verify)" },
    { label: "Packaging", value: "25 KG Bag (Verify)" },
    { label: "Manufacturer", value: "Verify with Client" },
    { label: "Country of Origin", value: "Verify with Client" },
  ],
  benefits: [
    "Superior mineral absorption",
    "Supports stronger immunity",
    "Improves reproductive performance",
    "Enhances milk production and growth",
    "Better hoof and bone development",
    "Improves feed efficiency",
    "Reduces mineral deficiencies",
  ],
  applications: [
    "Dairy Farms",
    "Beef Cattle Farms",
    "Commercial Livestock Operations",
    "Mineral Supplementation Programs",
    "High Performance Feeding Programs",
  ],
};

export function RuminantOrganicMinerals() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-mx-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-mx-fade]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="organic-minerals" ref={rootRef} aria-label="Organic Minerals" className="relative scroll-mt-24 overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <div data-mx-fade className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">03</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Organic Minerals</span>
        </div>
        <RuminantShowcase product={PRODUCT} />
      </div>
    </section>
  );
}
