"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * PRODUCTS · SCENE 04 — FEATURED SOLUTIONS.
 *
 * Luxury flagship cards in a floating composition: large glass surfaces that
 * alternate sides and drift with a whisper of parallax. Each pairs the
 * established LabPlate imagery (unveiled by MaskedReveal, zooming on hover) with
 * a category, benefits, application and a CTA. Cards reveal in sequence and lift
 * on hover. Reuses MaskedReveal, RevealText, LabPlate, the GSAP/ScrollTrigger
 * clock and tokens.
 *
 * Solutions are framed at the functional level (honest, no invented SKUs); swap
 * in official flagship product names/photography in one place.
 */

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type Solution = {
  category: string;
  title: string;
  benefits: string[];
  application: string;
  href: string;
  imageSrc?: string;
  speed: string;
};

const SOLUTIONS: Solution[] = [
  {
    category: "Poultry Nutrition",
    title: "Gut Health & Performance",
    benefits: [
      "Improved feed conversion",
      "Stronger gut integrity",
      "More uniform flock performance",
    ],
    application: "In-feed, across every growth stage.",
    href: "/products/poultry",
    imageSrc: "/12.jpg",
    speed: "0.06",
  },
  {
    category: "Feed Additives",
    title: "Organic Acid Preservation",
    benefits: [
      "Mould & pathogen control",
      "Cleaner, more stable feed",
      "Extended shelf life",
    ],
    application: "Feed and drinking-water programmes.",
    href: "/products/poultry",
    imageSrc: "/13.jpg",
    speed: "0.1",
  },
  {
    category: "Veterinary & Biosecurity",
    title: "Farm Protection Programme",
    benefits: [
      "Disease prevention",
      "Rigorous farm hygiene",
      "Reduced reliance on medication",
    ],
    application: "Housing, equipment and routine protocols.",
    href: "/ruminants",
    imageSrc: "/14.jpg",
    speed: "0.08",
  },
];

function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const imageLeft = index % 2 === 0;

  return (
    <article
      data-feat-card
      className="group relative overflow-hidden rounded-lg border border-white/70 bg-white/55 shadow-glass backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow] duration-200 ease-brand-out will-change-transform hover:-translate-y-1 hover:shadow-floating"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* image */}
        <div className={cn("relative", imageLeft ? "md:order-1" : "md:order-2")}>
          <MaskedReveal className="aspect-[4/3] w-full md:h-full md:aspect-auto">
            {/* GSAP owns the scrub dolly here; CSS hover-zoom lives on the nested
                element so the two transforms never fight (codebase rule). */}
            <div data-feat-img data-speed={solution.speed} className="h-full w-full will-change-transform">
              <div className="h-full w-full transition-transform duration-300 ease-brand-out group-hover:scale-[1.05]">
                <LabPlate src={solution.imageSrc} alt={solution.title} />
              </div>
            </div>
          </MaskedReveal>
        </div>

        {/* content */}
        <div
          className={cn(
            "flex flex-col justify-center p-8 md:p-12",
            imageLeft ? "md:order-2" : "md:order-1"
          )}
        >
          <div data-feat-fade className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
              {solution.category}
            </span>
          </div>

          <h3 className="font-display font-light leading-[1.08] tracking-[-0.01em] text-neutral-900">
            <RevealText
              text={solution.title}
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-start text-[7.5vw] md:text-[3vw] xl:text-[38px]"
            />
          </h3>

          <ul data-feat-fade className="mt-7 flex flex-col gap-3">
            {solution.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 font-sans text-body text-neutral-700">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <Check />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div data-feat-fade className="mt-8 border-t border-neutral-200/80 pt-6">
            <span className="font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
              Application
            </span>
            <p className="mt-2 font-sans text-body text-neutral-600">{solution.application}</p>
          </div>

          <a
            data-feat-fade
            href={solution.href}
            className="group/cta mt-8 inline-flex w-fit items-center gap-3 rounded-sm bg-primary-600 px-7 py-3.5 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            Explore Solution
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-brand-out group-hover/cta:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function FeaturedSolutions() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-feat-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-feat-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      // cards + inner copy reveal in sequence
      gsap.set("[data-feat-card]", { autoAlpha: 0, y: 34 });
      ScrollTrigger.batch("[data-feat-card]", {
        start: "top 86%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.16,
            overwrite: true,
          }),
      });
      gsap.set("[data-feat-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-feat-fade]", {
        start: "top 88%",
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

      // whisper of parallax — a scrubbed dolly (scale) that never reveals edges
      gsap.utils.toArray<HTMLElement>("[data-feat-img]").forEach((el) => {
        const speed = Number(el.dataset.speed ?? 0.08);
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1 + speed,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("[data-feat-card]"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
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
      aria-labelledby="feat-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 82% 4%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-feat-header className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(04)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Flagships</span>
          </div>
          <div data-feat-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Featured Solutions
            </span>
          </div>
          <h2
            id="feat-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Premium Solutions,"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Proven on the Farm"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>
        </header>

        {/* FLOATING CARD FIELD */}
        <div className="mt-[12vh] flex flex-col gap-[10vh]">
          {SOLUTIONS.map((solution, i) => (
            <div key={solution.title} className={cn(i % 2 === 1 && "md:ml-[6%]", i % 2 === 0 && "md:mr-[6%]")}>
              <SolutionCard solution={solution} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
