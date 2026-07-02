"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

// Very soft particles — the shared ultra-light field, client-only.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

/**
 * FAQ · SCENE 01 — THE QUESTIONS (HERO).
 *
 * Reuses the Home/About/Contact hero architecture — sticky runway, one scroll
 * driving parallax + a scrubbed exit, and the reveal grammar (fade → hairline
 * draw → one sheen → action). A calm white scientific aesthetic: soft green/blue
 * radial gradients, subtle drifting particles and elegant floating geometry.
 */
export function FaqHero() {
  const { phase } = useIntro();
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const geoRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !outerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: outerRef.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.to(geoRef.current, { yPercent: 10, ease: "none" }, 0);
      tl.to(contentRef.current, { yPercent: -20, autoAlpha: 0, ease: "power1.in" }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.25 }, 0);

      // elegant floating geometry — barely-there drift, never a loop you notice
      gsap.utils.toArray<HTMLElement>("[data-geo]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 22 : -22,
          x: i % 2 ? -14 : 14,
          duration: 10 + i * 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, outerRef);

    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current || !contentRef.current) return;
    const root = contentRef.current;
    gsap.set(root.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16 });
    gsap.set(root.querySelectorAll("[data-hero-cta]"), { autoAlpha: 0, y: 20 });
    gsap.set(root.querySelectorAll("[data-hero-line]"), { scaleX: 0, transformOrigin: "0% 50%" });
    gsap.set(root.querySelectorAll("[data-sheen]"), { xPercent: -140, autoAlpha: 0 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !contentRef.current) return;
    playedRef.current = true;
    const root = contentRef.current;

    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.3, stagger: 0.12 });
      gsap.to(root.querySelectorAll("[data-hero-line]"), { scaleX: 1, duration: 1.1, ease: "power3.inOut", delay: 0.45 });
      gsap.to(root.querySelectorAll("[data-sheen]"), {
        keyframes: [
          { autoAlpha: 0.5, duration: 0.2 },
          { xPercent: 140, duration: 1.1, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.3 },
        ],
        delay: 1.35,
      });
      gsap.to(root.querySelectorAll("[data-hero-cta]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.9, stagger: 0.12 });
    }, root);

    return () => ctx.revert();
  }, [revealing]);

  return (
    <section aria-label="Frequently asked questions" className="relative">
      <div ref={outerRef} className="relative h-[150svh]">
        <div className="sticky top-0 flex h-[100svh] min-h-[620px] w-full items-center overflow-hidden bg-base">
          {/* soft scientific gradients */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 20% 12%, rgba(0,138,75,0.08) 0%, rgba(255,255,255,0) 58%), radial-gradient(60% 55% at 84% 88%, rgba(0,100,193,0.08) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
          {/* very soft particles */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
            <ParticleField scrollProgressRef={scrollProgress} color={[0.4, 0.55, 0.62]} />
          </div>
          {/* elegant floating geometry */}
          <div ref={geoRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span data-geo className="absolute right-[12%] top-[16%] block h-40 w-40 rounded-full border border-primary-600/10 will-change-transform" />
            <span data-geo className="absolute left-[8%] bottom-[18%] block h-56 w-56 rounded-full border border-secondary-500/10 will-change-transform" />
            <span data-geo className="absolute right-[22%] bottom-[24%] block h-24 w-24 rotate-45 rounded-[28px] border border-primary-600/10 will-change-transform" />
          </div>

          {/* content — centered editorial */}
          <div
            ref={contentRef}
            className="relative z-raised mx-auto w-full max-w-3xl px-6 text-center will-change-transform md:px-12"
          >
            <div data-hero-fade className="mb-7 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
                Frequently Asked Questions
              </span>
              <span className="h-px w-10 bg-accent-500" />
            </div>

            <h1 className="relative overflow-hidden pb-[0.08em] font-display font-light text-neutral-900">
              <span
                data-sheen
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/3"
                style={{ background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.9), transparent)" }}
              />
              <RevealText
                text="Everything You"
                as="span"
                play={revealing}
                delay={0.5}
                stagger={0.06}
                className="justify-center text-[10vw] leading-[1.03] tracking-[-0.015em] md:text-[5.4vw] xl:text-[66px]"
              />
              <RevealText
                text="Need To Know"
                as="span"
                play={revealing}
                delay={1.05}
                stagger={0.06}
                className="mt-1 justify-center text-[10vw] leading-[1.03] tracking-[-0.015em] text-primary-700 md:text-[5.4vw] xl:text-[66px]"
              />
            </h1>

            <span data-hero-line className="mx-auto mt-8 block h-px w-24 bg-neutral-300" />

            <p data-hero-cta className="mx-auto mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
              Find answers to the most common questions about our products, services,
              partnerships, and customer support.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                data-hero-cta
                href="/contact-us/"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
              >
                Contact Our Team
                <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
              <a
                data-hero-cta
                href="/products"
                className="inline-flex w-full items-center justify-center rounded-sm border border-neutral-300 bg-white/60 px-8 py-4 font-sans text-body font-medium text-neutral-800 backdrop-blur-md transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-white hover:shadow-soft sm:w-auto"
              >
                Explore Products
              </a>
            </div>
          </div>

          <div ref={cueRef} className="absolute bottom-8 left-1/2 z-raised -translate-x-1/2">
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
