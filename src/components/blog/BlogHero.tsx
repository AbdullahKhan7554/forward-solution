"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

/**
 * BLOG · SCENE 01 — THE KNOWLEDGE CENTER (HERO).
 *
 * Reuses the homepage/About hero architecture wholesale — the sticky runway,
 * one scroll driving parallax + a scrubbed exit, and the same reveal grammar
 * (fade → hairline draw → one sheen → action). The only substitution is the
 * backdrop: instead of the WebGL light-field this chapter opens on soft
 * editorial laboratory photography (the graded LabPlate) beneath very subtle
 * scientific gradients — the calm, evidence-led tone of a knowledge library.
 */
export function BlogHero() {
  const { phase } = useIntro();
  const outerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  // Scrubbed parallax + exit — one scroll, every layer moving in concert.
  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !outerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.to(bgRef.current, { yPercent: 8, scale: 1.06, ease: "none" }, 0);
      tl.to(contentRef.current, { yPercent: -20, autoAlpha: 0, ease: "power1.in" }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.25 }, 0);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  // Prime the reveal states before first paint.
  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current || !contentRef.current) return;
    const root = contentRef.current;
    gsap.set(root.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16 });
    gsap.set(root.querySelectorAll("[data-hero-cta]"), { autoAlpha: 0, y: 20 });
    gsap.set(root.querySelectorAll("[data-hero-line]"), {
      scaleX: 0,
      transformOrigin: "0% 50%",
    });
    gsap.set(root.querySelectorAll("[data-sheen]"), { xPercent: -140, autoAlpha: 0 });
  }, []);

  // Reveal cascade — keyed off the shared intro clock, tuned to the brand rhythm.
  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !contentRef.current) return;
    playedRef.current = true;
    const root = contentRef.current;

    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-hero-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
        stagger: 0.12,
      });

      gsap.to(root.querySelectorAll("[data-hero-line]"), {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        delay: 0.45,
      });

      gsap.to(root.querySelectorAll("[data-sheen]"), {
        keyframes: [
          { autoAlpha: 0.5, duration: 0.2 },
          { xPercent: 140, duration: 1.1, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.3 },
        ],
        delay: 1.35,
      });

      gsap.to(root.querySelectorAll("[data-hero-cta]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.9,
        stagger: 0.12,
      });
    }, root);

    return () => ctx.revert();
  }, [revealing]);

  return (
    <section
      aria-label="Agriprom Knowledge Center — insights that drive better animal health"
      className="relative"
    >
      {/* Scroll runway for the sticky stage. */}
      <div ref={outerRef} className="relative h-[170svh]">
        <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-base">
          {/* Soft editorial laboratory photography — the graded LabPlate. */}
          <div ref={bgRef} className="absolute inset-0 will-change-transform">
            <LabPlate src="/images/herohome/1.png" alt="" />
          </div>

          {/* Very subtle scientific gradients — legibility scrim + emerald whisper */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 26% 82%, rgba(250,251,252,0.78) 0%, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0) 66%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 45% at 82% 12%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 60%)",
            }}
          />

          {/* Foreground composition */}
          <div className="relative z-raised h-full">
            <div
              ref={contentRef}
              className="flex h-full w-full flex-col justify-between px-6 pb-[9vh] pt-[17vh] will-change-transform md:px-12 md:pb-[10vh] xl:px-20"
            >
              {/* Eyebrow — top-left */}
              <div data-hero-fade className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
                  Knowledge Center
                </span>
              </div>

              {/* Lower-left mass: slate + headline + paragraph + CTA */}
              <div className="max-w-2xl">
                {/* film-slate row */}
                <div className="mb-6 flex items-center gap-4">
                  <span
                    data-hero-fade
                    className="font-sans text-caption tracking-[0.2em] text-neutral-400"
                  >
                    (01)
                  </span>
                  <span data-hero-line className="h-px flex-1 bg-neutral-300" />
                  <span data-hero-fade className="font-serif text-small italic text-neutral-400">
                    The Knowledge
                  </span>
                </div>

                {/* H1 — surfacing line-by-line, lit by one sheen */}
                <h1 className="relative overflow-hidden pb-[0.08em] font-display font-light text-neutral-900">
                  <span
                    data-sheen
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/3"
                    style={{
                      background:
                        "linear-gradient(100deg, transparent, rgba(255,255,255,0.9), transparent)",
                    }}
                  />
                  <RevealText
                    text="Insights That Drive"
                    as="span"
                    play={revealing}
                    delay={0.5}
                    stagger={0.06}
                    className="justify-start text-[9vw] leading-[1.03] tracking-[-0.015em] md:text-[5.1vw] xl:text-[60px]"
                  />
                  <RevealText
                    text="Better Animal Health"
                    as="span"
                    play={revealing}
                    delay={1.15}
                    stagger={0.06}
                    className="mt-2 justify-start text-[9vw] leading-[1.03] tracking-[-0.015em] text-primary-700 md:text-[5.1vw] xl:text-[60px]"
                  />
                </h1>

                {/* Paragraph */}
                <p
                  data-hero-cta
                  className="mt-8 max-w-[58ch] text-pretty font-sans text-body-lg text-neutral-600"
                >
                  Explore expert articles covering poultry, livestock, companion animals,
                  veterinary medicine, nutrition and scientific innovations.
                </p>

                {/* Primary button — same as the other heroes */}
                <a
                  data-hero-cta
                  href="#articles"
                  className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out hover:bg-primary-700"
                >
                  Explore Articles
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Scroll mark — lower-right, balancing the lower-left mass */}
          <div ref={cueRef} className="absolute bottom-8 right-6 z-raised md:right-12 xl:right-20">
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
