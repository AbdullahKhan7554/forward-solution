"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { cn } from "@/lib/utils";

/**
 * RuminantShowcase — the shared premium presentation for a single ruminant
 * product. Alternating image side by index; a Technical Information glass panel
 * beside a Key Benefits glass panel (elegant check icons); Recommended
 * Applications as premium pills beneath; and two CTAs. Self-animating (GSAP
 * image/mask/text reveal + panel reveal + dolly parallax); reduced-motion safe.
 * Reuses MaskedReveal, ProductMedia, GlassCard, RevealText and every token.
 */
export type RuminantProduct = {
  name: string;
  type: string;
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  benefits: string[];
  applications: string[];
};

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export function RuminantShowcase({ product, index }: { product: RuminantProduct; index: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const imageLeft = index % 2 === 0;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-rs-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-rs-fade]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
      gsap.set("[data-rs-panel]", { autoAlpha: 0, y: 30, scale: 0.99 });
      ScrollTrigger.batch("[data-rs-panel]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
      const img = root.querySelector<HTMLElement>("[data-rs-img]");
      if (img) {
        gsap.fromTo(img, { scale: 1 }, { scale: 1.07, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      }
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <article ref={rootRef} aria-label={product.name}>
      {/* image + intro — alternating */}
      <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 md:grid-cols-12">
        <div className={cn("md:col-span-6", imageLeft ? "md:order-1" : "md:order-2")}>
          <MaskedReveal direction={imageLeft ? "up" : "left"} className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[5/6]">
            <div data-rs-img className="h-full w-full will-change-transform">
              <ProductMedia label={product.name} alt={`${product.name} — ${product.type}, Agriprom Pakistan`} src={product.image} className="h-full w-full" />
            </div>
          </MaskedReveal>
        </div>
        <div className={cn("md:col-span-6", imageLeft ? "md:order-2" : "md:order-1")}>
          <div data-rs-fade className="flex flex-wrap items-baseline gap-4">
            <h3 className="font-display text-h1 font-light tracking-[-0.01em] text-neutral-900">{product.name}</h3>
            <span className="shrink-0 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-sans text-caption uppercase tracking-[0.16em] text-primary-700">
              {product.type}
            </span>
          </div>
          <p data-rs-fade className="mt-5 max-w-[48ch] text-pretty font-sans text-body-lg text-neutral-600">
            {product.description}
          </p>
        </div>
      </div>

      {/* Technical Information · Key Benefits — side by side */}
      <div className="mt-[7vh] grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div data-rs-panel>
          <GlassCard label="Technical Information" className="h-full">
            <dl className="flex flex-col">
              {product.specs.map((s, i) => (
                <div key={s.label} className={cn("flex items-baseline justify-between gap-6 py-3", i > 0 && "border-t border-neutral-200/70")}>
                  <dt className="font-sans text-caption uppercase tracking-[0.16em] text-neutral-500">{s.label}</dt>
                  <dd className="text-right font-sans text-body text-neutral-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        </div>
        <div data-rs-panel>
          <GlassCard label="Key Benefits" className="h-full">
            <ul className="flex flex-col gap-4">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 font-sans text-body text-neutral-800">
                  <Check />
                  <span className="mt-0.5">{b}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* Recommended Applications — premium pills */}
      <div data-rs-fade className="mt-10">
        <span className="mb-4 block font-sans text-caption uppercase tracking-[0.24em] text-neutral-500">Recommended Applications</span>
        <ul className="flex flex-wrap gap-3">
          {product.applications.map((a) => (
            <li key={a} className="rounded-full border border-neutral-200 bg-white/70 px-5 py-2.5 font-sans text-body text-neutral-700 shadow-soft backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-medium">
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div data-rs-fade className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <a
          href="/contact-us/"
          className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          Contact Our Experts
          <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
        </a>
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          Download Product Brochure
        </a>
      </div>
    </article>
  );
}
