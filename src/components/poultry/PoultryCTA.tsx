"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

/**
 * POULTRY · SECTION 05 — CTA.
 *
 * The same closing CTA grammar as the rest of the film (shared
 * useCTAChoreography: data-cta-scale / data-cta-fade), on a clean white ground
 * with large spacing. Reuses RevealText, the button styling and tokens.
 */
export function PoultryCTA() {
  const rootRef = useRef<HTMLElement>(null);
  useCTAChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-labelledby="poultry-cta-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[80svh] w-full max-w-container flex-col items-center justify-center px-6 py-[20vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[820px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Let&rsquo;s Talk Poultry
            </span>
          </div>

          <h2
            id="poultry-cta-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Ready to Improve"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] md:text-[5vw] xl:text-[66px]"
            />
            <RevealText
              text="Poultry Performance?"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] text-primary-700 md:text-[5vw] xl:text-[66px]"
            />
          </h2>

          <p data-cta-fade className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600">
            Contact our technical experts for tailored recommendations built around your birds,
            your feed and your goals.
          </p>

          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              data-cta-fade
              href="/contact-us/"
              className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              Contact Technical Experts
            </a>
            <a
              data-cta-fade
              href="#products"
              className="inline-flex w-full items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              Explore Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
