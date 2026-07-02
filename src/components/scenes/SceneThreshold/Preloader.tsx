"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";

/**
 * Preloader - "First Light".
 *
 * No counter, no bar, no "loading". The void holds a single hairline slit of
 * light that opens from the centre, gathers a soft halo, then blooms and
 * cross-dissolves straight into the WebGL field - light into light, seamless.
 * A film-slate caption establishes the chapter from the very first frame.
 *
 * It calls complete() exactly as the bloom begins, so the world is already
 * coming alive as the void gives way. Reduced motion: an instant calm dissolve.
 *
 * The caption + aria are parametrised so the same curtain can open any chapter
 * (the homepage Threshold, the About Origin) with zero visual drift — reuse,
 * not a second preloader.
 */
export function Preloader({
  caption = "N°01 — The Threshold",
  ariaLabel = "Entering Agriprom Pakistan",
}: {
  caption?: string;
  ariaLabel?: string;
} = {}) {
  const { complete } = useIntro();
  const rootRef = useRef<HTMLDivElement>(null);
  const slitRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [gone, setGone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        complete();
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.35,
          delay: 0.2,
          onComplete: () => setGone(true),
        });
        return;
      }

      gsap.set(slitRef.current, { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(glowRef.current, { autoAlpha: 0, scale: 0.6 });
      gsap.set(capRef.current, { autoAlpha: 0, y: 10 });
      gsap.set(logoRef.current, { autoAlpha: 0, scale: 0.94, y: 6 });

      const tl = gsap.timeline();

      // the slit opens; the halo gathers; the logo surfaces in the first light
      tl.to(slitRef.current, { scaleX: 1, duration: 1.3, ease: "power3.out" }, 0.15);
      tl.to(glowRef.current, { autoAlpha: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0.15);
      tl.to(logoRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" }, 0.35);
      tl.to(capRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.7);

      // held beat, then bloom + cross-dissolve into the world
      tl.to(capRef.current, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=0.6");
      tl.add(() => complete(), "<0.1");
      tl.to(logoRef.current, { autoAlpha: 0, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, "<");
      tl.to(
        glowRef.current,
        { scale: 3.2, autoAlpha: 0, duration: 1.2, ease: "power2.inOut" },
        "<"
      );
      tl.to(slitRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.in" }, "<");
      tl.to(
        rootRef.current,
        { autoAlpha: 0, duration: 1.1, ease: "power2.inOut", onComplete: () => setGone(true) },
        "<0.15"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [complete]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden bg-base"
      role="status"
      aria-label={ariaLabel}
    >
      {/* soft halo of first light */}
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[42vh] w-[64vw] max-w-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(219,239,231,0.35), rgba(255,255,255,0))",
          filter: "blur(8px)",
        }}
      />

      {/* the hairline slit */}
      <span
        ref={slitRef}
        aria-hidden="true"
        className="absolute h-px w-[42vw] max-w-[520px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,100,193,0) 0%, rgba(0,100,193,0.55) 50%, rgba(0,100,193,0) 100%)",
        }}
      />

      {/* brand logo, surfacing in the first light */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src="/logos.png"
        alt="Agriprom Pakistan"
        className="relative z-raised h-20 w-auto object-contain md:h-28"
      />

      {/* film-slate caption */}
      <span
        ref={capRef}
        className="absolute bottom-[18%] font-sans text-caption uppercase tracking-[0.34em] text-neutral-400"
      >
        {caption}
      </span>
    </div>
  );
}
