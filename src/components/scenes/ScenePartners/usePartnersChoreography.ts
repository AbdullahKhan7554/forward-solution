"use client";

import { type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * usePartnersChoreography - scene choreography for the Global Partners scene.
 * No new utilities. RevealText handles the heading; this hook adds:
 *   HEADER  - a thin connecting line grows, then eyebrow + paragraph fade up.
 *   PARTNERS- ScrollTrigger.batch reveals each panel as it enters (curated).
 *   MAP     - connection arcs draw once, then breathe slowly.
 *   PUSH    - almost-invisible push-in + tiny map parallax on scroll.
 * Reduced motion: nothing runs; everything visible and static.
 */
export function usePartnersChoreography(rootRef: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // header
      gsap.set("[data-partners-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set("[data-partners-fade]", { autoAlpha: 0, y: 18 });

      const header = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      header
        .to("[data-partners-line]", { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0)
        .to("[data-partners-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.3);

      // partner panels - curated sequential reveal
      gsap.set("[data-partner]", { autoAlpha: 0, y: 26, scale: 0.985 });
      ScrollTrigger.batch("[data-partner]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.14,
            overwrite: true,
          }),
      });

      // world map - draw then breathe
      gsap.set("[data-map-path]", { strokeDashoffset: 1 });
      gsap.to("[data-map-path]", {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.3,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.to("[data-map-node] circle", {
        opacity: 0.5,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
      });

      // subtle push-in + map parallax
      gsap.to("[data-partners-field]", {
        scale: 1.02,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-worldmap]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [rootRef]);
}
