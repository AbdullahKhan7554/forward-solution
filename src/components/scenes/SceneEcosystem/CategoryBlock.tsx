"use client";

import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { RevealText } from "@/components/primitives/RevealText";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * CategoryBlock - one ecosystem category. Large image, name, one short
 * description, a minimal arrow. Nothing else.
 *
 * Reuses MaskedReveal (image unveil + settle) and RevealText (name). The image
 * and name self-reveal on scroll (earned, sequential); the description + arrow
 * fade in via the scene's ScrollTrigger.batch (data-eco-fade).
 *
 * Hover (150ms, GPU-only): image scales 1.03, shadow deepens, a hairline glow
 * appears, the arrow slides. Nesting keeps CSS hover transforms off any element
 * GSAP also transforms, so they never fight.
 */

type Variant = "feature" | "medium";

function ArrowGlyph() {
  return (
    <svg
      width="30"
      height="12"
      viewBox="0 0 30 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h27M22 1l6 5-6 5" />
    </svg>
  );
}

export function CategoryBlock({
  name,
  description,
  href,
  imageSrc,
  variant = "medium",
  className,
}: {
  name: string;
  description: string;
  href: string;
  imageSrc?: string;
  variant?: Variant;
  className?: string;
}) {
  const isFeature = variant === "feature";

  return (
    <a
      href={href}
      aria-label={`${name} — explore`}
      className={cn("group block focus:outline-none", className)}
    >
      <MaskedReveal
        className={cn(
          "relative w-full rounded-md shadow-soft ring-1 ring-transparent transition-shadow duration-150 ease-brand-out group-hover:shadow-floating group-hover:ring-primary-600/30 group-focus-visible:ring-primary-600/50",
          isFeature ? "aspect-[4/5]" : "aspect-[4/3]"
        )}
      >
        <div className="h-full w-full transition-transform duration-150 ease-brand-out group-hover:scale-[1.03]">
          <LabPlate src={imageSrc} alt={name} fit="contain" />
        </div>
      </MaskedReveal>

      <div className="mt-5 flex items-start justify-between gap-6 md:mt-6">
        <div>
          <h3
            className={cn(
              "font-display font-light tracking-[-0.01em] text-neutral-900",
              isFeature
                ? "text-[7vw] md:text-[2.6vw] xl:text-[36px]"
                : "text-[6vw] md:text-[1.9vw] xl:text-[26px]"
            )}
          >
            <RevealText
              text={name}
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-start"
            />
          </h3>
          <p
            data-eco-fade
            className="mt-2 max-w-[34ch] font-sans text-body text-neutral-600"
          >
            {description}
          </p>
        </div>

        {/* fade wrapper (GSAP) holds the slide wrapper (CSS hover) - no conflict */}
        <span data-eco-fade className="mt-1 shrink-0 text-primary-600">
          <span className="inline-block transition-transform duration-150 ease-brand-out group-hover:translate-x-1.5">
            <ArrowGlyph />
          </span>
        </span>
      </div>
    </a>
  );
}
