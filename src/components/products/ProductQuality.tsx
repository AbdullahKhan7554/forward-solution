"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { cn } from "@/lib/utils";

/**
 * PRODUCTS · SCENE 07 — THE QUALITY JOURNEY.
 *
 * A premium editorial timeline of the six stages every product passes through,
 * from global manufacturing to customer success. A single thin spine draws
 * itself as you descend (scroll-scrubbed); glass milestone cards alternate
 * across it and reveal in sequence; nodes settle as their stage arrives. Same
 * timeline grammar as the About Story, re-composed as a card-only process (no
 * image plates) so the two never read as the same block. Reuses GlassCard,
 * RevealText, the GSAP/ScrollTrigger clock and tokens.
 */

type Stage = { name: string; description: string };

const STAGES: Stage[] = [
  {
    name: "Global Manufacturing",
    description:
      "Products crafted by globally-qualified manufacturing partners to world-class standards.",
  },
  {
    name: "Quality Testing",
    description:
      "Rigorous quality and safety verification at every batch before anything ships.",
  },
  {
    name: "International Shipping",
    description:
      "Careful logistics and handling carry products from source to Pakistan intact.",
  },
  {
    name: "Local Distribution",
    description:
      "A nationwide network delivers reliably to every province, farm and clinic.",
  },
  {
    name: "Technical Support",
    description:
      "On-the-ground guidance ensures each product is used correctly and effectively.",
  },
  {
    name: "Customer Success",
    description:
      "A long-term partnership measured by real results on the farm, season after season.",
  },
];

function Row({ stage, index }: { stage: Stage; index: number }) {
  const cardLeft = index % 2 === 0;

  const card = (
    <div data-tq-card className={cn(cardLeft ? "md:pr-16 md:text-right" : "md:pl-16")}>
      <GlassCard
        label={`Stage ${String(index + 1).padStart(2, "0")}`}
        className={cn("w-full md:max-w-[460px]", cardLeft && "md:ml-auto")}
      >
        <h3 className="font-display text-h3 font-medium leading-[1.1] text-neutral-900">
          <RevealText
            text={stage.name}
            as="span"
            trigger="scroll"
            stagger={0.05}
            className={cn(cardLeft && "md:justify-end")}
          />
        </h3>
        <p className="mt-3 text-pretty font-sans text-body text-neutral-600">
          {stage.description}
        </p>
      </GlassCard>
    </div>
  );

  return (
    <div className="relative pl-16 md:pl-0">
      {/* node on the spine */}
      <span
        data-tq-node
        aria-hidden="true"
        className="absolute left-6 top-2 z-raised h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-accent-500 bg-base shadow-soft md:left-1/2"
      />

      {/* desktop: card sits on one side of the spine; mobile: to the right of the rail */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {cardLeft ? (
          <>
            <div className="md:col-start-1">{card}</div>
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            <div className="hidden md:block" />
            <div className="md:col-start-2">{card}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductQuality() {
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
      gsap.set("[data-tq-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-tq-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      // the spine draws itself as you descend
      gsap.set("[data-tq-fill]", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.to("[data-tq-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 72%", end: "bottom 78%", scrub: true },
      });

      // milestone cards reveal in sequence
      gsap.set("[data-tq-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-tq-card]", {
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

      // nodes settle onto the spine
      gsap.set("[data-tq-node]", { scale: 0, autoAlpha: 0 });
      ScrollTrigger.batch("[data-tq-node]", {
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
      ref={rootRef}
      aria-labelledby="tq-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* header */}
        <div className="mx-auto max-w-3xl text-center">
          <div data-tq-header className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              (07) — Quality Journey
            </span>
            <span className="h-px w-10 bg-accent-500" />
          </div>
          <h2
            id="tq-heading"
            className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="From Manufacturing"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] md:text-[4.4vw] xl:text-[56px]"
            />
            <RevealText
              text="to Your Farm"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[56px]"
            />
          </h2>
          <p
            data-tq-header
            className="mx-auto mt-8 max-w-[58ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Every product travels a rigorous journey — so what reaches your farm is exactly what
            the science intended.
          </p>
        </div>

        {/* timeline */}
        <div ref={listRef} className="relative mt-[14vh]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-6 w-px -translate-x-1/2 md:left-1/2"
          >
            <div className="absolute inset-0 bg-neutral-200" />
            <div
              data-tq-fill
              className="absolute inset-0 will-change-transform"
              style={{
                background: "linear-gradient(to bottom, #008A4B 0%, #0064C1 55%, #0064C1 100%)",
              }}
            />
          </div>

          <div className="flex flex-col gap-[10vh]">
            {STAGES.map((stage, i) => (
              <Row key={stage.name} stage={stage} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
