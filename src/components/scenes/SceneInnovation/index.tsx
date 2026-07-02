"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { RevealText } from "@/components/primitives/RevealText";
import { useInnovationChoreography } from "./useInnovationChoreography";

// WebGL particle atmosphere: client-only + code-split.
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

/**
 * SCENE 03 - THE MISSION (existing "Our Mission" section, content preserved).
 *
 * Content verbatim from the client About page:
 *   eyebrow: "Our Mission"
 *   lead:    "Our mission is to offer practical solutions to problems within
 *             the volatile sector of animal health."
 *   support: the two following sentences, word-for-word.
 *
 * NOTE: the source site has a Mission but NO Vision statement anywhere; none is
 * fabricated (content-freeze). Presented as a reflective statement "breath"
 * (Experience Bible): a luminous scientific field, subtle particle depth, and
 * the mission surfacing clause-by-clause. All Design System tokens.
 */
export function SceneInnovation() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const { inView } = useInnovationChoreography(rootRef, scrollProgress);

  return (
    <section ref={rootRef} aria-labelledby="mission-heading" className="relative bg-pure">
      <div className="relative h-[210svh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
          <div data-innov-dissolve className="relative w-full">
            {/* atmospheric brighten */}
            <div
              data-innov-bg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(95% 75% at 50% 40%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 60%)",
              }}
            />

            {/* microscopic particle atmosphere */}
            <div data-depth-2 className="absolute inset-0">
              <ParticleField scrollProgressRef={scrollProgress} />
            </div>

            {/* faint technical grid */}
            <div
              data-depth-1
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(20,35,44,0.026) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.026) 1px, transparent 1px)",
                backgroundSize: "92px 92px",
              }}
            />

            {/* the statement */}
            <div
              data-parallax-content
              className="relative z-raised mx-auto w-full max-w-container px-6 py-[14vh] will-change-transform md:px-12 md:py-0 xl:px-20"
            >
              {/* floating editorial image — fills the right, sits behind the statement */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-1/2 z-base hidden -translate-y-1/2 lg:block xl:right-20"
              >
                <div className="relative aspect-[2/3] w-[26vw] max-w-[380px] overflow-hidden rounded-[28px] border border-secondary-500/20 bg-white shadow-floating">
                  <Image
                    src="/mission.png"
                    alt="Agriprom Pakistan mission and vision"
                    fill
                    loading="lazy"
                    sizes="380px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* slate + eyebrow */}
              <div data-innov-eyebrow className="mb-10 flex items-center gap-4">
                <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">
                  (03)
                </span>
                <span className="h-px w-10 bg-neutral-300" />
                <span className="font-serif text-small italic text-neutral-400">
                  The Mission
                </span>
              </div>

              <div data-innov-eyebrow className="mb-8 flex items-center gap-4">
                <span className="h-px w-10 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
                  Our Mission
                </span>
              </div>

              {/* lead statement - surfaces clause-by-clause, lit by one sheen */}
              <div className="relative max-w-4xl overflow-hidden pb-[0.1em]">
                <span
                  data-innov-sheen
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/3 opacity-0"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent)",
                  }}
                />
                <h2
                  id="mission-heading"
                  className="font-display font-light leading-[1.16] tracking-[-0.01em] text-neutral-900"
                >
                  <RevealText
                    text="Our mission is to offer practical solutions to problems within the volatile sector of"
                    as="span"
                    play={inView}
                    delay={0.15}
                    stagger={0.045}
                    className="justify-start text-[6.5vw] md:text-[3.1vw] xl:text-[42px]"
                  />
                  <RevealText
                    text="animal health."
                    as="span"
                    play={inView}
                    delay={0.75}
                    stagger={0.045}
                    className="justify-start text-[6.5vw] text-primary-700 md:text-[3.1vw] xl:text-[42px]"
                  />
                </h2>
              </div>

              {/* supporting sentences - verbatim */}
              <div className="mt-10 max-w-2xl space-y-5">
                <p
                  data-innov-fade
                  className="text-pretty font-sans text-body-lg text-neutral-600"
                >
                  We constantly endeavor to understand the needs of our clients, and the
                  livestock industry, and identify opportunities, to provide solutions.
                </p>
                <p
                  data-innov-fade
                  className="text-pretty font-sans text-body-lg text-neutral-600"
                >
                  We continuously upgrade our products and conceptual services to improve
                  the economy and productivity of livestock farmers, both at the farm and
                  corporate levels.
                </p>
              </div>
            </div>

            {/* exit bloom into light */}
            <div
              data-innov-white
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-white opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
