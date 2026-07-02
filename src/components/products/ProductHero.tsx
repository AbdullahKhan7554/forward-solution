"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

// WebGL cannot server-render; load the shared atmosphere client-only.
const HeroAtmosphere = dynamic(
  () => import("@/components/canvas/HeroAtmosphere").then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => null }
);

/**
 * PRODUCTS · SCENE 01 — THE PORTFOLIO (Hero).
 *
 * Chapter Three opens on the very same stage as the Homepage and About heroes:
 * the shared WebGL world (soft-daylight animated gradient + drifting motes), the
 * sticky runway that holds for one-and-a-bit viewports, one scroll driving DOM
 * parallax + a scrubbed exit while feeding the camera push, and the same reveal
 * grammar (fade → hairline draw → one sheen → actions). Reused wholesale —
 * HeroAtmosphere, RevealText, ScrollCue, the intro clock, motion tokens.
 */
export function ProductHero() {
  const { phase } = useIntro();
  const outerRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.to(atmosphereRef.current, { yPercent: 6, ease: "none" }, 0);
      tl.to(contentRef.current, { yPercent: -20, autoAlpha: 0, ease: "power1.in" }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.25 }, 0);
    }, outerRef);

    return () => ctx.revert();
  }, []);

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
      aria-label="Agriprom Pakistan products — scientific solutions for every stage of animal health"
      className="relative"
    >
      <div ref={outerRef} className="relative h-[170svh]">
        <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-base">
          {/* Layered WebGL world — soft-daylight animated gradient + motes */}
          <div ref={atmosphereRef} className="absolute inset-0 will-change-transform">
            <HeroAtmosphere active={revealing} scrollProgressRef={scrollProgress} />
          </div>

          {/* Asymmetric vignette — seats the mass lower-left, opens the light upper-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 90% at 30% 78%, rgba(250,251,252,0.55) 0%, rgba(255,255,255,0) 45%)",
            }}
          />

          {/* Foreground composition */}
          <div className="relative z-raised h-full">
            <div
              ref={contentRef}
              className="flex h-full w-full flex-col justify-between px-6 pb-[9vh] pt-[17vh] will-change-transform md:px-12 md:pb-[10vh] xl:px-20"
            >
              {/* Eyebrow */}
              <div data-hero-fade className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
                  Products
                </span>
              </div>

              {/* Lower-left mass */}
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-4">
                  <span
                    data-hero-fade
                    className="font-sans text-caption tracking-[0.2em] text-neutral-400"
                  >
                    (01)
                  </span>
                  <span data-hero-line className="h-px flex-1 bg-neutral-300" />
                  <span data-hero-fade className="font-serif text-small italic text-neutral-400">
                    The Portfolio
                  </span>
                </div>

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
                    text="Scientific Solutions For Every"
                    as="span"
                    play={revealing}
                    delay={0.5}
                    stagger={0.06}
                    className="justify-start text-[8.5vw] leading-[1.04] tracking-[-0.015em] md:text-[4.8vw] xl:text-[58px]"
                  />
                  <RevealText
                    text="Stage Of Animal Health"
                    as="span"
                    play={revealing}
                    delay={1.15}
                    stagger={0.06}
                    className="mt-2 justify-start text-[8.5vw] leading-[1.04] tracking-[-0.015em] text-primary-700 md:text-[4.8vw] xl:text-[58px]"
                  />
                </h1>

                <p
                  data-hero-cta
                  className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
                >
                  Explore Agriprom Pakistan&rsquo;s complete portfolio of globally trusted animal
                  nutrition, veterinary and livestock solutions.
                </p>

                {/* Actions — same button pair as the homepage CTA */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    data-hero-cta
                    href="#categories"
                    className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    Explore Categories
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </a>
                  <a
                    data-hero-cta
                    href="/contact-us/"
                    className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll mark */}
          <div ref={cueRef} className="absolute bottom-8 right-6 z-raised md:right-12 xl:right-20">
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
