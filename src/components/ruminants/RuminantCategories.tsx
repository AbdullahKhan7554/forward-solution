"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { cn } from "@/lib/utils";
import { RUMINANT_CATEGORIES, type RuminantCategory } from "./categories";

/**
 * RUMINANTS · SCENE 04 — CINEMATIC CATEGORY SECTIONS.
 *
 * Each category is a full editorial section: a large image (MaskedReveal +
 * scrub dolly parallax) on one side, an editorial description + a glass product
 * panel on the other — sides alternating. Reveal / mask / parallax throughout,
 * massive white space. Reuses MaskedReveal, LabPlate, RevealText, GlassCard.
 */
function CategorySection({ category, index }: { category: RuminantCategory; index: number }) {
  const imageLeft = index % 2 === 0;
  const num = String(index + 1).padStart(2, "0");

  const image = (
    <div className={cn("md:col-span-6", imageLeft ? "md:order-1" : "md:order-2")}>
      <MaskedReveal
        direction={imageLeft ? "up" : "left"}
        className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[5/6]"
      >
        <div data-ruc-img className="h-full w-full will-change-transform">
          <LabPlate src={category.image} alt={`${category.name} — Agriprom Pakistan`} />
        </div>
      </MaskedReveal>
    </div>
  );

  const content = (
    <div className={cn("md:col-span-5", imageLeft ? "md:order-2 md:col-start-8" : "md:order-1 md:col-start-1")}>
      <div data-ruc-fade className="mb-6 flex items-center gap-4">
        <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">{num}</span>
        <span className="h-px w-10 bg-accent-500" />
        <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants</span>
      </div>

      <h3 className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-900">
        <RevealText text={category.name} as="span" trigger="scroll" stagger={0.05} className="justify-start text-[8vw] md:text-[3.4vw] xl:text-[44px]" />
      </h3>

      <p data-ruc-fade className="mt-6 text-pretty font-sans text-body-lg text-neutral-600">
        {category.description}
      </p>

      {/* glass product panel */}
      <div data-ruc-fade className="mt-8">
        <GlassCard label="In this range">
          <ul className="flex flex-col">
            {category.products.map((p, i) => (
              <li
                key={p}
                className={cn(
                  "flex items-center gap-3 py-3 font-sans text-body text-neutral-800",
                  i > 0 && "border-t border-neutral-200/70"
                )}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-500" />
                {p}
              </li>
            ))}
          </ul>
          <a
            href="/contact-us/"
            className="group mt-6 inline-flex items-center gap-2.5 font-sans text-body font-medium text-primary-700"
          >
            Discuss with our team
            <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
          </a>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div
      id={category.id}
      data-ruc-section
      className={cn("scroll-mt-24", index % 2 === 1 ? "bg-base" : "bg-pure")}
    >
      <div className="mx-auto grid w-full max-w-container grid-cols-1 items-center gap-x-16 gap-y-12 px-6 py-[16vh] md:grid-cols-12 md:px-12 xl:px-20">
        {image}
        {content}
      </div>
    </div>
  );
}

export function RuminantCategories() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-ruc-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-ruc-fade]", {
        start: "top 86%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });

      // scrubbed dolly parallax on each image
      gsap.utils.toArray<HTMLElement>("[data-ruc-img]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.07,
            ease: "none",
            scrollTrigger: { trigger: el.closest("[data-ruc-section]"), start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section ref={rootRef} aria-label="Ruminant solution categories" className="relative">
      {RUMINANT_CATEGORIES.map((category, i) =>
        // These categories have their own bespoke showcase sections.
        ["rumen-protected-amino-acids", "toxin-binders", "organic-minerals", "vaccines", "biosecurity"].includes(category.id) ? null : (
          <CategorySection key={category.id} category={category} index={i} />
        )
      )}
    </section>
  );
}
