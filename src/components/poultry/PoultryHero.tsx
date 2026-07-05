"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

/**
 * POULTRY · SECTION 01 — HERO.
 *
 * An editorial photographic hero on the established light stage: text mass left,
 * a large image unveiled by MaskedReveal right, soft daylight and generous white
 * space. Keys its reveal off the shared intro clock (same grammar as every other
 * hero) and carries a whisper of scroll parallax on the image. Reuses RevealText,
 * MaskedReveal, LabPlate, ScrollCue, the GSAP clock and tokens.
 *
 * The image is a LabPlate — drop a real poultry-farm photograph in via `src`.
 */
export function PoultryHero() {
  const { phase } = useIntro();
  const rootRef = useRef<HTMLElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !rootRef.current) return;
    const root = rootRef.current;
    gsap.set(root.querySelectorAll("[data-ph-fade]"), { autoAlpha: 0, y: 18 });
    gsap.set(root.querySelectorAll("[data-ph-line]"), { scaleX: 0, transformOrigin: "0% 50%" });

    // subtle parallax on the hero image
    const ctx = gsap.context(() => {
      gsap.to("[data-ph-parallax]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !rootRef.current) return;
    playedRef.current = true;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-ph-line]"), {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        delay: 0.5,
      });
      gsap.to(root.querySelectorAll("[data-ph-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
        stagger: 0.12,
      });
    }, root);
    return () => ctx.revert();
  }, [revealing]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="poultry-hero-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 20%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-container grid-cols-1 items-center gap-x-12 gap-y-12 px-6 pb-[12vh] pt-[22vh] md:grid-cols-12 md:px-12 md:pb-[10vh] xl:px-20">
        {/* TEXT MASS */}
        <div className="md:col-span-6 md:pr-6">
          <div data-ph-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
              Products · Poultry
            </span>
          </div>

          <h1
            id="poultry-hero-heading"
            className="font-display font-light leading-[1.02] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Poultry"
              as="span"
              play={revealing}
              delay={0.5}
              stagger={0.06}
              className="justify-start text-[16vw] md:text-[7vw] xl:text-[96px]"
            />
            <RevealText
              text="Solutions"
              as="span"
              play={revealing}
              delay={0.9}
              stagger={0.06}
              className="justify-start text-[16vw] text-primary-700 md:text-[7vw] xl:text-[96px]"
            />
          </h1>

          <p
            data-ph-fade
            className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Agriprom Pakistan delivers scientifically proven nutritional technologies that
            improve bird health, feed efficiency and farm profitability.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <a
              data-ph-fade
              href="#products"
              className="group inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Explore Products
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>

          <span data-ph-line aria-hidden="true" className="mt-14 block h-px w-full bg-neutral-200" />
        </div>

        {/* IMAGE */}
        <div className="md:col-span-6">
          <MaskedReveal
            direction="up"
            trigger="mount"
            className="aspect-[4/5] w-full rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[4/5]"
          >
            <div data-ph-parallax className="h-[112%] w-full will-change-transform">
              <LabPlate src="/poultry.jpg" alt="Poultry farm — Agriprom Pakistan nutritional technologies" />
            </div>
          </MaskedReveal>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-raised -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  );
}
