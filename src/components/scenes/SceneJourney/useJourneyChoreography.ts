"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/scroll-trigger";

/**
 * useJourneyChoreography - scene choreography for Scene 06. No new utilities:
 * images/names reveal via MaskedReveal / RevealText themselves. This hook only
 * adds:
 *
 *   FADE  - index / description / rule fade up as each chapter enters
 *           (ScrollTrigger.batch), earned by scroll.
 *
 * Reduced motion: nothing runs; every element is visible and static.
 */
export function useJourneyChoreography(rootRef: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // earned fades
      gsap.set("[data-journey-fade]", { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch("[data-journey-fade]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef]);
}
