"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * RUMINANTS · SCENE 02 — INTRODUCTION.
 *
 * A large editorial statement on what ruminant nutrition means, with generous
 * white space. Reuses RevealText and the GSAP clock; tokens throughout.
 */
export function RuminantIntro() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-ri-fade]", { autoAlpha: 0, y: 22 });
      gsap.to("[data-ri-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 68%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="ruminant-intro-heading" className="relative overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(75% 55% at 22% 8%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[20vh] md:px-12 xl:px-20">
        <div data-ri-fade className="mb-12 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(02)</span>
          <span className="h-px w-10 bg-neutral-300" />
          <span className="font-serif text-small italic text-neutral-400">Introduction</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 md:grid-cols-12">
          <h2 id="ruminant-intro-heading" className="font-display font-light leading-[1.06] tracking-[-0.015em] text-neutral-900 md:col-span-7">
            <RevealText text="Nutrition That Works" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[56px]" />
            <RevealText text="With the Rumen, Not Against It" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[56px]" />
          </h2>

          <div className="space-y-6 md:col-span-4 md:col-start-9 md:pt-3">
            <p data-ri-fade className="text-pretty font-sans text-body-lg text-neutral-700">
              Ruminants digest through a living fermentation vat — the rumen — where microbes turn
              fibre into energy and protein. Feeding them well means feeding that ecosystem first.
            </p>
            <p data-ri-fade className="text-pretty font-sans text-body text-neutral-600">
              Agriprom&rsquo;s ruminant range protects nutrients from rumen degradation, safeguards
              feed and liver health, and supports fertility, immunity and comfort — so every cow
              performs closer to her genetic potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
