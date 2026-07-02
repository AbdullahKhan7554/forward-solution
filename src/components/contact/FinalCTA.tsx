"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

// Same ultra-light particle atmosphere the homepage/About CTAs use.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

/**
 * CONTACT · SCENE 07 — THE CLOSE (FINAL CTA).
 *
 * The emotional conclusion of the page. Reuses the shared closing-CTA grammar
 * wholesale — useCTAChoreography (the slow scale 0.99→1 + fade stagger), the
 * soft-white radial and low-opacity ParticleField (scientific architecture,
 * very subtle lighting) — with large cinematic typography and one primary CTA.
 * Large whitespace, slow fade. Reduced motion safe.
 */
export function FinalCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  useCTAChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft-white radial + ultra-light particle atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 64%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45">
        <ParticleField scrollProgressRef={scrollProgress} color={[0.35, 0.55, 0.62]} />
      </div>

      <div className="relative mx-auto flex min-h-[88svh] w-full max-w-container flex-col items-center justify-center px-6 py-[18vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[820px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Let&rsquo;s Work Together
            </span>
          </div>

          <h2
            id="final-cta-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Let's Shape Better Animal"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] md:text-[5vw] xl:text-[66px]"
            />
            <RevealText
              text="Health, Together."
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] text-primary-700 md:text-[5vw] xl:text-[66px]"
            />
          </h2>

          <p
            data-cta-fade
            className="mt-8 max-w-[48ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Partner with a team that puts science, trust and animal health first.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <a
              data-cta-fade
              href="#contact-form"
              className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-9 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              Contact Our Team
            </a>
            <a
              data-cta-fade
              href="tel:+923000801213"
              className="font-sans text-small font-medium text-neutral-500 underline-offset-4 transition-colors duration-200 ease-brand-out hover:text-primary-700 hover:underline"
            >
              or call +92 300 0801213
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
