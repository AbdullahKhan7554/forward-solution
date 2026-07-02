"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HeroContent } from "./HeroContent";
import { ScrollCue } from "./ScrollCue";

// WebGL cannot server-render; load the atmosphere client-only.
const HeroAtmosphere = dynamic(
  () => import("@/components/canvas/HeroAtmosphere").then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => null }
);

/**
 * SCENE 01 - THE THRESHOLD
 *
 * A sticky "stage" holds the scene for one-and-a-bit viewports of scroll. That
 * scroll drives a single scrubbed timeline (DOM parallax + fade) AND feeds a
 * plain ref the WebGL reads each frame (camera push + particle drift). One
 * scroll, every layer moving in concert - the world recedes as we move forward.
 */
export function SceneThreshold() {
  const { phase } = useIntro();
  const outerRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  useIsomorphicLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !outerRef.current) return;

    const ctx = gsap.context(() => {
      // Feed scroll progress to the WebGL (no React re-render per frame).
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // DOM parallax + exit, scrubbed to the same scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.to(atmosphereRef.current, { yPercent: 6, ease: "none" }, 0);
      tl.to(
        contentRef.current,
        { yPercent: -20, autoAlpha: 0, ease: "power1.in" },
        0
      );
      tl.to(cueRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.25 }, 0);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="Empowering Animal Health And Productivity Through Innovative Feed Additives"
      className="relative"
    >
      {/* Scroll runway for the sticky stage (all within Scene 01). */}
      <div ref={outerRef} className="relative h-[170svh]">
        <div className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-base">
          {/* Layered WebGL world */}
          <div ref={atmosphereRef} className="absolute inset-0 will-change-transform">
            <HeroAtmosphere
              active={phase === "revealing"}
              scrollProgressRef={scrollProgress}
            />
          </div>

          {/* Asymmetric vignette - seats the mass lower-left, opens the light upper-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 90% at 30% 78%, rgba(250,251,252,0.55) 0%, rgba(255,255,255,0) 45%)",
            }}
          />

          {/* Foreground composition - fills the stage; HeroContent owns its own rhythm */}
          <div className="relative z-raised h-full">
            <div ref={contentRef} className="h-full w-full will-change-transform">
              <HeroContent />
            </div>
          </div>

          {/* Scroll mark - lower-right, balancing the lower-left headline mass */}
          <div
            ref={cueRef}
            className="absolute bottom-8 right-6 z-raised md:right-12 xl:right-20"
          >
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
