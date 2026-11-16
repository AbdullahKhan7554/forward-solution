"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { RevealText } from "@/components/primitives/RevealText";
import { WorldMap } from "./WorldMap";
import { partners } from "./partners";
import { usePartnersChoreography } from "./usePartnersChoreography";

/** Card width (w-56 = 224px) + right margin (mr-6 = 24px). */
const ITEM_STEP = 248;
const NUDGE_MS = 600;

export function ScenePartners() {
  const rootRef = useRef<HTMLElement>(null);
  usePartnersChoreography(rootRef);

  // Marquee: rAF-driven so arrows can nudge it while auto-scroll keeps running.
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const offsetRef = useRef(0);
  const nudgeRef = useRef<{ from: number; to: number; start: number } | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const SPEED = 40; // px per second
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const half = track.scrollWidth / 2;
      const n = nudgeRef.current;
      if (n) {
        const t = Math.min((now - n.start) / NUDGE_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        offsetRef.current = n.from + (n.to - n.from) * eased;
        if (t >= 1) nudgeRef.current = null;
      } else if (!pausedRef.current && !reduced.matches) {
        offsetRef.current += SPEED * dt;
      }
      if (half > 0) {
        const wrapped = ((offsetRef.current % half) + half) % half;
        if (n && wrapped !== offsetRef.current) {
          const shift = wrapped - offsetRef.current;
          n.from += shift;
          n.to += shift;
        }
        offsetRef.current = wrapped;
      }
      track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nudge = (dir: 1 | -1) => {
    const from = offsetRef.current;
    nudgeRef.current = { from, to: from + dir * ITEM_STEP * 2, start: performance.now() };
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-pure"
    >
      <WorldMap />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-partners-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
              Global Network
            </span>
          </div>

          <h2
            id="partners-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Trusted By Global Animal"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Health Leaders"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-partners-fade
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Agriprom Pakistan works alongside globally recognised leaders in animal
            health and nutrition, bringing world-class, research-driven solutions to
            Pakistan through long-term international partnerships.
          </p>

          <span
            data-partners-line
            aria-hidden="true"
            className="mt-12 block h-px w-full origin-left bg-neutral-200"
          />
        </header>

        {/* PARTNER MARQUEE - infinite auto-scroll; list duplicated for a seamless loop */}
        <div
          data-partners-field
          className="relative mt-[12vh]"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div className="overflow-hidden">
          <ul ref={trackRef} className="flex w-max will-change-transform">
            {[...partners, ...partners].map((partner, i) => (
              <li
                key={`${partner.name}-${i}`}
                aria-hidden={i >= partners.length || undefined}
                className="mr-6 flex w-56 shrink-0 list-none flex-col items-center rounded-lg border border-white/70 bg-white/85 p-6 shadow-soft"
              >
                <div className="relative h-24 w-44">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 text-center font-display text-body-lg font-medium text-neutral-900">
                  {partner.name}
                </p>
              </li>
            ))}
          </ul>
          </div>
          <button
            type="button"
            aria-label="Previous partners"
            onClick={() => nudge(-1)}
            className="absolute left-0 top-1/2 z-raised flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-soft transition-colors hover:border-primary-700 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 md:h-12 md:w-12"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next partners"
            onClick={() => nudge(1)}
            className="absolute right-0 top-1/2 z-raised flex h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-soft transition-colors hover:border-primary-700 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 md:h-12 md:w-12"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
