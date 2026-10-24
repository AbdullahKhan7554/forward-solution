"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";

/**
 * Preloader - "First Light".
 *
 * Just the brand logo on the base field: it surfaces, holds a beat, then
 * dissolves as the curtain lifts into the hero. It calls complete() at the same
 * moment as before, so the hero reveal timing is unchanged. Reduced motion: an
 * instant calm dissolve. Skipped entirely after the first visit in a session
 * (see IntroProvider).
 *
 * `caption` is kept in the props for API compatibility (no longer rendered);
 * `ariaLabel` still names the curtain for screen readers.
 */
export function Preloader({
  ariaLabel = "Entering Agriprom Pakistan",
}: {
  caption?: string;
  ariaLabel?: string;
} = {}) {
  const { complete, preloader } = useIntro();
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [gone, setGone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (preloader !== "play") return;

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

      gsap.set(logoRef.current, { autoAlpha: 0, scale: 0.94, y: 6 });

      // absolute positions keep the original rhythm (complete() at 2.35s)
      const tl = gsap.timeline();
      tl.to(logoRef.current, { autoAlpha: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" }, 0.35);
      tl.add(() => complete(), 2.35);
      tl.to(logoRef.current, { autoAlpha: 0, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, 2.35);
      tl.to(
        rootRef.current,
        { autoAlpha: 0, duration: 1.1, ease: "power2.inOut", onComplete: () => setGone(true) },
        2.5
      );
    }, rootRef);

    return () => ctx.revert();
  }, [complete, preloader]);

  if (gone || preloader === "skip") return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden bg-base"
      role="status"
      aria-label={ariaLabel}
    >
      {/* brand logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src="/logo.svg"
        alt="Agriprom Pakistan"
        width={576}
        height={324}
        className="relative z-raised h-20 w-auto object-contain md:h-28"
      />
    </div>
  );
}
