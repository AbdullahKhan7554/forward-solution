"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/scroll-trigger";
import { RevealText } from "@/components/primitives/RevealText";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { RUMINANT_CATEGORIES, containRuminantImage } from "./categories";
import type { CategoryCard } from "@/lib/catalog";

/**
 * RUMINANTS · SCENE 03 — SOLUTIONS OVERVIEW.
 *
 * Category cards via the shared CatalogCard (same as the poultry grid):
 * image, title, one line, "Explore →". Each card links to its category page.
 */

/** `extra` — categories added in the admin, appended after the built-in ones. */
export function RuminantSolutions({ extra = [] }: { extra?: CategoryCard[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-rs-head]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-rs-head]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none" },
      });
      gsap.set("[data-rs-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-rs-card]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="ruminant-solutions-heading" className="relative overflow-hidden bg-pure">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 45% at 80% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <h2 id="ruminant-solutions-heading" className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
            <RevealText text="Seven Pillars of" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]" />
            <RevealText text="Ruminant Performance" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]" />
          </h2>
        </header>

        <ul className="mt-[10vh] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
          {RUMINANT_CATEGORIES.map((c) => (
            <li key={c.id} data-rs-card>
              <CatalogCard
                href={`/products/ruminants/${c.id}`}
                title={c.name}
                line={c.tagline}
                action="Explore"
                image={<ProductMedia label={c.name} alt={`${c.name} for ruminants — Agriprom Pakistan`} src={c.image} className={containRuminantImage(c.image) ? "h-full w-full [&_img]:!object-contain" : "h-full w-full"} />}
              />
            </li>
          ))}
          {extra.map((c) => (
            <li key={c.href} data-rs-card>
              <CatalogCard
                href={c.href}
                title={c.name}
                line={c.blurb}
                action="Explore"
                image={<ProductMedia label={c.name} alt={`${c.name} for ruminants — Agriprom Pakistan`} src={c.image} className={containRuminantImage(c.image) ? "h-full w-full [&_img]:!object-contain" : "h-full w-full"} />}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
