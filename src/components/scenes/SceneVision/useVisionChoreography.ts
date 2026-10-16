"use client";

import { useState, type MutableRefObject, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useVisionChoreography - motion for Scene 04 (the Vision), the dark
 * counterpoint. Isolated from the view.
 *
 *   ENTER    - a white veil (matching the Mission's exit-white) dims OUT to
 *              reveal the deep field: the lights lower as you enter the room.
 *   REVEAL   - slate settles -> the vision surfaces clause-by-clause (lit by
 *              one sheen) -> the body fades up.
 *   PARALLAX - scrubbed, subtle vertical drift.
 *   DISSOLVE - the tail blooms back to white for the next scene.
 *   DEPTH    - almost-imperceptible mouse parallax on the background.
 *
 * `scrollProgressRef` feeds the WebGL particles. Returns `inView` to gate the
 * heading. Reduced motion: static dark scene, fully legible, zero motion.
 */
export function useVisionChoreography(
  rootRef: RefObject<HTMLElement>,
  scrollProgressRef: MutableRefObject<number>
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
      gsap.set("[data-vision-veil]", { autoAlpha: 1 }); // covers, then dims out
      gsap.set("[data-vision-slate]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-vision-fade]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-vision-sheen]", { xPercent: -140, autoAlpha: 0 });
      gsap.set("[data-vision-white]", { autoAlpha: 0 });

      const reveal = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 65%", toggleActions: "play none none none" },
      });

      reveal
        // the lights lower - white veil dims out to reveal the deep field
        .to("[data-vision-veil]", { autoAlpha: 0, duration: 1.7, ease: "power2.inOut" }, 0)
        .to("[data-vision-slate]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.7)
        .add(() => setInView(true), 1.1)
        .to(
          "[data-vision-sheen]",
          {
            keyframes: [
              { autoAlpha: 0.4, duration: 0.25 },
              { xPercent: 140, duration: 1.5, ease: "power2.inOut" },
              { autoAlpha: 0, duration: 0.35 },
            ],
          },
          2.4
        )
        .to("[data-vision-fade]", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.25 }, 2.8);
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef, scrollProgressRef]);

  return { inView };
}
