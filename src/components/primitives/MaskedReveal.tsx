"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * MaskedReveal - the signature image unveil (Scroll Storyboard, Scene 03).
 *
 * A clip-path edge glides across the content, unveiling it like a curtain
 * drawn or light sweeping a surface. Combined with a slow inner scale-settle
 * (1.06 -> 1.0) so the image "arrives" rather than "appears". Only clip-path
 * and transform animate - both GPU-friendly.
 *
 * Reduced motion: content is shown immediately, fully revealed.
 */

type Direction = "up" | "left";

export function MaskedReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  trigger = "scroll",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  trigger?: "mount" | "scroll";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;

    const clipFrom =
      direction === "up"
        ? "inset(100% 0% 0% 0%)"
        : "inset(0% 100% 0% 0%)";

    const inner = ref.current.querySelector<HTMLElement>("[data-reveal-inner]");

    const ctx = gsap.context(() => {
      gsap.set(ref.current, { clipPath: clipFrom, webkitClipPath: clipFrom });
      if (inner) gsap.set(inner, { scale: 1.06 });

      const tl = gsap.timeline({
        delay,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: ref.current, start: "top 80%", once: true }
            : undefined,
      });

      tl.to(ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        webkitClipPath: "inset(0% 0% 0% 0%)",
        duration: DURATION.hero,
        ease: EASE.luxury,
      });
      if (inner) {
        tl.to(inner, { scale: 1, duration: 1.4, ease: EASE.luxury }, 0);
      }
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, direction, delay, trigger]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div data-reveal-inner className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
