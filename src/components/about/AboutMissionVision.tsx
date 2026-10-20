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
 * Two large premium glass panels on a soft scientific gradient, each with an
 * editorial image above it, inside its own column. Mission anchors the left;
 * Vision drops and offsets to the right for editorial asymmetry. The cards
 * arrive from opposite directions (a quick, responsive entrance) and then stay
 * static.
 * Reuses GlassCard, RevealText (one per heading), the GSAP clock and every token.
 */

const IMG_MISSION = "/mission.jpg";
const IMG_VISION = "/images/heroabout/h4.png";

/** Editorial image — aspect-ratio wrapper (zero CLS) + glass. */
function FloatingImage({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-secondary-500/20 shadow-floating">
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 767px) 100vw, 45vw"
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

        {/* two panels — editorial asymmetry across a 12-col field */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10">
          {/* MISSION — left, anchored */}
          <div data-mv-card="mission" className="relative md:col-span-6">
            <FloatingImage
              src={IMG_MISSION}
              className="relative mb-8 aspect-[16/10] w-full"
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
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900">
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
              className="relative mb-8 aspect-[16/10] w-full"
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
              <p className="mt-7 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900">
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
