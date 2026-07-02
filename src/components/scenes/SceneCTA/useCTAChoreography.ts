"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

/**
 * useCTAChoreography - closing CTA reveal. No new utilities. RevealText handles
 * the heading; this hook fades the eyebrow / paragraph / buttons up in a slow
 * luxury stagger and applies the almost-invisible section scale 0.99 -> 1.
 * Reduced motion: everything visible and static.
 */
export function useCTAChoreography(rootRef: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-cta-fade]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-cta-scale]", { scale: 0.99, transformOrigin: "50% 50%" });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        })
        .to("[data-cta-scale]", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .to(
          "[data-cta-fade]",
          { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.16 },
          0.3
        );
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
