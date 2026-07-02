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
 * ABOUT · SCENE 03 — THE STORY (Journey Timeline).
 *
 * An editorial alternating timeline told on the same light stage as the rest of
 * the film. A single thin spine draws itself as you descend (scroll-scrubbed);
 * glass milestone cards reveal in sequence; each milestone's image plate is
 * unveiled with the signature MaskedReveal. Reuses GlassCard, RevealText,
 * MaskedReveal, the GSAP/ScrollTrigger clock and every motion token — nothing
 * new is invented.
 *
 * No photography exists in the project, so each "image" is an on-brand
 * soft-daylight gradient plate (Visual Moodboard palette) carrying a ghost
 * numeral — a placeholder surface ready to be swapped for real photography.
 *
 * Copy stays honest: milestones are ordered phases of Agriprom's journey, not
 * invented dates. Swap in official years in one place when supplied.
 */

type Milestone = {
  name: string;
  description: string;
  /** milestone photograph (public/), matched by name */
  imageSrc: string;
};

const MILESTONES: Milestone[] = [
  {
    name: "Foundation",
    description:
      "Agriprom is founded on a single conviction — that Pakistan's livestock deserves globally-qualified animal health science, delivered with integrity.",
    imageSrc: "/foundation.png",
  },
  {
    name: "Growth",
    description:
      "A widening portfolio across poultry, ruminant and companion animals earns the trust of veterinarians and producers nationwide.",
    imageSrc: "/growth.png",
  },
  {
    name: "International Partnerships",
    description:
      "Alliances with world-class manufacturers bring globally-qualified vaccines, additives and nutrition to Pakistani farms.",
    imageSrc: "/international%20relation.png",
  },
  {
    name: "Expansion",
    description:
      "A nationwide distribution network carries reliable supply and technical support to every province, farm and clinic.",
    imageSrc: "/exapnsion.png",
  },
  {
    name: "Innovation",
    description:
      "Research-driven formulations and biosecurity raise the standard for feed conversion, gut health and lasting productivity.",
    imageSrc: "/innovation.png",
  },
  {
    name: "Today",
    description:
      "A trusted partner connecting global scientific innovation with Pakistan's livestock industry — and only accelerating.",
    imageSrc: "/today.png",
  },
];

/** The editorial image tile — a milestone photograph with a ghost numeral. */
function Plate({ index, name, imageSrc }: { index: number; name: string; imageSrc: string }) {
  return (
    <MaskedReveal
      direction="up"
      className="aspect-[4/3] w-full rounded-lg border border-white/60 shadow-medium"
    >
      <div className="relative h-full w-full overflow-hidden">
        <LabPlate src={imageSrc} alt={`${name} — Agriprom Pakistan`} />
        {/* scrim so the overlay reads over any photograph */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,17,22,0.28) 0%, rgba(11,17,22,0) 34%, rgba(11,17,22,0.42) 100%)",
          }}
        />
        {/* ghost numeral + label */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
          <span className="font-display text-[19vw] font-light leading-none text-white/70 md:text-[7vw] xl:text-[92px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-white/90">
            {name}
          </span>
        </div>
      </div>
    </MaskedReveal>
  );
}

/** One milestone row — alternates the card/plate sides across the spine. */
function Row({ milestone, index }: { milestone: Milestone; index: number }) {
  const cardLeft = index % 2 === 0;

  const card = (
    <div data-tl-card>
      <GlassCard
        label={`Milestone ${String(index + 1).padStart(2, "0")}`}
        className={cn("w-full", cardLeft ? "md:ml-auto" : "md:mr-auto", "md:max-w-[440px]")}
      >
        <h3 className="font-display text-h3 font-medium text-neutral-900">
          <RevealText text={milestone.name} as="span" trigger="scroll" stagger={0.05} />
        </h3>
        <p className="mt-3 text-pretty font-sans text-body text-neutral-600">
          {milestone.description}
        </p>
      </GlassCard>
    </div>
  );

  const plate = (
    <div data-tl-card className={cn(cardLeft ? "md:mr-auto" : "md:ml-auto", "w-full md:max-w-[440px]")}>
      <Plate index={index} name={milestone.name} imageSrc={milestone.imageSrc} />
    </div>
  );

  return (
    <div className="relative pl-16 md:pl-0">
      {/* node on the spine */}
      <span
        data-tl-node
        aria-hidden="true"
        className="absolute left-6 top-2 z-raised h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent-500 bg-base shadow-soft md:left-1/2"
      />

      {/* desktop: two columns across the spine; mobile: stacked plate → card */}
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-16">
        {cardLeft ? (
          <>
            <div className="md:order-1">{card}</div>
            <div className="md:order-2">{plate}</div>
          </>
        ) : (
          <>
            <div className="md:order-2">{card}</div>
            <div className="md:order-1">{plate}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function AboutTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // The spine draws itself as you descend — scrubbed to the list's scroll.
      gsap.set("[data-tl-fill]", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.to("[data-tl-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: list,
          start: "top 72%",
          end: "bottom 78%",
          scrub: true,
        },
      });

      // Cards + plates reveal in sequence as each row enters.
      gsap.set("[data-tl-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-tl-card]", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });

      // Nodes settle onto the spine as their row arrives.
      gsap.set("[data-tl-node]", { scale: 0, autoAlpha: 0 });
      ScrollTrigger.batch("[data-tl-node]", {
        start: "top 82%",
        onEnter: (batch) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
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
      id="story"
      ref={rootRef}
      aria-labelledby="about-story-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft daylight bloom for breathing space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* Scene header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              (03) — Our Journey
            </span>
            <span className="h-px w-10 bg-accent-500" />
          </div>
          <h2
            id="about-story-heading"
            className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="A Journey Built on"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] md:text-[4.4vw] xl:text-[56px]"
            />
            <RevealText
              text="Science and Trust"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[56px]"
            />
          </h2>
          <p className="mx-auto mt-8 max-w-[58ch] text-pretty font-sans text-body-lg text-neutral-600">
            From a single conviction to a nationwide partner in animal health — the milestones
            that shaped Agriprom Pakistan.
          </p>
        </div>

        {/* Timeline */}
        <div ref={listRef} className="relative mt-[14vh]">
          {/* the spine — faint track + drawing fill */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-6 w-px -translate-x-1/2 md:left-1/2"
          >
            <div className="absolute inset-0 bg-neutral-200" />
            <div
              data-tl-fill
              className="absolute inset-0 will-change-transform"
              style={{
                background:
                  "linear-gradient(to bottom, #008A4B 0%, #0064C1 55%, #0064C1 100%)",
              }}
            />
          </div>

          <div className="flex flex-col gap-[12vh]">
            {MILESTONES.map((milestone, i) => (
              <Row key={milestone.name} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
