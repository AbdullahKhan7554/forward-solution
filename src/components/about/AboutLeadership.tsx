"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * ABOUT · SCENE 06 — LEADERSHIP PHILOSOPHY.
 *
 * A large editorial quote on soft light. An oversized serif quotation glyph
 * drifts with a whisper of parallax behind the statement; the headline surfaces
 * with RevealText; the philosophy and a signed founder message settle beneath.
 * Minimal, calm, trust-building. Reuses RevealText, the GSAP clock and tokens —
 * nothing new invented.
 */
export function AboutLeadership() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-lead-fade]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-lead-line]", { scaleX: 0, transformOrigin: "0% 50%" });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 66%", once: true },
        })
        .to("[data-lead-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.16 }, 0.2)
        .to("[data-lead-line]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.5);

      // very subtle parallax on the decorative quote glyph
      gsap.to("[data-lead-parallax]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="about-lead-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft light bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 12%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      {/* oversized decorative quotation glyph — drifts with parallax */}
      <span
        data-lead-parallax
        aria-hidden="true"
        className="pointer-events-none absolute -top-[6vh] left-1/2 -translate-x-1/2 select-none font-serif italic leading-none text-primary-100/70"
        style={{ fontSize: "38vw" }}
      >
        &ldquo;
      </span>

      <div className="relative mx-auto w-full max-w-container px-6 py-[20vh] md:px-12 xl:px-20">
        {/* slate caption */}
        <div data-lead-fade className="mb-12 flex items-center justify-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(06)</span>
          <span className="h-px w-10 bg-neutral-300" />
          <span className="font-serif text-small italic text-neutral-400">
            Leadership Philosophy
          </span>
        </div>

        {/* the editorial quote */}
        <blockquote className="mx-auto max-w-4xl text-center">
          <h2
            id="about-lead-heading"
            className="font-display font-light leading-[1.06] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Leading Through Science,"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] md:text-[5vw] xl:text-[64px]"
            />
            <RevealText
              text="Trust & Innovation"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[9vw] text-primary-700 md:text-[5vw] xl:text-[64px]"
            />
          </h2>

          <p
            data-lead-fade
            className="mx-auto mt-10 max-w-[62ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Our leadership believes that lasting progress in animal health is earned, not
            claimed — through rigorous science, honest partnerships and the humility to keep
            learning. We lead by staying close to the veterinarians and producers we serve,
            letting their challenges guide the solutions we bring to Pakistan.
          </p>
          <p
            data-lead-fade
            className="mx-auto mt-6 max-w-[62ch] text-pretty font-sans text-body text-neutral-500"
          >
            Every decision is measured against a single question: does it build trust and
            improve the lives of the animals — and the people — who depend on us?
          </p>
        </blockquote>

        {/* signed founder message */}
        <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center">
          <span
            data-lead-line
            aria-hidden="true"
            className="mb-7 block h-px w-16 bg-neutral-300"
          />
          <p data-lead-fade className="text-center">
            <span className="block font-serif text-body-lg italic text-neutral-700">
              A promise from our team to Pakistan&rsquo;s livestock industry.
            </span>
            <span className="mt-3 block font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
              The Agriprom Pakistan Leadership
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
