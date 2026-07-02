"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * SERVICES · SCENE 03 — HOW WE WORK.
 *
 * A premium horizontal timeline (vertical on mobile): five glass process cards
 * on a connection line that draws in as you arrive, with numbered nodes and a
 * sequential card reveal. Only transform/opacity animate. Reduced motion:
 * everything visible and static.
 */

const STEPS = [
  { title: "Understand", body: "We start by listening — your animals, your operation, your goals." },
  { title: "Analyze", body: "We assess the challenge with scientific rigour and field insight." },
  { title: "Recommend", body: "We match the right products and protocols to your specific needs." },
  { title: "Support", body: "We stay close through implementation and everyday questions." },
  { title: "Improve", body: "We measure, refine and raise performance over time." },
];

export function ServicesProcess() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-process-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-process-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      // connection line draws in
      gsap.fromTo(
        "[data-process-line]",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: { trigger: "[data-process-track]", start: "top 80%", once: true },
        }
      );

      // steps reveal sequentially
      gsap.set("[data-process-step]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-process-step]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.16, overwrite: true }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 44% at 20% 4%, rgba(219,239,231,0.3) 0%, rgba(255,255,255,0) 56%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <header className="mb-[10vh] max-w-3xl">
          <div data-process-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(03)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Method</span>
          </div>
          <div data-process-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              How We Work
            </span>
          </div>
          <h2
            id="process-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="A Partnership in Five Steps"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[58px]"
            />
          </h2>
        </header>

        {/* TRACK */}
        <div data-process-track className="relative">
          {/* horizontal line (desktop) */}
          <span
            data-process-line
            aria-hidden="true"
            className="absolute left-0 right-0 top-[26px] hidden h-px origin-left bg-gradient-to-r from-primary-600/40 via-accent-500/40 to-primary-600/40 lg:block"
          />
          {/* vertical line (mobile / tablet) */}
          <span
            data-process-line
            aria-hidden="true"
            className="absolute bottom-6 left-[26px] top-6 w-px origin-top bg-gradient-to-b from-primary-600/40 via-accent-500/40 to-primary-600/40 lg:hidden"
          />

          <ol className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-process-step
                className="relative flex items-start gap-5 lg:flex-col lg:items-stretch lg:gap-0"
              >
                {/* node */}
                <span className="relative z-raised flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-primary-600/20 bg-base font-sans text-body font-medium text-primary-700 shadow-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* glass process card */}
                <div className="flex-1 rounded-2xl border border-white/70 bg-white/60 p-6 shadow-glass backdrop-blur-xl backdrop-saturate-150 lg:mt-7">
                  <h3 className="font-display text-h4 font-light tracking-[-0.01em] text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-pretty font-sans text-small leading-[1.6] text-neutral-600">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
