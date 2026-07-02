"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * ABOUT · SCENE 04 — MISSION & VISION.
 *
 * Two large premium glass panels on a soft scientific gradient, each paired with
 * a floating editorial image that partially overlaps the card. Mission anchors
 * the left; Vision drops and offsets to the right for editorial asymmetry. The
 * cards arrive from opposite directions (a quick, responsive entrance) and then
 * stay static; only the images parallax — drifting a touch slower than the page.
 * Reuses GlassCard, RevealText (one per heading), the GSAP clock and every token.
 */

const IMG_MISSION = "/mission.png";
const IMG_VISION = "/images/heroabout/h4.png";

/** Floating luxury editorial image — sized wrapper (zero CLS) + parallax + glass. */
function FloatingImage({
  src,
  className,
  speed,
}: {
  src: string;
  className: string;
  speed: number;
}) {
  return (
    <div
      data-mv-parallax
      data-speed={speed}
      aria-hidden="true"
      className={className}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-secondary-500/20 shadow-floating">
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 767px) 100vw, (max-width: 1280px) 210px, 240px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function AboutMissionVision() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-mv-slate]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-mv-card='mission']", { autoAlpha: 0, x: -48, y: 16 });
      gsap.set("[data-mv-card='vision']", { autoAlpha: 0, x: 48, y: 16 });

      // Responsive entrance — shorter durations, same easing.
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 68%", once: true },
        })
        .to("[data-mv-slate]", { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
        .to("[data-mv-card='mission']", { autoAlpha: 1, x: 0, y: 0, duration: 0.7 }, 0.15)
        .to("[data-mv-card='vision']", { autoAlpha: 1, x: 0, y: 0, duration: 0.7 }, 0.3);

      // Subtle parallax — images only, drifting slower than the page.
      root.querySelectorAll<HTMLElement>("[data-mv-parallax]").forEach((el) => {
        const sp = Number(el.dataset.speed || 12);
        gsap.to(el, {
          yPercent: -sp,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="about-mv-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft scientific gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 18% 12%, rgba(219,239,231,0.5) 0%, rgba(255,255,255,0) 55%), radial-gradient(70% 55% at 88% 92%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate caption */}
        <div data-mv-slate className="mb-14 flex items-center gap-4 md:mb-20">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(04)</span>
          <span className="h-px w-10 bg-neutral-300" />
          <span className="font-serif text-small italic text-neutral-400">Mission &amp; Vision</span>
          <span id="about-mv-heading" className="sr-only">
            Our Mission and Vision
          </span>
        </div>

        {/* two panels — editorial asymmetry across a 12-col field */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10">
          {/* MISSION — left, anchored */}
          <div data-mv-card="mission" className="relative md:col-span-6">
            <FloatingImage
              src={IMG_MISSION}
              speed={14}
              className="relative z-raised mb-8 h-[220px] w-full md:absolute md:-right-8 md:-top-16 md:mb-0 md:h-[300px] md:w-[200px] xl:h-[345px] xl:w-[230px]"
            />
            <GlassCard className="h-full p-8 md:p-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
                  Our Mission
                </span>
              </div>
              <h3 className="font-display font-light leading-[1.06] tracking-[-0.01em] text-neutral-900">
                <RevealText
                  text="Advancing health, farm by farm"
                  as="span"
                  trigger="scroll"
                  stagger={0.05}
                  className="justify-start text-[8vw] md:text-[3.4vw] xl:text-[42px]"
                />
              </h3>
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">
                To advance animal health and productivity across Pakistan by delivering
                globally-qualified, science-driven solutions — with integrity, quality and
                unwavering support for the people who raise the nation&rsquo;s livestock.
              </p>
            </GlassCard>
          </div>

          {/* VISION — right, dropped for asymmetry */}
          <div data-mv-card="vision" className="relative md:col-span-5 md:col-start-8 md:mt-[12vh]">
            <FloatingImage
              src={IMG_VISION}
              speed={10}
              className="relative z-raised mb-8 h-[220px] w-full md:absolute md:-bottom-12 md:-left-8 md:mb-0 md:h-[260px] md:w-[210px] xl:h-[300px] xl:w-[240px]"
            />
            <GlassCard className="h-full p-8 md:p-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
                  Our Vision
                </span>
              </div>
              <h3 className="font-display font-light leading-[1.06] tracking-[-0.01em] text-neutral-900">
                <RevealText
                  text="Pakistan's most trusted partner"
                  as="span"
                  trigger="scroll"
                  stagger={0.05}
                  className="justify-start text-[8vw] md:text-[3.4vw] xl:text-[42px]"
                />
              </h3>
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">
                To be Pakistan&rsquo;s most trusted partner in animal health — connecting global
                scientific innovation with local expertise to build a healthier, more
                sustainable and more resilient food chain.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
