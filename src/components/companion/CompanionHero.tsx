"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

const ParticleField = dynamic(() => import("@/components/scenes/SceneInnovation/ParticleField"), { ssr: false });

/**
 * COMPANION ANIMALS · SCENE 01 — BRIGHT LIFESTYLE HERO.
 *
 * Daylight, generous white space, glass overlays. Large lifestyle image (mask
 * reveal + slow parallax) beside an editorial statement; soft floating particles
 * and light rays drift behind. The heading surfaces off the shared intro clock
 * exactly like the homepage. Reuses RevealText, MaskedReveal, LabPlate,
 * ParticleField, ScrollCue, GSAP; reduced-motion safe.
 */
export function CompanionHero() {
  const { phase } = useIntro();
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !rootRef.current) return;
    const root = rootRef.current;
    gsap.set(root.querySelectorAll("[data-ch-fade]"), { autoAlpha: 0, y: 18 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom top", onUpdate: (self) => { scrollProgress.current = self.progress; } });
      gsap.to("[data-ch-img]", { yPercent: -8, scale: 1.06, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-ch-rays]", { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !rootRef.current) return;
    playedRef.current = true;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-ch-fade]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.4, stagger: 0.12 });
    }, root);
    return () => ctx.revert();
  }, [revealing]);

  return (
    <section ref={rootRef} aria-labelledby="companion-hero-heading" className="relative min-h-[100svh] overflow-hidden bg-base">
      {/* soft daylight bloom */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(90% 80% at 70% 20%, #FFFFFF 0%, rgba(250,251,252,0) 55%), radial-gradient(70% 60% at 15% 90%, rgba(219,239,231,0.5) 0%, rgba(255,255,255,0) 60%)" }} />
      {/* light rays */}
      <div data-ch-rays aria-hidden="true" className="pointer-events-none absolute inset-0 will-change-transform">
        <div className="absolute -top-1/4 left-[12%] h-[150%] w-[22vw] -rotate-[18deg] opacity-70" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", filter: "blur(24px)" }} />
        <div className="absolute -top-1/4 left-[42%] h-[150%] w-[14vw] -rotate-[18deg] opacity-50" style={{ background: "linear-gradient(90deg, transparent, rgba(219,239,231,0.6), transparent)", filter: "blur(20px)" }} />
      </div>
      {/* soft floating particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
        <ParticleField scrollProgressRef={scrollProgress} color={[0.35, 0.55, 0.62]} />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-container grid-cols-1 items-center gap-x-16 gap-y-12 px-6 pb-[12vh] pt-[20vh] md:grid-cols-12 md:px-12 md:pb-[10vh] xl:px-20">
        {/* editorial statement */}
        <div className="md:col-span-6 md:pr-6">
          <div data-ch-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">Companion Animal Health · Veterinary Science</span>
          </div>
          <h1 id="companion-hero-heading" className="font-display font-light leading-[1.02] tracking-[-0.015em] text-neutral-900">
            <RevealText text="Companion Animal" as="span" play={revealing} delay={0.5} stagger={0.05} className="justify-start text-[11vw] md:text-[5.4vw] xl:text-[74px]" />
            <RevealText text="Solutions" as="span" play={revealing} delay={0.9} stagger={0.06} className="justify-start text-[11vw] text-primary-700 md:text-[5.4vw] xl:text-[74px]" />
          </h1>
          <p data-ch-fade className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600">
            Advanced vaccines and veterinary healthcare solutions designed to protect companion
            animals through modern science.
          </p>
          <div className="mt-10">
            <a data-ch-fade href="#dogs" className="group inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500">
              Explore Products
              <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>
        </div>

        {/* lifestyle image + glass overlay */}
        <div className="md:col-span-6">
          <div className="relative">
            <MaskedReveal direction="up" trigger="mount" className="aspect-[4/5] w-full overflow-hidden rounded-xl shadow-floating ring-1 ring-white/60">
              <div data-ch-img className="h-full w-full will-change-transform">
                <LabPlate src="/animal%20comapnion.jpg" alt="A healthy dog and cat — Agriprom Pakistan companion animal health" />
              </div>
            </MaskedReveal>
            {/* glass overlay chip */}
            <div data-ch-fade className="absolute bottom-5 left-5 rounded-full border border-white/70 bg-white/55 px-5 py-2.5 shadow-glass backdrop-blur-xl md:bottom-7 md:left-7">
              <span className="font-sans text-caption uppercase tracking-[0.24em] text-primary-700">Protected by Modern Science</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-raised -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  );
}
