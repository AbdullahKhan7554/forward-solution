"use client";

import { useRef, type ElementType } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/scroll-trigger";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * RevealText - the brand's type entrance.
 *
 * The whole line fades up once as a single block (opacity + a small rise) —
 * no per-word split, so long headings cost one tween instead of one per word.
 *
 * Trigger modes:
 *   - play === undefined : "mount" plays on load, "scroll" plays once in view.
 *   - play === boolean    : CONTROLLED. Stays hidden until `play` turns true.
 *     Used to gate the hero headline behind the loading curtain.
 *
 * `stagger` is kept for API compatibility; a single block has nothing to stagger.
 * Reduced motion: renders plain, fully-visible text. No motion.
 */

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: "mount" | "scroll";
  stagger?: number;
  /** tween length in seconds (default 0.9) */
  duration?: number;
  /** controlled gate - when provided, reveal waits until this is true */
  play?: boolean;
};

export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  trigger = "mount",
  duration = 0.9,
  play,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const controlled = play !== undefined;

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;

    const line = ref.current.querySelector<HTMLElement>("[data-reveal-line]");
    if (!line) return;

    const ctx = gsap.context(() => {
      gsap.set(line, { opacity: 0, y: 16 });
      const to = { opacity: 1, y: 0, duration, ease: EASE.luxury, delay };

      if (controlled) {
        if (play) gsap.to(line, to);
      } else if (trigger === "scroll") {
        gsap.to(line, {
          ...to,
          scrollTrigger: { trigger: ref.current, start: "top 82%", toggleActions: "play none none none" },
        });
      } else {
        gsap.to(line, to);
      }
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, play, controlled, delay, duration, trigger]);

  if (reducedMotion) {
    // Same block-level flex container as the animated path so consecutive
    // RevealText lines each keep their own line (and don't run together).
    return <Tag className={cn("flex flex-wrap", className)}>{text}</Tag>;
  }

  return (
    <Tag ref={ref} className={cn("flex flex-wrap", className)}>
      <span data-reveal-line className="inline-block" style={{ paddingBottom: "0.12em" }}>
        {text}
      </span>
    </Tag>
  );
}
