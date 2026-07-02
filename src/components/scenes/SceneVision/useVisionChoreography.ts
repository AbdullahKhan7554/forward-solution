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
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
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

      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      scrub
        .to("[data-parallax-content]", { yPercent: -8, ease: "none" }, 0)
        .to("[data-vision-dissolve]", { autoAlpha: 0, yPercent: -3, ease: "power1.in" }, 0.72)
        .to("[data-vision-white]", { autoAlpha: 0.95, ease: "power1.in" }, 0.74);
    }, root);

    const depth = [
      { x: gsap.quickTo("[data-depth-1]", "x", { duration: 0.8, ease: "power3" }), y: gsap.quickTo("[data-depth-1]", "y", { duration: 0.8, ease: "power3" }), amt: 10 },
      { x: gsap.quickTo("[data-depth-2]", "x", { duration: 0.9, ease: "power3" }), y: gsap.quickTo("[data-depth-2]", "y", { duration: 0.9, ease: "power3" }), amt: 16 },
    ];
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      depth.forEach((d) => {
        d.x(nx * d.amt);
        d.y(ny * d.amt);
      });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef, scrollProgressRef]);

  return { inView };
}
