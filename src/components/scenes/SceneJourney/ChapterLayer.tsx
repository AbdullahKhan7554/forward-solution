"use client";

import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { RevealText } from "@/components/primitives/RevealText";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * ChapterLayer - one full-viewport documentary chapter of the Product Journey.
 * Editorial split (image / type), alternating L-R; chapters stack vertically.
 *
 * Reuses MaskedReveal (image unveil + settle) and RevealText (name). The fades
 * (data-journey-fade) are driven by useJourneyChoreography.
 */
export function ChapterLayer({
  index,
  name,
  description,
  imageSrc,
  side,
}: {
  index: number;
  name: string;
  description: string;
  imageSrc?: string;
  side: "left" | "right";
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      data-journey-chapter
      aria-labelledby={`journey-ch-${num}`}
      className="relative h-[100svh] w-full overflow-hidden bg-pure"
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
        </div>

        {/* TYPE */}
        <div className="flex h-[54%] w-full flex-col justify-center px-6 md:h-full md:w-1/2 md:px-12 xl:px-20">
          <div data-journey-fade className="mb-6 flex items-baseline gap-2">
            <span className="font-display text-h4 font-light text-primary-700">{num}</span>
            <span className="font-sans text-caption tracking-[0.22em] text-neutral-900">
              / 04
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
            className="mt-7 max-w-[42ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            {description}
          </p>

          <span data-journey-fade className="mt-9 block h-px w-16 bg-accent-500" />
        </div>
      </div>
    </article>
  );
}
