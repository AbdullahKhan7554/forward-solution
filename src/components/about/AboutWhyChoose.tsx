"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * ABOUT · SCENE 08 — WHY CHOOSE AGRIPROM.
 *
 * Six reasons the industry trusts Agriprom, told as an alternating feature
 * layout: large imagery on one side, a glass card on the other, sides swapping
 * each row. Images softly appear (MaskedReveal); cards reveal in sequence.
 * Reuses MaskedReveal, GlassCard, RevealText, the GSAP/ScrollTrigger clock and
 * tokens. No photography exists in the project, so each "image" is an on-brand
 * soft-daylight gradient plate — drop-in ready for real photography.
 */

type Feature = { title: string; body: string; imageSrc: string };

const FEATURES: Feature[] = [
  {
    title: "Global Brands",
    body: "We represent globally recognised animal health and nutrition brands, bringing world-class quality within reach of every Pakistani farm.",
    imageSrc: "/global.jpg",
  },
  {
    title: "Scientific Expertise",
    body: "Research-driven formulations and qualified technical knowledge stand behind every product and recommendation we make.",
    imageSrc: "/scienific%20expertise.jpg",
  },
  {
    title: "Reliable Supply",
    body: "A dependable global-to-local supply chain keeps products available and moving when farms and clinics need them most.",
    imageSrc: "/relaible%20supply.jpg",
  },
  {
    title: "Technical Support",
    body: "Hands-on guidance from a team that stays close to veterinarians and producers, on the ground and on call.",
    imageSrc: "/technical%20suport.jpg",
  },
  {
    title: "Long-term Partnership",
    body: "Relationships built to last — we grow alongside our customers, season after season, farm after farm.",
    imageSrc: "/long%20paternship.jpg",
  },
  {
    title: "Quality Assurance",
    body: "Rigorous, globally-qualified standards verified at every stage — from source and storage to the last mile.",
    imageSrc: "/quality%20assurance.jpg",
  },
];

function Plate({ index, title, imageSrc }: { index: number; title: string; imageSrc: string }) {
  return (
    <MaskedReveal
      direction="up"
      className="aspect-[4/3] w-full rounded-lg border border-white/60 shadow-medium md:aspect-[5/4]"
    >
      <div className="relative h-full w-full overflow-hidden">
        <LabPlate src={imageSrc} alt={`${title} — Agriprom Pakistan`} />
        {/* scrim so the overlay reads over any photograph */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,17,22,0.28) 0%, rgba(11,17,22,0) 34%, rgba(11,17,22,0.42) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          <span className="font-display text-[17vw] font-light leading-none text-white/70 md:text-[6vw] xl:text-[84px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-white/90">
            {title}
          </span>
        </div>
      </div>
    </MaskedReveal>
  );
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const imageLeft = index % 2 === 0;

  const image = (
    <div className={cn("md:col-span-6", imageLeft ? "md:order-1" : "md:order-2")}>
      <Plate index={index} title={feature.title} imageSrc={feature.imageSrc} />
    </div>
  );

  const card = (
    <div
      data-why-card
      className={cn(
        "md:col-span-5",
        imageLeft ? "md:order-2 md:col-start-8" : "md:order-1 md:col-start-1"
      )}
    >
      <GlassCard label={`Reason ${String(index + 1).padStart(2, "0")}`} className="h-full p-8 md:p-10">
        <h3 className="font-display text-h3 font-medium leading-[1.1] text-neutral-900">
          <RevealText text={feature.title} as="span" trigger="scroll" stagger={0.05} />
        </h3>
        <p className="mt-4 text-pretty font-sans text-body-lg text-neutral-600">{feature.body}</p>
      </GlassCard>
    </div>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
      {image}
      {card}
    </div>
  );
}

export function AboutWhyChoose() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-why-fade]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-why-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        })
        .to("[data-why-line]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.1)
        .to("[data-why-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.3);

      gsap.set("[data-why-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-why-card]", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.14,
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
      aria-labelledby="about-why-heading"
      className="relative overflow-hidden bg-base"
    >
      {/* soft daylight bloom + faint grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 24% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)",
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
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-why-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(08)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Why Agriprom</span>
          </div>

          <div data-why-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Why Choose Agriprom
            </span>
          </div>

          <h2
            id="about-why-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Why Pakistan's Industry"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Trusts Agriprom"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-why-fade
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Six commitments that make Agriprom Pakistan the partner veterinarians, producers and
            distributors return to.
          </p>

          <span
            data-why-line
            aria-hidden="true"
            className="mt-12 block h-px w-full bg-neutral-200"
          />
        </header>

        {/* ALTERNATING FEATURES */}
        <div className="mt-[12vh] flex flex-col gap-[12vh]">
          {FEATURES.map((feature, i) => (
            <FeatureRow key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
