"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { RevealText } from "@/components/primitives/RevealText";
import { useVisionChoreography } from "./useVisionChoreography";

// Luminous particle atmosphere, tuned for a dark field. Client-only, code-split.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

/**
 * SCENE 04 - THE VISION (new scene; Mission scene left intact).
 *
 * The client site has no dedicated Vision statement, so this presents the real
 * homepage Company Values statement (verbatim) as the forward-looking vision.
 * Swap the copy in one place when official Vision text is supplied.
 *
 * Rendered as the Visual Moodboard's single reserved DARK counterpoint: the
 * statement glowing in light on a deep field, luminous motes drifting, the
 * lights lowering as you enter. All Design System tokens.
 */
export function SceneVision() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const { inView } = useVisionChoreography(rootRef, scrollProgress);

  return (
    <section ref={rootRef} aria-labelledby="vision-heading" className="relative bg-dark">
      <div className="relative h-[210svh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
          <div data-vision-dissolve className="relative w-full">
            {/* deep-field depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(100% 80% at 50% 34%, #16242D 0%, #0B1116 62%)",
              }}
            />

            {/* luminous particle atmosphere */}
            <div data-depth-2 className="absolute inset-0">
              <ParticleField scrollProgressRef={scrollProgress} color={[0.6, 0.82, 0.78]} />
            </div>

            {/* faint technical grid (light-on-dark) */}
            <div
              data-depth-1
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
                backgroundSize: "92px 92px",
              }}
            />

            {/* content */}
            <div
              data-parallax-content
              className="relative z-raised mx-auto w-full max-w-container px-6 py-[14vh] will-change-transform md:px-12 md:py-0 xl:px-20"
            >
              <div data-vision-slate className="mb-12 flex items-center gap-4">
                <span className="font-sans text-caption tracking-[0.2em] text-neutral-500">
                  (04)
                </span>
                <span className="h-px w-10 bg-white/20" />
                <span className="font-serif text-small italic text-neutral-400">
                  The Vision
                </span>
              </div>

              <div className="grid grid-cols-1 items-start gap-x-10 gap-y-10 md:grid-cols-12">
                {/* heading - left */}
                <h2
                  id="vision-heading"
                  className="font-display font-light leading-[1.06] tracking-[-0.015em] text-neutral-50 md:col-span-6"
                >
                  <RevealText
                    text="Where Integrity Meets Ingenuity"
                    as="span"
                    play={inView}
                    delay={0.15}
                    stagger={0.06}
                    className="justify-start text-[9vw] md:text-[4vw] xl:text-[52px]"
                  />
                  <RevealText
                    text="for a Better Tomorrow."
                    as="span"
                    play={inView}
                    delay={0.8}
                    stagger={0.06}
                    className="mt-1 justify-start text-[9vw] text-accent-300 md:text-[4vw] xl:text-[52px]"
                  />
                </h2>

                {/* body - right (verbatim, split into two paragraphs) */}
                <div className="space-y-5 md:col-span-5 md:col-start-8">
                  <p
                    data-vision-fade
                    className="text-pretty font-sans text-body-lg text-neutral-300"
                  >
                    At AgriProm we believe that the key to developing the best products
                    lies in close collaboration with our partners. This partnership is
                    fundamental to creating high-quality, safe additives and ingredients
                    that support livestock. Our focus isn&rsquo;t just on delivering
                    top-quality products&mdash;it&rsquo;s about creating lasting value for
                    communities worldwide.
                  </p>
                  <p
                    data-vision-fade
                    className="text-pretty font-sans text-body-lg text-neutral-300"
                  >
                    At every stage, from innovation and production to delivery and on-farm
                    use,{" "}
                    <span className="text-accent-300">
                      sustainability remains our guiding principle
                    </span>
                    . We blend scientific expertise with a strong sense of responsibility
                    to ensure our feed additives contribute not only to animal health but
                    also to a more sustainable and resilient food chain. With every
                    solution, we aim to nurture both livestock and the planet.
                  </p>
                </div>
              </div>
            </div>

            {/* enter veil - white dims out to reveal the deep field */}
            <div
              data-vision-veil
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-overlay bg-white opacity-0"
            />
            {/* exit bloom - back to light for the next scene */}
            <div
              data-vision-white
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-overlay bg-white opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
