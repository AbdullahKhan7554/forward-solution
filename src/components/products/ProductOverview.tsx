"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * PRODUCTS · SCENE 02 — THE ECOSYSTEM (Overview).
 *
 * An editorial split: a large premium image plate on the left, the story of how
 * Agriprom organises its portfolio on the right, and a row of glass statistics
 * beneath. The image is unveiled with the signature MaskedReveal; copy fades up;
 * the numbers count into place. Reuses MaskedReveal, RevealText, GlassCard, the
 * GSAP/ScrollTrigger clock and tokens.
 *
 * No photography exists in the project, so the image is an on-brand soft-daylight
 * gradient plate — drop-in ready for real laboratory/livestock photography.
 *
 * Statistics: Product Categories (5) and Global Brands (9) are the real counts
 * from the established taxonomy and partners list; Solutions (50+) is a rounded
 * illustrative figure; Technical Support is shown as 24/7. Swap in one place.
 */

const STATS = [
  { target: 5, suffix: "", label: "Product Categories" },
  { target: 9, suffix: "", label: "Global Brands" },
  { target: 50, suffix: "+", label: "Solutions" },
  { text: "24/7", label: "Technical Support" },
] as const;

export function ProductOverview() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-po-fade]", { autoAlpha: 0, y: 22 });
      gsap.set("[data-po-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 66%", once: true },
        })
        .to("[data-po-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.2)
        .to("[data-po-line]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.5);

      gsap.set("[data-po-stat]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-po-stat]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
      });

      // count the numeric statistics into place
      gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(proxy.v).toString();
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="categories"
      ref={rootRef}
      aria-labelledby="po-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft scientific atmosphere + faint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 80% 8%, rgba(219,239,231,0.42) 0%, rgba(255,255,255,0) 58%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.02) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate caption */}
        <div data-po-fade className="mb-14 flex items-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(02)</span>
          <span className="h-px w-10 bg-neutral-300" />
          <span className="font-serif text-small italic text-neutral-400">The Ecosystem</span>
        </div>

        {/* editorial split */}
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-12">
          {/* large premium image plate */}
          <div className="md:col-span-6">
            <MaskedReveal
              direction="up"
              className="aspect-[4/5] w-full rounded-lg border border-white/60 shadow-medium md:aspect-[5/6]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <LabPlate src="/nutrition.png" alt="Agriprom Pakistan complete animal-health portfolio" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(11,17,22,0.28) 0%, rgba(11,17,22,0) 34%, rgba(11,17,22,0.42) 100%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-9">
                  <span className="font-sans text-caption uppercase tracking-[0.28em] text-white/90">
                    Complete Portfolio
                  </span>
                  <span className="font-display text-[13vw] font-light leading-none text-white/70 md:text-[5vw] xl:text-[72px]">
                    Agriprom
                  </span>
                </div>
              </div>
            </MaskedReveal>
          </div>

          {/* text — offset right */}
          <div className="md:col-span-5 md:col-start-8">
            <div data-po-fade className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
                The Complete Portfolio
              </span>
            </div>

            <h2
              id="po-heading"
              className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
            >
              <RevealText
                text="One Connected System"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="justify-start text-[8.5vw] md:text-[4vw] xl:text-[50px]"
              />
              <RevealText
                text="of Animal Health"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="mt-1 justify-start text-[8.5vw] text-primary-700 md:text-[4vw] xl:text-[50px]"
              />
            </h2>

            <p data-po-fade className="mt-7 text-pretty font-sans text-body-lg text-neutral-600">
              We organise every product around the animals it serves — poultry, ruminants and
              companion species — and the stage it supports, from nutrition and gut health to
              biosecurity and veterinary care.
            </p>
            <p data-po-fade className="mt-5 text-pretty font-sans text-body text-neutral-500">
              One connected system, backed by globally-qualified brands and on-the-ground
              technical support, so producers always know exactly where to turn.
            </p>
          </div>
        </div>

        {/* glass statistics */}
        <div className="mt-[14vh]">
          <span
            data-po-line
            aria-hidden="true"
            className="mb-12 block h-px w-full bg-neutral-200"
          />
          <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {STATS.map((stat) => (
              <li key={stat.label} data-po-stat>
                <GlassCard className="h-full">
                  <div className="flex items-baseline gap-1">
                    {"target" in stat ? (
                      <>
                        <span
                          data-stat-num
                          data-target={stat.target}
                          className="font-display text-[11vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[3.4vw] xl:text-[52px]"
                        >
                          {stat.target}
                        </span>
                        {stat.suffix && (
                          <span className="font-display text-h3 font-light text-accent-500">
                            {stat.suffix}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-display text-[9vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[3.4vw] xl:text-[52px]">
                        {stat.text}
                      </span>
                    )}
                  </div>
                  <span className="mt-4 block font-sans text-caption uppercase tracking-[0.24em] text-neutral-500">
                    {stat.label}
                  </span>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
