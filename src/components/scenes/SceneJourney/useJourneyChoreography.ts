"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useJourneyChoreography - scene choreography for Scene 06. No new utilities:
 * images/names reveal via MaskedReveal / RevealText themselves; the sticky melt
 * is pure CSS stacking. This hook only adds:
 *
 *   PUSH  - each chapter image scales up slowly while its chapter is held
 *           (the almost-invisible dolly), scrubbed to that chapter's scroll.
 *   FADE  - index / description / rule fade up as each chapter enters
 *           (ScrollTrigger.batch), earned by scroll.
 *
 * Reduced motion: nothing runs; every element is visible and static, chapters
 * stack vertically (sticky is not applied in the view under reduced motion).
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

      // slow push-in per chapter (dolly while held)
      gsap.utils.toArray<HTMLElement>("[data-journey-push]").forEach((el) => {
        const chapter = el.closest("[data-journey-chapter]") as HTMLElement | null;
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: chapter ?? el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef]);
}
