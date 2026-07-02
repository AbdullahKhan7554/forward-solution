"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

/**
 * RUMINANTS · SCENE 05 — CTA.
 * Shared CTA grammar (useCTAChoreography). Reuses RevealText and tokens.
 */
export function RuminantCTA() {
  const rootRef = useRef<HTMLElement>(null);
  useCTAChoreography(rootRef);

  return (
    <section ref={rootRef} aria-labelledby="ruminant-cta-heading" className="relative overflow-hidden bg-pure">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)" }}
      />
      <div className="relative mx-auto flex min-h-[80svh] w-full max-w-container flex-col items-center justify-center px-6 py-[18vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[820px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">Technical Support</span>
          </div>
          <h2 id="ruminant-cta-heading" className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText text="Need Help Selecting" as="span" trigger="scroll" stagger={0.05} className="justify-center text-[9vw] md:text-[5vw] xl:text-[64px]" />
            <RevealText text="the Right Products?" as="span" trigger="scroll" stagger={0.05} className="justify-center text-[9vw] text-primary-700 md:text-[5vw] xl:text-[64px]" />
          </h2>
          <p data-cta-fade className="mt-8 max-w-[54ch] text-pretty font-sans text-body-lg text-neutral-600">
            Our technical experts will help you build the right nutrition, health and comfort
            programme for your herd.
          </p>
          <a
            data-cta-fade
            href="/contact-us/"
            className="mt-12 inline-flex items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            Contact Agriprom Experts
          </a>
        </div>
      </div>
    </section>
  );
}
