"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { MapPinIcon, ClockIcon, ArrowUpRightIcon } from "./icons";

const MAPS_QUERY =
  "Agriprom Pakistan, 1st Floor Plot 19B, Off Abdul Sattar Edhi Road, Rahimabad, Lahore 53700";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

/**
 * CONTACT · SCENE 04 — VISIT OUR OFFICE.
 *
 * A calm editorial section: large architectural photography (the graded
 * LabPlate, real photo drop-in via `src`) unveiled by MaskedReveal with a slow
 * scrub push-in, minimal copy, and a floating glass location card overlapping
 * the image with the address elegantly set and an "Open in Google Maps" action.
 * The map is NOT embedded here — this section is about place and calm. Reduced
 * motion: static, visible.
 */
export function VisitOffice() {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-visit-fade]", { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch("[data-visit-fade]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });

      // slow push-in on the architecture
      gsap.fromTo(
        imgRef.current,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="visit"
      aria-labelledby="visit-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* minimal header */}
        <header className="mb-[8vh] max-w-3xl">
          <div data-visit-fade className="mb-7 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(04)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Place</span>
          </div>
          <h2
            id="visit-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Visit Our Office"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[58px]"
            />
          </h2>
        </header>

        {/* large architectural photography + floating glass card */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <MaskedReveal className="aspect-[16/10] w-full md:aspect-[21/9]">
              <div ref={imgRef} className="h-full w-full will-change-transform">
                <LabPlate alt="Agriprom Pakistan office, Lahore" />
              </div>
            </MaskedReveal>
          </div>

          {/* floating glass location card */}
          <div
            data-visit-fade
            className="relative z-raised mx-auto -mt-16 w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-white/70 bg-white/65 p-8 shadow-floating backdrop-blur-xl backdrop-saturate-150 md:absolute md:bottom-10 md:left-10 md:mt-0 md:w-[440px] md:p-10"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-600/15 bg-primary-50/60 text-primary-700">
              <MapPinIcon />
            </span>

            <h3 className="mt-7 font-display text-h4 font-light tracking-[-0.01em] text-neutral-900">
              Agriprom Pakistan
            </h3>

            <address className="mt-4 space-y-0.5 not-italic">
              <p className="font-sans text-body-lg leading-[1.55] text-neutral-700">1st Floor, Plot 19B,</p>
              <p className="font-sans text-body-lg leading-[1.55] text-neutral-700">Off Abdul Sattar Edhi Road,</p>
              <p className="font-sans text-body-lg leading-[1.55] text-neutral-700">Near Qazalbash Chowk,</p>
              <p className="font-sans text-body-lg leading-[1.55] text-neutral-700">Rahimabad, Lahore 53700</p>
            </address>

            <div className="mt-5 flex items-center gap-2.5 font-sans text-small text-neutral-500">
              <span className="text-accent-600">
                <ClockIcon />
              </span>
              Open 24 Hours
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-7 py-3.5 font-sans text-small font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Open in Google Maps
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <ArrowUpRightIcon />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
