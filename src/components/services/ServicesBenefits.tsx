"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import {
  MicroscopeIcon,
  GlobeIcon,
  LifebuoyIcon,
  AwardIcon,
  PeopleIcon,
  ZapIcon,
} from "./icons";

/**
 * SERVICES · SCENE 04 — WHY AGRIPROM.
 *
 * An editorial, asymmetric composition: a tall column of large photography and
 * a held heading on the left, a staggered field of glass benefit panels on the
 * right. Thin-line icons, the established hover lift, and a sequential reveal.
 * Reduced motion: visible, static.
 */

type Benefit = { icon: ReactNode; title: string; body: string };

const BENEFITS: Benefit[] = [
  { icon: <MicroscopeIcon />, title: "Scientific Expertise", body: "A science-led team behind every recommendation we make." },
  { icon: <GlobeIcon />, title: "Global Partners", body: "Backed by the world's leading animal-health innovators." },
  { icon: <LifebuoyIcon />, title: "Reliable Support", body: "Available around the clock, whenever you need us." },
  { icon: <AwardIcon />, title: "Industry Experience", body: "A decade of trusted service across Pakistan." },
  { icon: <PeopleIcon />, title: "Long-term Relationship", body: "Partners for the long run — never one-off transactions." },
  { icon: <ZapIcon />, title: "Fast Response", body: "Quick, decisive answers when they matter most." },
];

function BenefitPanel({ benefit }: { benefit: Benefit }) {
  return (
    <div
      data-benefit-card
      className="group rounded-2xl border border-white/70 bg-white/60 p-7 shadow-glass backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,border-color] duration-300 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:border-accent-300/40 hover:shadow-floating"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-600/15 bg-primary-50/60 text-primary-700 transition-colors duration-300 ease-brand-out group-hover:border-accent-300/50 group-hover:text-accent-600">
        {benefit.icon}
      </span>
      <h3 className="mt-6 font-display text-h4 font-light tracking-[-0.01em] text-neutral-900">
        {benefit.title}
      </h3>
      <p className="mt-3 text-pretty font-sans text-small leading-[1.6] text-neutral-600">
        {benefit.body}
      </p>
    </div>
  );
}

export function ServicesBenefits() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-benefit-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-benefit-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 76%", once: true },
      });

      gsap.set("[data-benefit-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-benefit-card]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.13, overwrite: true }),
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
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div className="relative mx-auto grid w-full max-w-container grid-cols-1 gap-x-14 gap-y-[8vh] px-6 py-[16vh] md:px-12 lg:grid-cols-12 xl:px-20">
        {/* LEFT — heading + large photography */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[16vh]">
            <div data-benefit-fade className="mb-8 flex items-center gap-4">
              <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(04)</span>
              <span className="h-px w-10 bg-neutral-300" />
              <span className="font-serif text-small italic text-neutral-400">The Difference</span>
            </div>
            <div data-benefit-fade className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
                Why Agriprom
              </span>
            </div>
            <h2
              id="benefits-heading"
              className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
            >
              <RevealText
                text="Why Clients"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="justify-start text-[9vw] md:text-[3.6vw] xl:text-[50px]"
              />
              <RevealText
                text="Choose Us"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="justify-start text-[9vw] text-primary-700 md:text-[3.6vw] xl:text-[50px]"
              />
            </h2>

            <div data-benefit-fade className="mt-10 overflow-hidden rounded-2xl shadow-soft">
              <MaskedReveal className="aspect-[4/5] w-full">
                <LabPlate src="/00.png" alt="Why clients choose Agriprom Pakistan" />
              </MaskedReveal>
            </div>
          </div>
        </div>

        {/* RIGHT — staggered glass benefit panels */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit, i) => (
              <div key={benefit.title} className={i % 2 === 1 ? "sm:mt-12" : undefined}>
                <BenefitPanel benefit={benefit} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
