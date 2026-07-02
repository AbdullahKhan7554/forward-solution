"use client";

import { useRef, type ElementType } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * RevealText - the brand's signature type entrance.
 *
 * Each word is wrapped in an overflow-hidden mask; the word rises out from
 * *behind* a clipping edge (yPercent 115 -> 0) with a whisper of opacity and a
 * weighted deceleration. Reads as ink surfacing into light - not a UI slide.
 *
 * Trigger modes:
 *   - play === undefined : "mount" plays on load, "scroll" plays in view.
 *   - play === boolean    : CONTROLLED. Stays masked until `play` turns true.
 *     Used to gate the hero headline behind the loading curtain.
 *
 * Reduced motion: renders plain, fully-visible text. No split, no motion.
 */

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: "mount" | "scroll";
  stagger?: number;
  /** controlled gate - when provided, reveal waits until this is true */
  play?: boolean;
};

export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  trigger = "mount",
  stagger = STAGGER.text,
  play,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const words = text.split(" ");
  const controlled = play !== undefined;

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;

    const inners = ref.current.querySelectorAll<HTMLElement>("[data-word-inner]");

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 115, opacity: 0 });

      const animateIn = () =>
        gsap.to(inners, {
          yPercent: 0,
          opacity: 1,
          duration: DURATION.hero,
          ease: EASE.luxury,
          stagger,
          delay,
        });

      if (controlled) {
        if (play) animateIn();
      } else if (trigger === "scroll") {
        gsap.to(inners, {
          yPercent: 0,
          opacity: 1,
          duration: DURATION.hero,
          ease: EASE.luxury,
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        });
      } else {
        animateIn();
      }
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, play, controlled, delay, trigger, stagger]);

  if (reducedMotion) {
    // Match the animated path's block-level flex container so consecutive
    // RevealText lines each keep their own line (and don't run together).
    return <Tag className={cn("flex flex-wrap", className)}>{text}</Tag>;
  }

  return (
    <Tag ref={ref} className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.28em", paddingBottom: "0.12em" }}
        >
          <span data-word-inner className="inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
