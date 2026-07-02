"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";

/**
 * POULTRY · SECTION 02 — SCIENTIFIC OVERVIEW.
 *
 * Editorial split: image left, the science right. Five outcomes reveal in
 * sequence as hairline-separated editorial rows. Reuses MaskedReveal, LabPlate,
 * RevealText and the GSAP/ScrollTrigger clock. Tokens throughout.
 */

const OUTCOMES: { title: string; body: string }[] = [
  {
    title: "Better Feed Conversion",
    body: "Unlock more usable energy and protein from every gram of feed, lowering cost per kilo.",
  },
  {
    title: "Gut Health",
    body: "Support a balanced microbiome and stronger intestinal integrity for resilient birds.",
  },
  {
    title: "Liver Protection",
    body: "Safeguard metabolic function so birds convert nutrients efficiently under load.",
  },
  {
    title: "Disease Resistance",
    body: "Reinforce natural defences and reduce reliance on medication across the flock.",
  },
  {
    title: "Sustainable Production",
    body: "Improve efficiency and welfare while lowering the environmental footprint of every farm.",
  },
];

export function PoultryScience() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-ps-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-ps-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 68%", once: true },
      });

      gsap.set("[data-ps-row]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-ps-row]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            overwrite: true,
          }),
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
      aria-labelledby="poultry-science-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.02) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-container grid-cols-1 items-center gap-x-16 gap-y-14 px-6 py-[18vh] md:grid-cols-12 md:px-12 xl:px-20">
        {/* IMAGE — left */}
        <div className="md:col-span-6">
          <MaskedReveal
            direction="up"
            className="aspect-[4/5] w-full rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[5/6]"
          >
            <LabPlate src="/feed.png" alt="Scientific poultry nutrition research — Agriprom Pakistan" />
          </MaskedReveal>
        </div>

        {/* CONTENT — right */}
        <div className="md:col-span-6">
          <div data-ps-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
              Scientific Overview
            </span>
          </div>

          <h2
            id="poultry-science-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="The Science Behind"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8vw] md:text-[3.8vw] xl:text-[48px]"
            />
            <RevealText
              text="Healthier, Better Birds"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8vw] text-primary-700 md:text-[3.8vw] xl:text-[48px]"
            />
          </h2>

          <ul className="mt-10 flex flex-col">
            {OUTCOMES.map((o, i) => (
              <li
                key={o.title}
                data-ps-row
                className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-neutral-200 py-6 first:border-t-0 first:pt-0"
              >
                <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-h4 font-medium text-neutral-900">{o.title}</h3>
                  <p className="mt-2 text-pretty font-sans text-body text-neutral-600">{o.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
