"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

// Very subtle floating particles — the shared ultra-light field, client-only.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

/** Thin scientific network — nodes joined by hairlines, almost invisible. */
const NODES: { x: number; y: number }[] = [
  { x: 12, y: 22 }, { x: 30, y: 12 }, { x: 48, y: 26 }, { x: 68, y: 14 }, { x: 86, y: 24 },
  { x: 20, y: 48 }, { x: 42, y: 54 }, { x: 60, y: 44 }, { x: 80, y: 56 },
  { x: 14, y: 74 }, { x: 34, y: 82 }, { x: 54, y: 72 }, { x: 74, y: 84 }, { x: 90, y: 72 },
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [2, 6], [3, 7], [4, 8],
  [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 11], [8, 13],
  [9, 10], [10, 11], [11, 12], [12, 13],
];

function NetworkGrid() {
  return (
    <svg
      data-network
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-[0.07]"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#0064C1" strokeWidth="0.12" fill="none">
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
        ))}
      </g>
      <g fill="#008A4B">
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="0.4" />
        ))}
      </g>
    </svg>
  );
}

/**
 * 404 — a calm, scientific "not found". Full viewport, soft white, huge masked
 * numerals over an almost-invisible breathing network grid and very subtle
 * floating particles. Reveal grammar and easings are the homepage's; nothing
 * bounces. Reduced motion: everything static and legible (WCAG AA), fully
 * keyboard-accessible.
 */
export function NotFound404() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const reducedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reducedRef.current) return;

      // fade-up cascade
      gsap.set("[data-404-fade]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-404-cta]", { autoAlpha: 0, y: 20 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to("[data-404-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.35)
        .to("[data-404-cta]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.95);

      // background slowly breathes
      gsap.to("[data-network]", {
        scale: 1.05,
        opacity: 0.1,
        transformOrigin: "50% 50%",
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-base px-6"
    >
      {/* very subtle scientific texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* breathing network grid */}
      <NetworkGrid />
      {/* very subtle floating particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
        <ParticleField scrollProgressRef={scrollProgress} color={[0.35, 0.55, 0.62]} />
      </div>
      {/* soft luminous centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 42% at 50% 42%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)",
        }}
      />

      {/* content */}
      <div className="relative z-raised mx-auto flex max-w-2xl flex-col items-center text-center">
        <span
          data-404-fade
          className="mb-8 flex items-center gap-4 font-sans text-caption uppercase tracking-[0.32em] text-neutral-500"
        >
          <span className="h-px w-10 bg-accent-500" />
          Error 404
        </span>

        {/* huge masked numerals */}
        <h1 className="font-display font-light leading-[0.9] tracking-[-0.02em] text-neutral-900">
          <RevealText
            text="404"
            as="span"
            trigger="mount"
            delay={0.15}
            stagger={0.08}
            className="justify-center text-[34vw] leading-[0.9] sm:text-[26vw] md:text-[210px]"
          />
        </h1>

        <h2
          data-404-fade
          className="mt-6 font-display text-h2 font-light tracking-[-0.01em] text-neutral-900 md:text-[40px]"
        >
          Page Not Found
        </h2>

        <p
          data-404-fade
          className="mt-5 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600"
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
          Let&rsquo;s guide you back.
        </p>

        <div className="mt-11 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <a
            data-404-cta
            href="/"
            className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
          >
            Return Home
          </a>
          <a
            data-404-cta
            href="/contact-us/"
            className="inline-flex w-full items-center justify-center rounded-sm border border-neutral-300 bg-white/50 px-8 py-4 font-sans text-body font-medium text-neutral-800 backdrop-blur-md outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-white/80 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
