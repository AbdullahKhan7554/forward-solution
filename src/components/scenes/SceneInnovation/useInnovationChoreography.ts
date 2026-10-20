"use client";

import { useState, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useInnovationChoreography - motion for Scene 03 (the Mission statement),
 * isolated from the view.
 *
 *   REVEAL   - timed: light comes up -> eyebrow/slate settle -> the mission
 *              statement surfaces clause-by-clause (lit by one sheen) ->
 *              supporting sentences fade up.
 *
 * A reflective "breath" per the Experience Bible - spare, patient, type-led.
 * Plays once on entry. Returns `inView` to gate the
 * statement. Reduced motion: static, fully legible, zero motion.
 */
export function useInnovationChoreography(
  rootRef: RefObject<HTMLElement>
) {
  const [inView, setInView] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setInView(true);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set("[data-innov-bg]", { autoAlpha: 0 });
      gsap.set("[data-innov-eyebrow]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-innov-fade]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-innov-sheen]", { xPercent: -140, autoAlpha: 0 });
      gsap.set("[data-innov-white]", { autoAlpha: 0 });

      // --- REVEAL (timed, once) ------------------------------------------
      const reveal = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 65%", toggleActions: "play none none none" },
      });

      reveal
        .to("[data-innov-bg]", { autoAlpha: 1, duration: 2.0 }, 0)
        .to("[data-innov-eyebrow]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.5)
        .add(() => setInView(true), 0.9)
        .to(
          "[data-innov-sheen]",
          {
            keyframes: [
              { autoAlpha: 0.45, duration: 0.25 },
              { xPercent: 140, duration: 1.5, ease: "power2.inOut" },
              { autoAlpha: 0, duration: 0.35 },
            ],
          },
          2.2
        )
        .to("[data-innov-fade]", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.25 }, 2.6);
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef]);

  return { inView };
}
