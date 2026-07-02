"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The single scroll authority for the entire experience.
 *
 * Why this is premium:
 * - ONE clock. Lenis owns smooth scrolling; GSAP ScrollTrigger is driven from
 *   Lenis's RAF via `lenis.on("scroll", ScrollTrigger.update)` and
 *   `gsap.ticker`. Two RAF loops fighting is the #1 cause of scroll jank —
 *   here there is exactly one.
 * - Reduced motion aware. When the user asks for less motion we do NOT smooth
 *   the scroll at all (native scrolling, no lerp), which is both calmer and
 *   more accessible.
 * - Weighted feel. The lerp + duration are tuned for the brand's slow,
 *   cinematic cadence — never the default snappy smooth-scroll.
 */

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  // Held in state (not a ref) so the live instance is published to consumers
  // via context — enabling programmatic lenis.scrollTo (e.g. anchor navigation).
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    // Respect reduced motion: fall back to native scroll, no smoothing.
    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      // Weighted, cinematic cadence — long duration, gentle exponential easing.
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      smoothWheel: true,
    });
    setLenis(instance);

    // Drive ScrollTrigger from Lenis — one shared clock.
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      instance.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
