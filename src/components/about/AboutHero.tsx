"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";
import { cn } from "@/lib/utils";

// Slideshow set — light-toned scenes so the dark navbar/headline stays legible.
// Local assets only, no placeholders.
const SLIDES = [
  "/images/client/about-hero.webp",
  "/images/heroabout/h1.jpg", // the laboratory
  "/images/heroabout/ChatGPT Image Jul 2, 2026, 06_50_41 PM.png", // the team
  "/images/heroabout/h4.png", // the science (cells)
  "/images/agriprom-images/pages/feedmill-about.jpg", // the feed mill
];

// Timing — one slide at a time: fade out, swap, fade in.
const CYCLE_MS = 5000; // each slide holds this long
const FADE_MS = 700; // fade-out / fade-in duration

/**
 * ABOUT · SCENE 01 — THE HERO (cinematic).
 *
 * A simple slideshow (one image visible at a time, a plain fade every 5s),
 * layered overlays, the shared dust particles, and the existing masked headline
 * + CTA reveal. Reduced motion: slides swap without the fade.
 */
export function AboutHero() {
  const { phase } = useIntro();
  const reducedMotion = usePrefersReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ── Slideshow: fade current out, swap, fade next in (never two at once) ──
  useEffect(() => {
    let swap: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setActive((i) => (i + 1) % SLIDES.length);
        setVisible(true);
      }, FADE_MS);
    }, CYCLE_MS);
    return () => {
      clearInterval(cycle);
      clearTimeout(swap);
    };
  }, []);

  // Prime the reveal states before first paint.
  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current || !contentRef.current) return;
    const root = contentRef.current;
    gsap.set(root.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16 });
    gsap.set(root.querySelectorAll("[data-hero-cta]"), { autoAlpha: 0, y: 20 });
    gsap.set(root.querySelectorAll("[data-sheen]"), { xPercent: -140, autoAlpha: 0 });
  }, []);

  // Reveal cascade — keyed off the shared intro clock; the CTA reveals last.
  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !contentRef.current) return;
    playedRef.current = true;
    const root = contentRef.current;

    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-hero-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
        stagger: 0.12,
      });
      gsap.to(root.querySelectorAll("[data-sheen]"), {
        keyframes: [
          { autoAlpha: 0.5, duration: 0.2 },
          { xPercent: 140, duration: 1.1, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.3 },
        ],
        delay: 1.35,
      });
      gsap.to(root.querySelectorAll("[data-hero-cta]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.9,
        stagger: 0.12,
      });
    }, root);

    return () => ctx.revert();
  }, [revealing]);

  return (
    <section
      aria-label="About Agriprom Pakistan — advancing animal health through science, innovation and partnership"
      className="relative"
    >
      <div ref={outerRef} className="relative">
        <div
          ref={stageRef}
          className="relative min-h-[max(100svh,620px)] w-full bg-base"
        >
          {/* ── SLIDESHOW ── */}
          <div className="absolute inset-0">
            {SLIDES.map((src, i) => (
              <div
                key={src}
                className={cn(
                  "absolute inset-0 transition-opacity ease-linear motion-reduce:transition-none",
                  i === active && visible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── CINEMATIC OVERLAYS ── */}
          {/* blue atmospheric gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 82% 10%, rgba(0,100,193,0.12) 0%, rgba(0,100,193,0) 60%)",
            }}
          />
          {/* soft white glow, upper-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(52% 42% at 78% 8%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
          {/* subtle dark cinematic framing at the outer edges */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(130% 120% at 50% 42%, rgba(20,35,44,0) 60%, rgba(20,35,44,0.20) 100%)",
            }}
          />
          {/* light scrim, lower-left — holds the dark headline legible over any slide */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(105% 95% at 26% 82%, rgba(250,251,252,0.86) 0%, rgba(250,251,252,0.30) 42%, rgba(255,255,255,0) 66%)",
            }}
          />

          {/* ── DUST PARTICLES (reused field) ── */}
          {!reducedMotion && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.28]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 60% at 50% 45%, rgba(102,140,158,0.22) 0%, rgba(102,140,158,0) 72%)",
                }}
              />
            </div>
          )}

          {/* ── TINY GRAIN ── */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
          >
            <filter id="abouthero-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#abouthero-grain)" />
          </svg>

          {/* Foreground composition */}
          {/* stronger white overlay behind the text side — headline legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.65) 38%, rgba(255,255,255,0) 72%)",
            }}
          />

          <div className="relative z-raised">
            <div
              ref={contentRef}
              className="flex min-h-[max(100svh,620px)] w-full flex-col justify-between px-6 pb-[9vh] pt-32 will-change-transform md:pt-40 md:px-12 md:pb-[10vh] xl:px-20"
            >
              {/* Eyebrow — top-left */}
              <div data-hero-fade className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-900">
                  About Agriprom
                </span>
              </div>

              {/* Lower-left mass: slate + headline + paragraph + CTA */}
              <div className="max-w-2xl">
                {/* H1 — surfacing line-by-line, lit by one sheen */}
                <h1 className="relative overflow-hidden pb-[0.08em] font-display font-semibold text-neutral-900">
                  <span
                    data-sheen
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/3"
                    style={{
                      background:
                        "linear-gradient(100deg, transparent, rgba(255,255,255,0.9), transparent)",
                    }}
                  />
                  <RevealText
                    text="Advancing Animal Health Through"
                    as="span"
                    play={revealing}
                    delay={0.5}
                    stagger={0.06}
                    className="justify-start text-[9vw] leading-[1.03] tracking-[-0.015em] md:text-[5.1vw] xl:text-[60px]"
                  />
                  <RevealText
                    text="Science, Innovation & Partnership"
                    as="span"
                    play={revealing}
                    delay={1.15}
                    stagger={0.06}
                    className="mt-2 justify-start text-[9vw] leading-[1.03] tracking-[-0.015em] text-primary-700 md:text-[5.1vw] xl:text-[60px]"
                  />
                </h1>

                {/* Paragraph */}
                <p
                  data-hero-cta
                  className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-900"
                >
                  Agriprom Pakistan delivers globally trusted animal health and nutrition
                  solutions that empower veterinarians, livestock producers and distributors
                  across Pakistan through scientific excellence and long-term partnerships.
                </p>

                {/* CTA — same button as the homepage hero */}
                <a
                  data-hero-cta
                  href="#story"
                  className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out hover:bg-primary-700"
                >
                  Explore Our Story
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Scroll mark — lower-right, balancing the lower-left mass */}
          <div ref={cueRef} className="absolute bottom-8 right-6 z-raised md:right-12 xl:right-20">
            <ScrollCue />
          </div>
        </div>
      </div>
    </section>
  );
}
