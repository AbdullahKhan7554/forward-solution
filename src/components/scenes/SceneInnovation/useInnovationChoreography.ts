"use client";

import { useState, type MutableRefObject, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useInnovationChoreography - motion for Scene 03 (the Mission statement),
 * isolated from the view.
 *
 *   REVEAL   - timed: light comes up -> eyebrow/slate settle -> the mission
 *              statement surfaces clause-by-clause (lit by one sheen) ->
 *              supporting sentences fade up.
 *   PARALLAX - scrubbed, subtle vertical drift on the statement.
 *   DISSOLVE - the tail: statement + atmosphere dissolve into a white bloom.
 *   DEPTH    - almost-imperceptible mouse parallax on the background layers.
 *
 * A reflective "breath" per the Experience Bible - spare, patient, type-led.
 * `scrollProgressRef` feeds the WebGL particles. Returns `inView` to gate the
 * statement. Reduced motion: static, fully legible, zero motion.
 */
export function useInnovationChoreography(
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
      gsap.set("[data-innov-bg]", { autoAlpha: 0 });
      gsap.set("[data-innov-eyebrow]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-innov-fade]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-innov-sheen]", { xPercent: -140, autoAlpha: 0 });
      gsap.set("[data-innov-white]", { autoAlpha: 0 });

      // --- REVEAL (timed, once) ------------------------------------------
      const reveal = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
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

      // --- PARALLAX + DISSOLVE (scrubbed) --------------------------------
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
        .to("[data-innov-dissolve]", { autoAlpha: 0, yPercent: -3, ease: "power1.in" }, 0.72)
        .to("[data-innov-white]", { autoAlpha: 0.92, ease: "power1.in" }, 0.74);
    }, root);

    // --- mouse-driven depth on the background layers ---------------------
    const depth = [
      { x: gsap.quickTo("[data-depth-1]", "x", { duration: 0.8, ease: "power3" }), y: gsap.quickTo("[data-depth-1]", "y", { duration: 0.8, ease: "power3" }), amt: 8 },
      { x: gsap.quickTo("[data-depth-2]", "x", { duration: 0.9, ease: "power3" }), y: gsap.quickTo("[data-depth-2]", "y", { duration: 0.9, ease: "power3" }), amt: 14 },
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
