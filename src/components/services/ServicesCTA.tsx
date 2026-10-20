"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

/**
 * SERVICES · SCENE 07 — THE INVITATION (CTA).
 *
 * The same closing beat as the homepage: identical composition, the shared
 * useCTAChoreography reveal (data-cta-scale / data-cta-fade), the soft radial +
 * ParticleField atmosphere and the same button pair — only the words change.
 */
export function ServicesCTA() {
  const rootRef = useRef<HTMLElement>(null);
  useCTAChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-labelledby="services-cta-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 45%, rgba(89,140,158,0.22) 0%, rgba(89,140,158,0) 72%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-container flex-col items-center justify-center px-6 py-16 md:py-24 text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[760px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
              Ready to Partner
            </span>
          </div>

          <h2
            id="services-cta-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Let's Improve Animal"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] md:text-[4.6vw] xl:text-[60px]"
            />
            <RevealText
              text="Health Together"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] text-primary-700 md:text-[4.6vw] xl:text-[60px]"
            />
          </h2>

          <p
            data-cta-fade
            className="mt-8 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Connect with our specialists today.
          </p>

          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              data-cta-fade
              href="/contact-us/"
              className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              Contact Us
            </a>
            <a
              data-cta-fade
              href="/products"
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
