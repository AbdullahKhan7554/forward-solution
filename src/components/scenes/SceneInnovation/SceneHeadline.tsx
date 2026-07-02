"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";

/**
 * SceneHeadline - reusable eyebrow + multi-line display typography.
 * Encapsulates its own reveal: the eyebrow fades up, then each line surfaces
 * via RevealText with generous spacing. Gated by `play` so a scene's
 * choreography decides exactly when it begins. Reduced-motion safe (RevealText
 * renders plain; eyebrow stays visible).
 */
export function SceneHeadline({
  play,
  eyebrow,
  lines,
  className,
  lineClassName,
}: {
  play: boolean;
  eyebrow: string;
  lines: { text: string; className?: string }[];
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !ref.current) return;
    gsap.set(ref.current.querySelectorAll("[data-eyebrow]"), { autoAlpha: 0, y: 14 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!play || reducedRef.current || playedRef.current || !ref.current) return;
    playedRef.current = true;
    gsap.to(ref.current.querySelectorAll("[data-eyebrow]"), {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, [play]);

  return (
    <div ref={ref} className={className}>
      <div data-eyebrow className="mb-7 flex items-center gap-4">
        <span className="h-px w-10 bg-accent-500" />
        <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
          {eyebrow}
        </span>
      </div>

      <h2 className={cn("font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900")}>
        {lines.map((line, i) => (
          <RevealText
            key={line.text}
            text={line.text}
            as="span"
            play={play}
            delay={0.15 + i * 0.35}
            stagger={0.06}
            className={cn("justify-start", lineClassName, line.className)}
          />
        ))}
      </h2>
    </div>
  );
}
