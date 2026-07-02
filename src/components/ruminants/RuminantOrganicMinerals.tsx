"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { cn } from "@/lib/utils";

/**
 * RUMINANTS · SCENE 04.03 — ORGANIC MINERALS · MINLEX CATTLE.
 *
 * A premium, Apple-style pharmaceutical presentation — not an ecommerce page.
 * The product packshot is the hero: floating, mask-revealed, softly parallaxing
 * over a spotlight. A glass specification panel, benefits as luxury feature
 * cards, applications with premium line icons, generous white space, clean
 * scientific aesthetic. Reuses MaskedReveal, ProductMedia, GlassCard, RevealText,
 * GSAP; reduced-motion safe.
 */

const PRODUCT = {
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

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
function appIcon(label: string): ReactNode {
  const l = label.toLowerCase();
  if (l.includes("dairy")) return <Icon><path d="M8 2h8M8 2v3l-2 4v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9l-2-4V2M6 12h12" /></Icon>;
  if (l.includes("beef") || l.includes("cattle")) return <Icon><path d="M4 10c-1 0-2 1-2 2s1 2 2 2M20 10c1 0 2 1 2 2s-1 2-2 2M5 14c0 3 3 5 7 5s7-2 7-5v-3a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5zM9 10h.01M15 10h.01" /></Icon>;
  if (l.includes("commercial") || l.includes("operations")) return <Icon><path d="M3 21V9l9-6 9 6v12M3 21h18M7 21v-6h10v6M7 12h10" /></Icon>;
  if (l.includes("supplement") || l.includes("mineral")) return <Icon><path d="M9 2h6M10 2v6L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8V2M7.5 14h9" /></Icon>;
  if (l.includes("performance") || l.includes("feeding")) return <Icon><path d="M12 14a2 2 0 1 0-2-2M12 14l4-4M4 20a10 10 0 1 1 16 0" /></Icon>;
  return <Icon><path d="M20 6 9 17l-5-5" /></Icon>;
}

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
      gsap.set("[data-mx-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-mx-fade]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
      gsap.set("[data-mx-card]", { autoAlpha: 0, y: 26 });
      ScrollTrigger.batch("[data-mx-card]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
      gsap.set("[data-mx-panel]", { autoAlpha: 0, y: 30, scale: 0.99 });
      ScrollTrigger.batch("[data-mx-panel]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", overwrite: true }),
      });
      // soft image parallax (float up) + slow dolly
      gsap.to("[data-mx-float]", { yPercent: -10, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      const img = root.querySelector<HTMLElement>("[data-mx-img]");
      if (img) gsap.fromTo(img, { scale: 1.03 }, { scale: 1.1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section id="organic-minerals" ref={rootRef} aria-labelledby="om-heading" className="relative scroll-mt-24 overflow-hidden bg-pure">
      {/* soft scientific light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 55% at 76% 18%, rgba(219,239,231,0.5) 0%, rgba(255,255,255,0) 60%)" }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate */}
        <div data-mx-fade className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">03</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Organic Minerals</span>
        </div>

        {/* HERO — floating packshot */}
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div data-mx-fade className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">{PRODUCT.type}</span>
            </div>
            <h2 id="om-heading" className="font-display font-light leading-[1.02] tracking-[-0.02em] text-neutral-900">
              <RevealText text="MINLEX" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[15vw] md:text-[6.4vw] xl:text-[88px]" />
              <RevealText text="CATTLE" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[15vw] text-primary-700 md:text-[6.4vw] xl:text-[88px]" />
            </h2>
            <p data-mx-fade className="mt-8 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">
              {PRODUCT.description}
            </p>
            <div data-mx-fade className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="/contact-us/" className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500">
                Contact Our Experts
                <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500">
                Download Product Brochure
              </a>
            </div>
          </div>

          {/* floating packshot hero */}
          <div className="md:col-span-6 md:col-start-7">
            <div data-mx-float className="relative will-change-transform">
              {/* spotlight halo */}
              <div aria-hidden="true" className="pointer-events-none absolute -inset-8 rounded-full opacity-80 blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(219,239,231,0.9), rgba(255,255,255,0))" }} />
              <MaskedReveal direction="up" className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-floating ring-1 ring-white/60">
                <div data-mx-img className="h-full w-full will-change-transform">
                  <ProductMedia label={PRODUCT.name} alt={`${PRODUCT.name} — ${PRODUCT.type}, Agriprom Pakistan`} src={PRODUCT.image} className="h-full w-full" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </MaskedReveal>
            </div>
          </div>
        </div>

        {/* GLASS SPECIFICATION PANEL */}
        <div data-mx-panel className="mt-[14vh]">
          <GlassCard label="Technical Specifications" className="p-8 md:p-10">
            <dl className="grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCT.specs.map((s) => (
                <div key={s.label} className="border-t border-neutral-200/70 py-4">
                  <dt className="font-sans text-caption uppercase tracking-[0.18em] text-neutral-500">{s.label}</dt>
                  <dd className="mt-1.5 font-display text-body-lg text-neutral-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        </div>

        {/* BENEFITS — luxury feature cards */}
        <div className="mt-[12vh]">
          <div data-mx-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">Key Benefits</span>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {PRODUCT.benefits.map((b) => (
              <li key={b} data-mx-card>
                <GlassCard className="group flex h-full items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700 transition-transform duration-200 ease-brand-out group-hover:scale-105">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <span className="mt-1.5 font-display text-h4 font-medium leading-[1.25] text-neutral-900">{b}</span>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>

        {/* APPLICATIONS — premium line icons */}
        <div className="mt-[12vh]">
          <div data-mx-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">Recommended Applications</span>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {PRODUCT.applications.map((a) => (
              <li key={a} data-mx-card className={cn("group flex flex-col items-center gap-4 rounded-lg border border-neutral-200/80 bg-white/60 p-7 text-center shadow-soft backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 ease-brand-out hover:-translate-y-1 hover:border-primary-300 hover:shadow-medium")}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/70 text-primary-700 shadow-soft transition-colors duration-200 ease-brand-out group-hover:text-accent-600">
                  {appIcon(a)}
                </span>
                <span className="font-sans text-body text-neutral-700">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
