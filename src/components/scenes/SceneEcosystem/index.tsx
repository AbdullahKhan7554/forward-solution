"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { CategoryBlock } from "./CategoryBlock";
import { useEcosystemChoreography } from "./useEcosystemChoreography";

/**
 * SCENE 05 - PRODUCT ECOSYSTEM.
 *
 * Not a grid: an editorial composition that makes three real divisions read as
 * ONE connected system. A large feature (Poultry) anchors the left; two medium
 * cards stagger to the right; a floating glass highlight names the system.
 * Each category is earned by scroll (MaskedReveal / RevealText / batched fades).
 *
 * Content: the user-approved ecosystem framing + the three homepage divisions
 * with their card descriptions. All Design System tokens; reuses RevealText,
 * MaskedReveal, GlassCard, LabPlate and the established GSAP/ScrollTrigger.
 */
export function SceneEcosystem() {
  const rootRef = useRef<HTMLElement>(null);
  useEcosystemChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-labelledby="ecosystem-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft luminous atmosphere + faint technical grid (static) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 70% 12%, rgba(234,242,247,0.5) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.024) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.024) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 pb-[26vh] pt-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-eco-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">
              (05)
            </span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">
              The Ecosystem
            </span>
          </div>

          <div data-eco-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Our Ecosystem
            </span>
          </div>

          <h2
            id="ecosystem-heading"
            className="font-display font-light leading-[1.03] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Complete Animal Health"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[5vw] xl:text-[62px]"
            />
            <RevealText
              text="Solutions"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] text-primary-700 md:text-[5vw] xl:text-[62px]"
            />
          </h2>

          <p
            data-eco-fade
            className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Agriprom Pakistan delivers research-driven products across every major
            livestock and companion animal sector.
          </p>
        </header>

        {/* ECOSYSTEM FIELD */}
        <div className="relative mt-[12vh]">
          <ul className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:grid-rows-2 md:gap-x-10 md:gap-y-16">
            <li
              data-eco-parallax
              data-speed="0.04"
              className="will-change-transform md:col-span-6 md:row-span-2"
            >
              <CategoryBlock
                variant="feature"
                name="Poultry"
                description="Committed to enhancing poultry nutrition and performance."
                imageSrc="/poultry.png"
                href="/products/poultry"
              />
            </li>
            <li
              data-eco-parallax
              data-speed="0.08"
              className="will-change-transform md:col-start-8 md:col-span-5 md:row-start-1"
            >
              <CategoryBlock
                variant="medium"
                name="Ruminants"
                description="Supporting better health, growth, and performance."
                imageSrc="/reuminant.png"
                href="/ruminants/"
              />
            </li>
            <li
              data-eco-parallax
              data-speed="0.11"
              className="will-change-transform md:col-start-8 md:col-span-5 md:row-start-2 md:pt-[6vh]"
            >
              <CategoryBlock
                variant="medium"
                name="Companion Animals"
                description="Helping companion animals live longer, healthier, more active lives."
                imageSrc="/animal%20comapnion.png"
                href="/companion-animals"
              />
            </li>
          </ul>

          {/* FLOATING HIGHLIGHT - names the system */}
          <aside
            data-eco-parallax
            data-speed="0.03"
            data-depth-float
            className="relative mt-10 will-change-transform md:absolute md:left-[41%] md:top-[30%] md:z-raised md:mt-0 md:w-[320px]"
          >
            <div data-eco-fade className="will-change-transform">
              <GlassCard>
                <p className="text-pretty font-sans text-body text-neutral-700">
                  Poultry, ruminants and companion animals — every solution belongs to
                  one connected scientific system.
                </p>
                <a
                  href="/services/"
                  aria-label="Explore the full range"
                  className="mt-5 inline-flex items-center gap-2.5 text-primary-700"
                >
                  <span className="font-sans text-caption uppercase tracking-[0.2em]">
                    The full range
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 ease-brand-out group-hover:translate-x-1.5"
                  >
                    <svg
                      width="24"
                      height="10"
                      viewBox="0 0 24 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 5h21M17 1l5 4-5 4" />
                    </svg>
                  </span>
                </a>
              </GlassCard>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
