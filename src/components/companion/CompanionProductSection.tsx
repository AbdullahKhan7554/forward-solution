"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { cn } from "@/lib/utils";
import type { CompanionCategory } from "./companionData";

/**
 * COMPANION ANIMALS · SCENES 02–03 — DOGS / CATS.
 *
 * One flagship product per category, presented as a luxury glass product card
 * (Apple-style, not ecommerce): image one side, product name / short copy /
 * category / Learn More the other. Identical layout & spacing across sections.
 * Motion: mask reveal, a glass-reflection sheen sweep, soft mouse parallax on
 * the packshot, and a soft hover lift. Reuses MaskedReveal, ProductMedia,
 * RevealText, GSAP; reduced-motion safe.
 */
export function CompanionProductSection({ category, sceneNumber }: { category: CompanionCategory; sceneNumber: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const { product } = category;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-cp-fade]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-cp-fade]", {
        start: "top 86%",
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });
      gsap.set("[data-cp-card]", { autoAlpha: 0, y: 34, scale: 0.99 });
      ScrollTrigger.batch("[data-cp-card]", {
        start: "top 84%",
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", overwrite: true }),
      });
      // glass-reflection sheen sweep across the packshot
      gsap.set("[data-cp-sheen]", { xPercent: -140, autoAlpha: 0 });
      gsap.to("[data-cp-sheen]", {
        keyframes: [
          { autoAlpha: 0.55, duration: 0.25 },
          { xPercent: 160, duration: 1.4, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.35 },
        ],
        scrollTrigger: { trigger: root, start: "top 62%", once: true },
      });
    }, root);

    // soft mouse parallax on the packshot (only when not reduced — already gated above)
    let cleanupParallax = () => {};
    const card = cardRef.current;
    const img = imgRef.current;
    if (card && img) {
      const xTo = gsap.quickTo(img, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(img, "y", { duration: 0.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.04);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.04);
      };
      const onLeave = () => { xTo(0); yTo(0); };
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      cleanupParallax = () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => { cleanupParallax(); ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section id={category.id} ref={rootRef} aria-labelledby={`cp-${category.id}`} className={cn("relative scroll-mt-24 overflow-hidden", sceneNumber % 2 === 0 ? "bg-pure" : "bg-base")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(72% 55% at 78% 6%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)" }} />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* header */}
        <div data-cp-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">{String(sceneNumber).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Companion · {category.name}</span>
        </div>
        <h2 id={`cp-${category.id}`} className="max-w-3xl font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
          <RevealText text={category.name} as="span" trigger="scroll" stagger={0.06} className="justify-start text-[11vw] md:text-[5vw] xl:text-[68px]" />
        </h2>
        <p data-cp-fade className="mt-6 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">{category.subtitle}</p>

        {/* luxury glass product card */}
        <div ref={cardRef} data-cp-card className="group relative mt-[8vh] overflow-hidden rounded-xl border border-white/70 bg-white/55 shadow-glass backdrop-blur-2xl backdrop-saturate-150 transition-[transform,box-shadow] duration-300 ease-brand-out will-change-transform hover:-translate-y-1 hover:shadow-floating">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* image side */}
            <div className="relative">
              <MaskedReveal direction="up" className="aspect-[4/3] w-full overflow-hidden md:h-full md:aspect-auto">
                <div ref={imgRef} className="h-full w-full will-change-transform">
                  <ProductMedia label={product.name} alt={`${product.name} — ${product.category}, Agriprom Pakistan`} src={product.image} className="h-full w-full" />
                </div>
              </MaskedReveal>
              {/* glass reflection sheen */}
              <span data-cp-sheen aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/2 will-change-transform" style={{ background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.65), transparent)" }} />
            </div>

            {/* content side */}
            <div className="flex flex-col justify-center p-8 md:p-12 xl:p-14">
              <div data-cp-fade className="mb-6 flex items-center gap-3">
                <span className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-sans text-caption uppercase tracking-[0.16em] text-primary-700">
                  {product.category}
                </span>
              </div>
              <h3 className="font-display font-light leading-[1.05] tracking-[-0.01em] text-neutral-900">
                <RevealText text={product.name} as="span" trigger="scroll" stagger={0.05} className="justify-start text-[9vw] md:text-[4vw] xl:text-[52px]" />
              </h3>
              <p data-cp-fade className="mt-6 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">{product.short}</p>
              <div data-cp-fade className="mt-10">
                <a href={product.href} className="group/cta inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500">
                  Learn More
                  <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover/cta:translate-x-1">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
