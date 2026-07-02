"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.05 — BIOSECURITY.
 *
 * Educates first with a premium "Biosecurity Process" timeline (Clean →
 * Disinfect → Protect) — a drawing spine, glass step cards, connecting arrows,
 * GSAP scroll reveals — then presents the products (CleanEx, GermEx) as full
 * RuminantShowcase presentations (alternating layout). Reuses RuminantShowcase,
 * RevealText, GSAP; reduced-motion safe.
 *
 * NOTE: GermEx content below is derived from the process description as a
 * placeholder — replace with the client's official GermEx data when supplied.
 */

const PROCESS = [
  { n: "01", title: "Clean", body: "Use CleanEx to remove dirt, organic matter, and biofilm." },
  { n: "02", title: "Disinfect", body: "Apply GermEx to eliminate bacteria, viruses, fungi, and harmful pathogens." },
  { n: "03", title: "Protect", body: "Maintain a healthier, safer, and more productive livestock environment." },
];

const PRODUCTS: RuminantProduct[] = [
  {
    name: "CleanEx",
    type: "Biosecurity Solution",
    image: "/images/products/ruminants/CleanEx-768x949.jpg",
    description:
      "CleanEx is an advanced cleaning solution designed for livestock facilities and Clean-In-Place (CIP) systems. It removes organic residues and prepares equipment and housing areas for effective disinfection, supporting optimal farm biosecurity.",
    specs: [
      { label: "Category", value: "Biosecurity Solution" },
      { label: "Species", value: "Poultry, Dairy Cattle, Sheep & Goats" },
      { label: "Form", value: "Liquid Cleaner" },
      { label: "Packaging", value: "1L / 5L / 20L (Verify)" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Deep cleaning performance",
      "Removes organic deposits and biofilm",
      "Enhances disinfectant effectiveness",
      "Supports Clean-In-Place (CIP) systems",
      "Improves overall farm sanitation",
    ],
    applications: [
      "Dairy Processing Equipment",
      "Milking Systems",
      "Poultry Farms",
      "Livestock Facilities",
      "Water Lines",
      "Feed Equipment",
    ],
  },
  {
    // Derived placeholder — replace with official GermEx data.
    name: "GermEx",
    type: "Biosecurity Solution",
    image: "/images/products/ruminants/GremEx.jpg",
    description:
      "GermEx is a broad-spectrum disinfectant that eliminates bacteria, viruses, fungi and harmful pathogens across livestock facilities and equipment — the disinfection step that follows cleaning for complete farm biosecurity.",
    specs: [
      { label: "Category", value: "Biosecurity Solution" },
      { label: "Species", value: "Poultry, Dairy Cattle, Sheep & Goats" },
      { label: "Form", value: "Liquid Disinfectant" },
      { label: "Packaging", value: "1L / 5L / 20L (Verify)" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Broad-spectrum pathogen control",
      "Eliminates bacteria, viruses & fungi",
      "Most effective after CleanEx cleaning",
      "Reduces disease pressure on the farm",
      "Supports complete biosecurity protocols",
    ],
    applications: [
      "Poultry Farms",
      "Livestock Facilities",
      "Milking Systems",
      "Water Lines",
      "Feed Equipment",
      "Footbaths",
    ],
  },
];

export function RuminantBiosecurity() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-bio-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-bio-fade]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      // process spine draws as you descend
      gsap.set("[data-bio-fill]", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.to("[data-bio-fill]", {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: list, start: "top 78%", end: "bottom 82%", scrub: true },
      });

      gsap.set("[data-bio-step]", { autoAlpha: 0, y: 24, scale: 0.98 });
      ScrollTrigger.batch("[data-bio-step]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });
      gsap.set("[data-bio-arrow]", { autoAlpha: 0 });
      ScrollTrigger.batch("[data-bio-arrow]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.12, overwrite: true }),
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section id="biosecurity" ref={rootRef} aria-labelledby="bio-heading" className="relative scroll-mt-24 overflow-hidden bg-base">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(72% 55% at 22% 6%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "radial-gradient(rgba(0,100,193,0.05) 1.3px, transparent 1.3px)", backgroundSize: "32px 32px" }} />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* header */}
        <div data-bio-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">05</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Biosecurity</span>
        </div>
        <h2 id="bio-heading" className="max-w-3xl font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
          <RevealText text="A Proven Three-Step" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="Biosecurity Process" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <p data-bio-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
          Effective biosecurity is a sequence, not a single step. Clean first, disinfect second,
          and protect the herd — each stage makes the next one work.
        </p>

        {/* PROCESS TIMELINE */}
        <div ref={listRef} className="relative mx-auto mt-[12vh] flex max-w-xl flex-col items-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-neutral-200" />
            <div data-bio-fill className="absolute inset-0 will-change-transform" style={{ background: "linear-gradient(to bottom, #008A4B 0%, #0064C1 60%, #0064C1 100%)" }} />
          </div>

          {PROCESS.map((step, i) => (
            <div key={step.n} className="relative flex w-full flex-col items-center">
              <div data-bio-step className="relative z-raised w-full max-w-md">
                <div className="rounded-lg border border-white/70 bg-white/60 p-7 text-center shadow-glass backdrop-blur-xl backdrop-saturate-150 md:p-8">
                  <span className="font-sans text-caption tracking-[0.22em] text-accent-600">STEP {step.n}</span>
                  <h3 className="mt-2 font-display text-h3 font-medium text-neutral-900">{step.title}</h3>
                  <p className="mt-2 font-sans text-body text-neutral-600">{step.body}</p>
                </div>
              </div>
              {i < PROCESS.length - 1 && (
                <span data-bio-arrow aria-hidden="true" className="relative z-raised my-5 text-primary-600">
                  <svg width="16" height="26" viewBox="0 0 16 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1v20M2 15l6 6 6-6" /></svg>
                </span>
              )}
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="mt-[16vh]">
          <div data-bio-fade className="mb-[6vh] flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">The Products</span>
          </div>
          <div className="flex flex-col gap-[14vh]">
            {PRODUCTS.map((p, i) => (
              <RuminantShowcase key={p.name} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
