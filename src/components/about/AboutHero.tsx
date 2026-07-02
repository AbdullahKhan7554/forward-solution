"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";
import { cn } from "@/lib/utils";

// Very tiny floating dust — the shared ultra-light particle field, client-only.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

// Cinematic crossfade set — light-toned scenes so the luminous film (and the dark
// navbar/headline) stays consistent. Local assets only, no placeholders.
const SLIDES = [
  "/images/heroabout/h1.png", // the laboratory
  "/images/heroabout/ChatGPT Image Jul 2, 2026, 06_50_41 PM.png", // the team
  "/images/heroabout/h4.png", // the science (cells)
];

// Timing — tuned for a slow, expensive cinema camera.
const CYCLE = 5.5; // seconds each slide holds before the next crossfades in
const FADE = 1.7; // crossfade duration
const KB = 15; // ken-burns push duration (scale 1 → 1.08)

/**
 * ABOUT · SCENE 01 — THE HERO (cinematic).
 *
 * A premium Apple × Stripe × Moderna × Rivian opening: a slow crossfading image
 * cinema (each slide a Ken-Burns push + micro drift, dissolving — never sliding),
 * layered cinematic overlays, an almost-invisible light sweep, the shared dust
 * particles, and the existing masked headline + CTA reveal. One scroll scales the
 * whole hero down and parallaxes the background into the next section as one film.
 *
 * transform/opacity/filter only · no layout shift · reduced-motion → a simple
 * static fade (no camera, particles or parallax).
 */
export function AboutHero() {
  const { phase } = useIntro();
  const reducedMotion = usePrefersReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  // ── Cinema: crossfade + Ken-Burns + light sweep (all self-driving loops) ──
  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !slidesRef.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", slidesRef.current!);
      if (!slides.length) return;

      const kb = (slide: HTMLElement, dir: number) => {
        const el = slide.querySelector<HTMLElement>("[data-kb]");
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 1, xPercent: 0, yPercent: 0 },
          { scale: 1.08, xPercent: dir * 1.6, yPercent: dir * -0.8, duration: KB, ease: "none" }
        );
      };

      // opening: first slide dissolves in from black-clean atmosphere + its push
      gsap.set(slides, { autoAlpha: 0 });
      gsap.fromTo(slides[0], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.9, ease: "power2.out" });
      kb(slides[0], -1);

      // crossfade cycle — outgoing fades while incoming is already pushing in.
      let idx = 0;
      const advance = () => {
        const next = (idx + 1) % slides.length;
        gsap.to(slides[idx], { autoAlpha: 0, duration: FADE, ease: "power2.inOut" });
        gsap.to(slides[next], { autoAlpha: 1, duration: FADE, ease: "power2.inOut" });
        kb(slides[next], next % 2 === 0 ? -1 : 1);
        idx = next;
      };
      gsap.timeline({ repeat: -1 }).call(advance, undefined, CYCLE);

      // light sweep — sunlight moving inside the laboratory (off-screen at both ends)
      gsap.fromTo(
        sweepRef.current,
        { xPercent: -60 },
        { xPercent: 220, duration: 19, ease: "sine.inOut", repeat: -1 }
      );
    }, slidesRef);

    return () => ctx.revert();
  }, []);

  // ── Scroll: scale the hero down, parallax the background, fade text ──
  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current || !outerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      // the whole hero eases down as the next section rises to meet it
      tl.to(stageRef.current, { scale: 0.94, ease: "power1.inOut" }, 0);
      // background keeps moving, slower (depth separation)
      tl.to(slidesRef.current, { yPercent: 7, ease: "none" }, 0);
      tl.to(contentRef.current, { yPercent: -16, autoAlpha: 0, ease: "power1.in" }, 0);
      tl.to(cueRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.25 }, 0);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  // Prime the reveal states before first paint.
  useIsomorphicLayoutEffect(() => {
    if (reducedRef.current || !contentRef.current) return;
    const root = contentRef.current;
    gsap.set(root.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16 });
    gsap.set(root.querySelectorAll("[data-hero-cta]"), { autoAlpha: 0, y: 20 });
    gsap.set(root.querySelectorAll("[data-hero-line]"), { scaleX: 0, transformOrigin: "0% 50%" });
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
      gsap.to(root.querySelectorAll("[data-hero-line]"), {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        delay: 0.45,
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
      {/* Scroll runway for the sticky stage. */}
      <div ref={outerRef} className="relative h-[170svh]">
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] min-h-[620px] w-full overflow-hidden bg-base will-change-transform"
        >
          {/* ── CROSSFADE CINEMA ── */}
          <div ref={slidesRef} className="absolute inset-0 will-change-transform">
            {SLIDES.map((src, i) => (
              <div
                key={src}
                data-slide
                className={cn("absolute inset-0", i === 0 ? "opacity-100" : "opacity-0")}
              >
                <div data-kb className="relative h-full w-full will-change-transform">
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

          {/* ── LIGHT SWEEP — almost invisible sunlight moving across the glass ── */}
          <div
            ref={sweepRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[-10%] left-0 w-[45%] will-change-transform"
            style={{
              background:
                "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 55%, transparent 100%)",
              mixBlendMode: "screen",
            }}
          />

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
              <ParticleField scrollProgressRef={scrollProgress} color={[0.4, 0.55, 0.62]} />
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
          <div className="relative z-raised h-full">
            <div
              ref={contentRef}
              className="flex h-full w-full flex-col justify-between px-6 pb-[9vh] pt-[17vh] will-change-transform md:px-12 md:pb-[10vh] xl:px-20"
            >
              {/* Eyebrow — top-left */}
              <div data-hero-fade className="flex items-center gap-4">
                <span className="h-px w-10 bg-accent-500" />
                <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
                  About Agriprom
                </span>
              </div>

              {/* Lower-left mass: slate + headline + paragraph + CTA */}
              <div className="max-w-2xl">
                {/* film-slate row */}
                <div className="mb-6 flex items-center gap-4">
                  <span
                    data-hero-fade
                    className="font-sans text-caption tracking-[0.2em] text-neutral-400"
                  >
                    (01)
                  </span>
                  <span data-hero-line className="h-px flex-1 bg-neutral-300" />
                  <span data-hero-fade className="font-serif text-small italic text-neutral-400">
                    The Origin
                  </span>
                </div>

                {/* H1 — surfacing line-by-line, lit by one sheen */}
                <h1 className="relative overflow-hidden pb-[0.08em] font-display font-light text-neutral-900">
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
                  className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
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
