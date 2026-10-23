"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * ABOUT · SCENE 04 — MISSION & VISION.
 *
 * Two large premium glass panels on a soft scientific gradient, each with an
 * editorial image above it, inside its own column. Mission anchors the left;
 * Vision drops and offsets to the right for editorial asymmetry. The cards
 * arrive from opposite directions (a quick, responsive entrance) and then stay
 * static.
 * Reuses GlassCard, RevealText (one per heading), the GSAP clock and every token.
 */

const ICON_MISSION = "/images/agriprom-images/pages/mission-icon.png";
const ICON_VISION = "/images/agriprom-images/pages/vision-icon.png";

/** Line icon in a soft rounded box — replaces the former editorial photo. */
function PanelIcon({ src }: { src: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-36 w-36 items-center justify-center rounded-[28px] border border-secondary-500/20 bg-white shadow-soft md:h-44 md:w-44"
    >
      <div
        className="h-[120px] w-[120px] bg-accent-500 md:h-36 md:w-36"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
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
      gsap.set("[data-mv-card='mission']", { autoAlpha: 0, x: -48, y: 16 });
      gsap.set("[data-mv-card='vision']", { autoAlpha: 0, x: 48, y: 16 });

      // Responsive entrance — shorter durations, same easing.
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 68%", toggleActions: "play none none none" },
        })
        .to("[data-mv-card='mission']", { autoAlpha: 1, x: 0, y: 0, duration: 0.7 }, 0.15)
        .to("[data-mv-card='vision']", { autoAlpha: 1, x: 0, y: 0, duration: 0.7 }, 0.3);
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

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        <span id="about-mv-heading" className="sr-only">
          Our Mission and Vision
        </span>

        {/* two panels — each text left, image right */}
        <div className="flex flex-col gap-16 md:gap-24">
          {/* MISSION — left, anchored */}
          <div data-mv-card="mission" className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
            <GlassCard className="min-w-0 p-8 md:p-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
                  Our Mission
                </span>
              </div>
              <h3 className="font-display font-light leading-[1.06] tracking-[-0.01em] text-neutral-900">
                <RevealText
                  text="Advancing Health, Farm by Farm"
                  as="span"
                  trigger="scroll"
                  stagger={0.05}
                  className="justify-start text-[8vw] md:text-[3.4vw] xl:text-[42px]"
                />
              </h3>
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900">
                To advance animal health and productivity across Pakistan by delivering
                globally-qualified, science-driven solutions — with integrity, quality and
                unwavering support for the people who raise the nation&rsquo;s livestock.
              </p>
            </GlassCard>
            <div className="order-first flex justify-center md:order-none">
              <PanelIcon src={ICON_MISSION} />
            </div>
          </div>

          {/* VISION — right, dropped for asymmetry */}
          <div data-mv-card="vision" className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
            <GlassCard className="min-w-0 p-8 md:p-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
                  Our Vision
                </span>
              </div>
              <h3 className="font-display font-light leading-[1.06] tracking-[-0.01em] text-neutral-900">
                <RevealText
                  text="Pakistan's Most Trusted Partner"
                  as="span"
                  trigger="scroll"
                  stagger={0.05}
                  className="justify-start text-[8vw] md:text-[3.4vw] xl:text-[42px]"
                />
              </h3>
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900">
                To be Pakistan&rsquo;s most trusted partner in animal health — connecting global
                scientific innovation with local expertise to build a healthier, more
                sustainable and more resilient food chain.
              </p>
            </GlassCard>
            <div className="order-first flex justify-center md:order-none">
              <PanelIcon src={ICON_VISION} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
