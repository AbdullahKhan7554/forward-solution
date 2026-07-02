"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { RUMINANT_CATEGORIES } from "./categories";

/**
 * RUMINANTS · SCENE 03 — SOLUTIONS OVERVIEW.
 *
 * Apple-style navigation cards for every category, in glass, with a micro-
 * interaction on hover (lift + accent glow + arrow). Each card anchor-links to
 * its cinematic section below. Reuses GlassCard, RevealText, GSAP; tokens only.
 */

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS: Record<string, ReactNode> = {
  "rumen-protected-amino-acids": <Icon><path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" /></Icon>,
  "toxin-binders": <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Icon>,
  "organic-minerals": <Icon><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M12 22V12M3 7l9 5 9-5" /></Icon>,
  vaccines: <Icon><path d="m18 2 4 4M17 3l4 4M14 6l4 4M15.5 8.5 8 16l-3 1-1 3-1-1 3-1 1-3 7.5-7.5" /></Icon>,
  biosecurity: <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
  comfort: <Icon><path d="M3 12h18M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M4 18v-4h16v4M6 18v2M18 18v2" /></Icon>,
};

export function RuminantSolutions() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-rs-head]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-rs-head]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      gsap.set("[data-rs-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-rs-card]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="ruminant-solutions-heading" className="relative overflow-hidden bg-pure">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 45% at 80% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-rs-head className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(03)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Solutions</span>
          </div>
          <h2 id="ruminant-solutions-heading" className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
            <RevealText text="Six Pillars of" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]" />
            <RevealText text="Ruminant Performance" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]" />
          </h2>
        </header>

        <ul className="mt-[10vh] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {RUMINANT_CATEGORIES.map((c, i) => (
            <li key={c.id} data-rs-card>
              <a href={`#${c.id}`} aria-label={`${c.name} — jump to section`} className="group block h-full focus:outline-none">
                <GlassCard className="relative flex h-full flex-col overflow-hidden focus-visible:ring-2 focus-visible:ring-accent-500">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
                    style={{ background: "radial-gradient(closest-side, rgba(0,138,75,0.35), rgba(0,138,75,0))" }}
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-300 ease-brand-out group-hover:text-accent-600">
                        {ICONS[c.id]}
                      </span>
                      <span className="font-sans text-caption tracking-[0.24em] text-neutral-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-h4 font-medium leading-[1.15] text-neutral-900">{c.name}</h3>
                    <p className="mt-2 text-pretty font-sans text-body text-neutral-600">{c.tagline}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-sans text-caption uppercase tracking-[0.2em] text-primary-700">
                      Explore
                      <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&darr;</span>
                    </span>
                  </div>
                </GlassCard>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
