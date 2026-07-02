"use client";

import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { RevealText } from "@/components/primitives/RevealText";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * ChapterLayer - one full-viewport documentary chapter of the Product Journey.
 * Editorial split (image / type), alternating L-R. On desktop with motion the
 * chapters are sticky so each one is covered by the next (the melt); on mobile
 * / reduced motion they stack vertically (sequential storytelling).
 *
 * Reuses MaskedReveal (image unveil + settle) and RevealText (name). The image
 * push-in (data-journey-push) and the fades (data-journey-fade) are driven by
 * useJourneyChoreography.
 */
export function ChapterLayer({
  index,
  name,
  description,
  imageSrc,
  side,
  sticky,
}: {
  index: number;
  name: string;
  description: string;
  imageSrc?: string;
  side: "left" | "right";
  sticky: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      data-journey-chapter
      aria-labelledby={`journey-ch-${num}`}
      className={cn(
        "relative h-[100svh] w-full overflow-hidden bg-pure",
        sticky && "md:sticky md:top-0"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col md:flex-row",
          side === "right" && "md:flex-row-reverse"
        )}
      >
        {/* IMAGE */}
        <div className="relative h-[46%] w-full md:h-full md:w-1/2">
          <div data-journey-push className="h-full w-full will-change-transform">
            <MaskedReveal
              direction={side === "right" ? "left" : "up"}
              className="h-full w-full"
            >
              <LabPlate src={imageSrc} alt={`${name} — Agriprom Pakistan`} />
            </MaskedReveal>
          </div>

          {/* scientific overlay - museum wall label */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-6 flex items-center gap-3 md:bottom-8 md:left-8"
          >
            <span className="h-px w-8 bg-white/60" />
            <span className="font-sans text-caption uppercase tracking-[0.24em] text-white/70">
              Fig. {num}
            </span>
          </div>
        </div>

        {/* TYPE */}
        <div className="flex h-[54%] w-full flex-col justify-center px-6 md:h-full md:w-1/2 md:px-12 xl:px-20">
          <div data-journey-fade className="mb-6 flex items-baseline gap-2">
            <span className="font-display text-h4 font-light text-primary-700">{num}</span>
            <span className="font-sans text-caption tracking-[0.22em] text-neutral-400">
              / 05
            </span>
          </div>

          <h2
            id={`journey-ch-${num}`}
            className="font-display font-light leading-[0.98] tracking-[-0.02em] text-neutral-900"
          >
            <RevealText
              text={name}
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-start text-[13vw] md:text-[7vw] xl:text-[88px]"
            />
          </h2>

          <p
            data-journey-fade
            className="mt-7 max-w-[42ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            {description}
          </p>

          <span data-journey-fade className="mt-9 block h-px w-16 bg-accent-500" />
        </div>
      </div>
    </article>
  );
}
