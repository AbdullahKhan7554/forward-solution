"use client";

import { useEffect, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { MapPinIcon, ArrowUpRightIcon } from "./icons";

const MAPS_QUERY =
  "Agriprom Pakistan, 1st Floor Plot 19B, Off Abdul Sattar Edhi Road, Rahimabad, Lahore 53700";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

/**
 * CONTACT · SCENE 05 — THE MAP.
 *
 * A large interactive Google Map that feels integrated, not embedded: rounded,
 * soft-shadowed, brand-graded (a light grade that clears to full colour on
 * hover), framed by a soft scrim and a floating glass overlay with an animated
 * location marker. The iframe mounts only when the section scrolls into view
 * (IntersectionObserver, the ParticleField pattern) so it never taxes the
 * scroll. Subtle scale/fade reveal. Reduced motion: static, colour, visible.
 */
export function ContactMap() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Lazy-mount the map only when it enters the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  // Subtle reveal.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-map-fade]", { autoAlpha: 0, y: 18 });
      gsap.fromTo(
        frameRef.current,
        { autoAlpha: 0, scale: 0.985, y: 24 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        }
      );
      gsap.to("[data-map-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="map-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(64% 44% at 80% 6%, rgba(219,239,231,0.3) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* minimal header */}
        <header className="mb-[8vh] max-w-3xl">
          <div data-map-fade className="mb-7 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(05)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Find Us</span>
          </div>
          <h2
            id="map-heading"
            data-map-fade
            className="font-display text-[9vw] font-light leading-[1.05] tracking-[-0.015em] text-neutral-900 md:text-[4.6vw] xl:text-[58px]"
          >
            Where to Find Us
          </h2>
        </header>

        {/* framed, graded map */}
        <div
          ref={frameRef}
          className="group relative overflow-hidden rounded-2xl shadow-floating ring-1 ring-black/5"
        >
          <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
            {mounted ? (
              <iframe
                title="Agriprom Pakistan location, Lahore"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[0.28] contrast-[1.04] transition-[filter] duration-500 ease-brand-out group-hover:grayscale-0 group-hover:contrast-100"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg, #EDF2F5 0%, #FFFFFF 52%, #F1F5F7 100%)",
                }}
              />
            )}

            {/* soft integrating scrim (does not block interaction) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20,35,44,0.05) 0%, rgba(20,35,44,0) 22%, rgba(20,35,44,0) 74%, rgba(20,35,44,0.06) 100%)",
              }}
            />

            {/* animated location marker */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-raised -translate-x-1/2 -translate-y-full">
              <span className="relative flex flex-col items-center">
                <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-primary-600 text-pure shadow-floating">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-accent-500/40"
                  />
                  <span className="relative">
                    <MapPinIcon />
                  </span>
                </span>
                <span className="mt-1 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-r border-white/70 bg-primary-600" />
              </span>
            </div>

            {/* floating glass overlay card */}
            <div
              data-map-fade
              className="pointer-events-auto absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/70 p-5 shadow-glass backdrop-blur-xl backdrop-saturate-150 sm:right-auto sm:max-w-sm sm:p-6"
            >
              <span className="font-sans text-caption uppercase tracking-[0.22em] text-primary-700">
                Agriprom Pakistan
              </span>
              <p className="mt-2 font-sans text-body leading-[1.5] text-neutral-700">
                Rahimabad, Lahore 53700 · Open 24 Hours
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-4 inline-flex items-center gap-2.5 font-sans text-small font-medium text-primary-700 outline-none focus-visible:text-primary-800"
              >
                Open in Google Maps
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 ease-brand-out group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                >
                  <ArrowUpRightIcon />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
