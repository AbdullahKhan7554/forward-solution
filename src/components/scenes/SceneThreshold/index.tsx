"use client";

import { useRef } from "react";
import Image from "next/image";
import { HeroContent } from "./HeroContent";
import { ScrollCue } from "./ScrollCue";

/**
 * SCENE 01 - THE THRESHOLD
 *
 * A single full-viewport hero stage; no scroll-linked motion.
 */
export function SceneThreshold() {
  const outerRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="Empowering Animal Health And Productivity Through Innovative Feed Additives"
      className="relative"
    >
      {/* Hero stage */}
      <div ref={outerRef} className="relative">
        <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-base">
          {/* hero background image + light overlay so the dark headline stays legible */}
          <div ref={atmosphereRef} className="absolute inset-0">
            <Image
              src="/images/home/home-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(250,251,252,0.9) 0%, rgba(250,251,252,0.75) 50%, rgba(250,251,252,0.55) 100%)",
              }}
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
