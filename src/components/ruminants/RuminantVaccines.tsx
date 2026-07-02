"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * RUMINANTS · SCENE 04.04 — VACCINES · SUPRAVAC 10.
 *
 * A premium pharmaceutical presentation: a clean laboratory-inspired environment
 * (molecular dot pattern + soft medical grid + cinematic cool light), a floating
 * vaccine bottle (mask reveal, soft parallax, reflection glow), a glass
 * specification panel, and key benefits as elegant icon cards with GSAP reveals.
 * Apple × Moderna × Roche language. Reuses MaskedReveal, ProductMedia, GlassCard,
 * RevealText, GSAP; reduced-motion safe.
 */

const PRODUCT = {
  name: "SUPRAVAC 10",
  type: "Veterinary Vaccine",
  image: "/images/products/ruminants/Supravac-10-768x949.jpg",
  description:
    "SUPRAVAC 10 is a premium multivalent livestock vaccine designed to provide broad-spectrum protection against major clostridial diseases. It helps strengthen herd immunity, reduce disease outbreaks, and improve overall livestock health and productivity.",
  specs: [
    { label: "Category", value: "Veterinary Vaccine" },
    { label: "Species", value: "Cattle, Sheep & Goats" },
    { label: "Vaccine Type", value: "Multivalent Clostridial Vaccine" },
    { label: "Administration", value: "Injectable" },
    { label: "Packaging", value: "As per manufacturer" },
    { label: "Storage", value: "Store at 2–8°C. Do not freeze." },
    { label: "Manufacturer", value: "Better Pharma (Update if different)" },
    { label: "Country of Origin", value: "—" },
  ],
  benefits: [
    "Protects against multiple clostridial diseases",
    "Improves herd immunity",
    "Reduces mortality and production losses",
    "Supports healthier livestock performance",
    "Cost-effective preventive healthcare",
  ],
  applications: ["Dairy Farms", "Beef Cattle Farms", "Sheep Farms", "Goat Farms", "Commercial Livestock Operations"],
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
  if (l.includes("sheep")) return <Icon><path d="M7 18a4 4 0 0 1-1-8 3 3 0 0 1 6 0 3 3 0 0 1 6 0 4 4 0 0 1-1 8zM8 18v2M16 18v2" /></Icon>;
  if (l.includes("goat")) return <Icon><path d="M6 9c0-2 1-3 3-3M18 9c0-2-1-3-3-3M7 9l-1-4M17 9l1-4M6 9c0 5 2 9 6 9s6-4 6-9zM10 13h.01M14 13h.01" /></Icon>;
  if (l.includes("commercial") || l.includes("operations")) return <Icon><path d="M3 21V9l9-6 9 6v12M3 21h18M7 21v-6h10v6M7 12h10" /></Icon>;
  return <Icon><path d="M20 6 9 17l-5-5" /></Icon>;
}
function benefitIcon(index: number): ReactNode {
  const set = [
    <Icon key="s"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Icon>, // shield-check
    <Icon key="h"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></Icon>, // heart (immunity)
    <Icon key="t"><path d="M3 17l6-6 4 4 7-7M17 8h4v4" /></Icon>, // trend down risk
    <Icon key="a"><path d="M3 12h4l2 5 4-12 2 7h6" /></Icon>, // activity/health
    <Icon key="c"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>, // clock / preventive
  ];
  return set[index % set.length];
}

export function RuminantVaccines() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-vx-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-vx-fade]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
      gsap.set("[data-vx-card]", { autoAlpha: 0, y: 26 });
      ScrollTrigger.batch("[data-vx-card]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
      gsap.set("[data-vx-panel]", { autoAlpha: 0, y: 30, scale: 0.99 });
      ScrollTrigger.batch("[data-vx-panel]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", overwrite: true }),
      });
      gsap.to("[data-vx-float]", { yPercent: -10, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      const img = root.querySelector<HTMLElement>("[data-vx-img]");
      if (img) gsap.fromTo(img, { scale: 1.03 }, { scale: 1.1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section id="vaccines" ref={rootRef} aria-labelledby="vx-heading" className="relative scroll-mt-24 overflow-hidden bg-base">
      {/* cinematic cool laboratory light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 55% at 72% 14%, rgba(203,223,234,0.55) 0%, rgba(255,255,255,0) 60%)" }} />
      {/* soft medical grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(20,35,44,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.025) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      {/* molecular dot pattern */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "radial-gradient(rgba(0,100,193,0.06) 1.4px, transparent 1.4px)", backgroundSize: "34px 34px" }} />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate */}
        <div data-vx-fade className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">04</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Vaccines</span>
        </div>

        {/* HERO — floating vaccine bottle */}
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div data-vx-fade className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">{PRODUCT.type}</span>
            </div>
            <h2 id="vx-heading" className="font-display font-light leading-[1.02] tracking-[-0.02em] text-neutral-900">
              <RevealText text="SUPRAVAC" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[15vw] md:text-[6vw] xl:text-[84px]" />
              <RevealText text="10" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[15vw] text-primary-700 md:text-[6vw] xl:text-[84px]" />
            </h2>
            <p data-vx-fade className="mt-8 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">{PRODUCT.description}</p>
            <div data-vx-fade className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="/contact-us/" className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500">
                Contact Our Experts
                <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500">
                Download Brochure
              </a>
            </div>
          </div>

          {/* floating bottle + reflection */}
          <div className="md:col-span-6 md:col-start-7">
            <div data-vx-float className="relative will-change-transform">
              <div aria-hidden="true" className="pointer-events-none absolute -inset-10 rounded-full opacity-80 blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(203,223,234,0.35), rgba(255,255,255,0))" }} />
              <MaskedReveal direction="up" className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-floating ring-1 ring-white/60">
                <div data-vx-img className="h-full w-full will-change-transform">
                  <ProductMedia label={PRODUCT.name} alt={`${PRODUCT.name} — clostridial vaccine, Agriprom Pakistan`} src={PRODUCT.image} className="h-full w-full" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </MaskedReveal>
              {/* subtle surface reflection */}
              <div aria-hidden="true" className="pointer-events-none mx-auto mt-3 h-10 w-3/4 rounded-[50%]" style={{ background: "radial-gradient(closest-side, rgba(0,100,193,0.18), rgba(0,100,193,0))", filter: "blur(6px)" }} />
            </div>
          </div>
        </div>

        {/* GLASS SPECIFICATION PANEL */}
        <div data-vx-panel className="mt-[14vh]">
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

        {/* KEY BENEFITS — elegant icon cards */}
        <div className="mt-[12vh]">
          <div data-vx-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">Key Benefits</span>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {PRODUCT.benefits.map((b, i) => (
              <li key={b} data-vx-card>
                <GlassCard className="group relative h-full overflow-hidden">
                  <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-brand-out group-hover:opacity-100" style={{ background: "radial-gradient(closest-side, rgba(0,138,75,0.35), rgba(0,138,75,0))" }} />
                  <div className="relative flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-300 ease-brand-out group-hover:text-accent-600">
                      {benefitIcon(i)}
                    </span>
                    <span className="mt-1.5 font-display text-h4 font-medium leading-[1.25] text-neutral-900">{b}</span>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>

        {/* APPLICATIONS — premium line icons */}
        <div className="mt-[12vh]">
          <div data-vx-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">Recommended Applications</span>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {PRODUCT.applications.map((a) => (
              <li key={a} data-vx-card className="group flex flex-col items-center gap-4 rounded-lg border border-neutral-200/80 bg-white/60 p-7 text-center shadow-soft backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 ease-brand-out hover:-translate-y-1 hover:border-primary-300 hover:shadow-medium">
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
