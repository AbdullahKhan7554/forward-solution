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
 * RUMINANTS · SCENE 01 — CINEMATIC HERO.
 *
 * A full-bleed dairy-farm image revealed by MaskedReveal, a glass breadcrumb,
 * an oversized headline surfacing off the shared intro clock, and a whisper of
 * scroll parallax. Reuses RevealText, MaskedReveal, LabPlate, ScrollCue, GSAP
 * and every token. Light type sits on a soft cinematic scrim.
 */
export function RuminantHero() {
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
    gsap.set(root.querySelectorAll("[data-rh-fade]"), { autoAlpha: 0, y: 18 });
    const ctx = gsap.context(() => {
      gsap.to("[data-rh-parallax]", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-rh-content]", {
        yPercent: -12,
        autoAlpha: 0.2,
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
      gsap.to(root.querySelectorAll("[data-rh-fade]"), {
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
    <section ref={rootRef} aria-labelledby="ruminant-hero-heading" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-dark">
      {/* full-bleed cinematic image */}
      <MaskedReveal direction="up" trigger="mount" className="absolute inset-0">
        <div data-rh-parallax className="h-full w-full will-change-transform">
          <LabPlate src="/reuminant.jpg" alt="Dairy and beef cattle — Agriprom Pakistan ruminant nutrition" />
        </div>
      </MaskedReveal>

      {/* cinematic scrim for legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,17,22,0.45) 0%, rgba(11,17,22,0.1) 32%, rgba(11,17,22,0.2) 62%, rgba(11,17,22,0.72) 100%)",
        }}
      />

      {/* content */}
      <div
        data-rh-content
        className="relative z-raised flex h-full w-full flex-col justify-between px-6 pb-[10vh] pt-[16vh] md:px-12 md:pb-[9vh] xl:px-20"
      >
        {/* glass breadcrumb */}
        <nav data-rh-fade aria-label="Breadcrumb" className="w-fit">
          <ol className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-sans text-caption uppercase tracking-[0.24em] text-white/80 backdrop-blur-xl">
            <li><a href="/" className="transition-colors hover:text-white">Home</a></li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li><a href="/products" className="transition-colors hover:text-white">Products</a></li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li className="text-white">Ruminants</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <div data-rh-fade className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-300" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-white/80">
              Ruminant Nutrition
            </span>
          </div>

          <h1 id="ruminant-hero-heading" className="font-display font-light leading-[1.0] tracking-[-0.02em] text-neutral-50">
            <RevealText text="Ruminant" as="span" play={revealing} delay={0.5} stagger={0.06} className="justify-start text-[17vw] md:text-[8vw] xl:text-[104px]" />
            <RevealText text="Solutions" as="span" play={revealing} delay={0.85} stagger={0.06} className="justify-start text-[17vw] text-accent-300 md:text-[8vw] xl:text-[104px]" />
          </h1>

          <p data-rh-fade className="mt-8 max-w-[54ch] text-pretty font-sans text-body-lg text-neutral-200">
            Science-driven nutrition, health and comfort for dairy and beef cattle — engineered to
            lift milk yield, fertility, feed efficiency and herd longevity.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 z-raised md:right-12 xl:right-20">
        <ScrollCue />
      </div>
    </section>
  );
}
