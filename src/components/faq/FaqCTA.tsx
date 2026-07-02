"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

const WHATSAPP_URL = "https://wa.me/923001234567";

/**
 * FAQ · SCENE 08 — STILL HAVE QUESTIONS (CTA).
 *
 * The shared closing-CTA grammar (useCTAChoreography + ParticleField over a soft
 * animated gradient) — Contact + WhatsApp actions. Anchored #faq-cta so the
 * quick-nav "Contact" card scrolls here. Reduced motion safe.
 */
export function FaqCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  useCTAChoreography(rootRef);

  return (
    <section id="faq-cta" ref={rootRef} aria-labelledby="faq-cta-heading" className="relative overflow-hidden bg-pure">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 30% 40%, rgba(0,138,75,0.10) 0%, rgba(255,255,255,0) 62%), radial-gradient(55% 50% at 74% 62%, rgba(0,100,193,0.10) 0%, rgba(255,255,255,0) 62%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-45">
        <ParticleField scrollProgressRef={scrollProgress} color={[0.35, 0.55, 0.62]} />
      </div>

      <div className="relative mx-auto flex min-h-[80svh] w-full max-w-container flex-col items-center justify-center px-6 py-[16vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[760px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">We&rsquo;re Here to Help</span>
          </div>

          <h2 id="faq-cta-heading" className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text="Still Have Questions?"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] md:text-[4.8vw] xl:text-[60px]"
            />
          </h2>

          <p data-cta-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
            Our specialists are always ready to help you choose the right solutions for your
            business.
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
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-neutral-300 bg-white/70 px-8 py-4 font-sans text-body font-medium text-neutral-800 backdrop-blur-md outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-accent-500/50 hover:bg-white hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              <span aria-hidden="true" className="text-[#25D366]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
