"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.01 — RUMEN PROTECTED AMINO ACIDS (bespoke storytelling).
 *
 * A three-beat narrative beside a luxury layered image (masked, parallaxing
 * plate + floating glass highlight + sheen), then the products as full premium
 * RuminantShowcase presentations (alternating layout, Technical Information +
 * Key Benefits panels, applications pills, dual CTAs). Reuses MaskedReveal,
 * RevealText, LabPlate, GlassCard, the GSAP clock and every token.
 */

const PRODUCTS: RuminantProduct[] = [
  {
    name: "MATRIXIN",
    type: "RP Lysine",
    image: "/images/products/ruminants/Matrixin.jpg",
    description:
      "Premium rumen protected lysine designed to maximize amino acid availability and improve milk production.",
    specs: [
      { label: "Category", value: "RP Lysine" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Form", value: "Granules" },
      { label: "Packaging", value: "25 KG" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: ["Better milk yield", "Improved protein synthesis", "Better fertility", "Increased feed efficiency"],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows"],
  },
  {
    name: "MATONIN",
    type: "RP Methionine",
    image: "/images/products/ruminants/Matonin.jpg",
    description:
      "Premium rumen protected methionine designed to maximize amino acid availability and improve milk production.",
    specs: [
      { label: "Category", value: "RP Methionine" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Form", value: "Granules" },
      { label: "Packaging", value: "25 KG" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: ["Better milk yield", "Improved protein synthesis", "Better fertility", "Increased feed efficiency"],
    applications: ["Dairy Farms", "Commercial Farms", "High Producing Cows"],
  },
];

export function RuminantAminoAcids() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-aa-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-aa-fade]", {
        start: "top 86%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });

      gsap.fromTo(
        "[data-aa-img]",
        { scale: 1.02 },
        { scale: 1.09, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } }
      );
      gsap.to("[data-aa-float]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.set("[data-aa-sheen]", { xPercent: -140, autoAlpha: 0 });
      gsap.to("[data-aa-sheen]", {
        keyframes: [
          { autoAlpha: 0.5, duration: 0.25 },
          { xPercent: 140, duration: 1.3, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.35 },
        ],
        scrollTrigger: { trigger: root, start: "top 60%", once: true },
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section id="rumen-protected-amino-acids" ref={rootRef} aria-labelledby="aa-heading" className="relative scroll-mt-24 overflow-hidden bg-pure">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(72% 55% at 78% 6%, rgba(219,239,231,0.42) 0%, rgba(255,255,255,0) 58%)" }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* header */}
        <div data-aa-fade className="mb-10 flex items-center gap-4 md:mb-14">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">01</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Rumen Protected</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-14 md:grid-cols-12">
          {/* luxury image treatment */}
          <div className="relative md:col-span-6">
            <MaskedReveal direction="up" className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[5/6]">
              <div data-aa-img className="h-full w-full will-change-transform">
                <LabPlate src="/feed.png" alt="Rumen-protected amino acids — Agriprom Pakistan" />
              </div>
              <span
                data-aa-sheen
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/2 will-change-transform"
                style={{ background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.6), transparent)" }}
              />
            </MaskedReveal>

            <div data-aa-float className="relative z-raised mt-6 will-change-transform md:absolute md:-left-10 md:bottom-8 md:mt-0 md:w-[320px] xl:-left-16">
              <div data-aa-fade className="rounded-lg border border-white/70 bg-white/60 p-7 shadow-glass backdrop-blur-xl backdrop-saturate-150">
                <span className="mb-4 block h-px w-8 bg-accent-500" />
                <p className="font-display text-h4 font-medium leading-[1.2] text-neutral-900">Delivered intact to the small intestine.</p>
                <p className="mt-3 font-sans text-body text-neutral-600">Shielded from rumen microbes, released exactly where amino acids are absorbed.</p>
              </div>
            </div>
          </div>

          {/* storytelling */}
          <div className="md:col-span-5 md:col-start-8">
            <h2 id="aa-heading" className="font-display font-light leading-[1.06] tracking-[-0.015em] text-neutral-900">
              <RevealText text="Rumen Protected" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[3.9vw] xl:text-[50px]" />
              <RevealText text="Amino Acids" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[3.9vw] xl:text-[50px]" />
            </h2>

            <div className="mt-9 space-y-8">
              <div data-aa-fade className="border-l border-neutral-200 pl-6">
                <span className="font-sans text-caption uppercase tracking-[0.24em] text-accent-600">The loss</span>
                <p className="mt-2 text-pretty font-sans text-body-lg text-neutral-700">In the rumen, unprotected amino acids are broken down by microbes long before they ever reach the cow.</p>
              </div>
              <div data-aa-fade className="border-l border-neutral-200 pl-6">
                <span className="font-sans text-caption uppercase tracking-[0.24em] text-accent-600">The protection</span>
                <p className="mt-2 text-pretty font-sans text-body-lg text-neutral-700">Rumen-protected methionine and lysine bypass that degradation and are delivered directly to the small intestine, where they are absorbed intact.</p>
              </div>
              <div data-aa-fade className="border-l border-neutral-200 pl-6">
                <span className="font-sans text-caption uppercase tracking-[0.24em] text-accent-600">The outcome</span>
                <p className="mt-2 text-pretty font-sans text-body-lg text-neutral-700">Precise metabolizable protein — improving absorption, milk production, animal performance and overall health, with less nitrogen wasted.</p>
              </div>
            </div>
          </div>
        </div>

        {/* products */}
        <div className="mt-[12vh]">
          <div data-aa-fade className="mb-[6vh] flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">In this range</span>
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
