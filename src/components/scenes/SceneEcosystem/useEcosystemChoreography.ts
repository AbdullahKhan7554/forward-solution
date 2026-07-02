"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useEcosystemChoreography - scene choreography for Scene 05, isolated from the
 * view. No new animation utilities: images/names reveal via MaskedReveal /
 * RevealText themselves; this hook only adds what those primitives can't:
 *
 *   FADE     - ScrollTrigger.batch fades [data-eco-fade] up as each enters,
 *              so descriptions / arrows / small text are EARNED by scroll.
 *   PARALLAX - each [data-eco-parallax] drifts by its data-speed (the subtle
 *              camera push / layered depth).
 *   DEPTH    - almost-imperceptible mouse parallax on the floating highlight.
 *
 * Reduced motion: nothing runs; every element is visible and static.
 */
export function useEcosystemChoreography(rootRef: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // --- earned fade-reveals -------------------------------------------
      gsap.set("[data-eco-fade]", { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch("[data-eco-fade]", {
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

      // --- per-block parallax (subtle camera push / depth) ----------------
      gsap.utils.toArray<HTMLElement>("[data-eco-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.06");
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, root);

    // --- mouse-driven depth on the floating highlight --------------------
    const floatXTo = gsap.quickTo("[data-depth-float]", "x", { duration: 0.9, ease: "power3" });
    const floatYTo = gsap.quickTo("[data-depth-float]", "y", { duration: 0.9, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      floatXTo(nx * 14);
      floatYTo(ny * 14);
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef]);
}
