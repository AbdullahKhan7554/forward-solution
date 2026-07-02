"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useInsightsChoreography - scene choreography for the Insights scene. No new
 * utilities. RevealText handles the heading; MaskedReveal handles the featured
 * image. This hook adds the eyebrow/paragraph fade-ups and the sequential
 * card stagger. Reduced motion: everything visible and static.
 */
export function useInsightsChoreography(rootRef: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-insights-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-insights-fade]", {
        start: "top 86%",
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

      gsap.set("[data-insight]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-insight]", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.16,
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
