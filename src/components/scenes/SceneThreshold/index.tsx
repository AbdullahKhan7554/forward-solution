"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroContent } from "./HeroContent";
import { ScrollCue } from "./ScrollCue";

const SLIDES = [
  "/images/home/slides/slide-1.webp",
  "/images/home/slides/slide-2.webp",
  "/images/home/slides/slide-3.webp",
  "/images/home/slides/slide-4.webp",
];
const SLIDE_INTERVAL_MS = 5000;

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
  const [active, setActive] = useState(0);

  // advance the slideshow from mount; reduced motion only makes the fade instant (globals.css)
  useEffect(() => {
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Empowering Animal Health And Productivity Through Innovative Feed Additives"
      className="relative"
    >
      {/* Hero stage */}
      <div ref={outerRef} className="relative">
        <div className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-base">
          {/* hero slideshow (crossfade) + light overlay so the dark headline stays legible */}
          <div ref={atmosphereRef} className="absolute inset-0">
            {SLIDES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                quality={90}
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"
            />
          </div>

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
