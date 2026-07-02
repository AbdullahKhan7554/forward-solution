"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { cn } from "@/lib/utils";

/**
 * ABOUT · SCENE 05 — OUR CORE VALUES.
 *
 * Six values in a floating editorial composition — not an equal grid: the cards
 * step down the field in a gentle diagonal, breathing white space between them.
 * Minimal Lucide-style line icons (stroke 1.5, matching the Footer set). Hover
 * reuses GlassCard's lift + shadow and adds a soft accent glow. Values reveal in
 * sequence. Reuses GlassCard, RevealText, the GSAP/ScrollTrigger clock, tokens.
 */

/* Minimal Lucide-style line icons (stroke 1.5) — no runtime dependency. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const Lightbulb = () => (
  <Icon>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
  </Icon>
);
const Shield = () => (
  <Icon>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const Award = () => (
  <Icon>
    <circle cx="12" cy="9" r="6" />
    <path d="m9 14.5-1.5 7L12 19l4.5 2.5L15 14.5" />
  </Icon>
);
const Atom = () => (
  <Icon>
    <circle cx="12" cy="12" r="1.4" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
  </Icon>
);
const Users = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
  </Icon>
);
const Leaf = () => (
  <Icon>
    <path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16a4 4 0 0 1-4-4c0-3 3-6 8-7" />
  </Icon>
);

type Value = { title: string; body: string; icon: ReactNode; offset: string };

/* The offsets stagger the cards into a floating diagonal — not an equal grid. */
const VALUES: Value[] = [
  {
    title: "Innovation",
    body: "Research-driven formulations that move animal health forward.",
    icon: <Lightbulb />,
    offset: "md:mt-0",
  },
  {
    title: "Integrity",
    body: "Honest science and transparent partnerships in every decision.",
    icon: <Shield />,
    offset: "md:mt-[7vh]",
  },
  {
    title: "Quality",
    body: "Globally-qualified standards, verified at every stage.",
    icon: <Award />,
    offset: "md:mt-[14vh]",
  },
  {
    title: "Scientific Excellence",
    body: "Rigorous, evidence-led expertise behind every product.",
    icon: <Atom />,
    offset: "md:mt-0",
  },
  {
    title: "Customer Partnership",
    body: "Long-term relationships, built farm-to-farm, side by side.",
    icon: <Users />,
    offset: "md:mt-[7vh]",
  },
  {
    title: "Sustainability",
    body: "Solutions that nurture both livestock and the planet.",
    icon: <Leaf />,
    offset: "md:mt-[14vh]",
  },
];

function ValueCard({ value, index }: { value: Value; index: number }) {
  return (
    <li data-value-card className={cn(value.offset)}>
      <GlassCard className="relative h-full overflow-hidden">
        {/* soft accent glow — appears on hover, sits behind the content */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,138,75,0.35), rgba(0,138,75,0))",
          }}
        />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-300 ease-brand-out group-hover:text-accent-600">
              {value.icon}
            </span>
            <span className="font-sans text-caption tracking-[0.24em] text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-display text-h4 font-medium text-neutral-900">{value.title}</h3>
          <p className="mt-3 text-pretty font-sans text-body text-neutral-600">{value.body}</p>
        </div>
      </GlassCard>
    </li>
  );
}

export function AboutValues() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-values-slate]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-values-slate]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      gsap.set("[data-value-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-value-card]", {
        start: "top 90%",
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
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="about-values-heading"
      className="relative overflow-hidden bg-base"
    >
      {/* soft daylight bloom for breathing space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 78% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate + heading */}
        <div data-values-slate className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">
              (05)
            </span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">
              Our Core Values
            </span>
          </div>

          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
              What We Stand For
            </span>
          </div>

          <h2
            id="about-values-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="The Principles Behind"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.6vw] xl:text-[56px]"
            />
            <RevealText
              text="Every Decision"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.6vw] xl:text-[56px]"
            />
          </h2>
        </div>

        {/* floating value field */}
        <ul className="mt-[12vh] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {VALUES.map((value, i) => (
            <ValueCard key={value.title} value={value} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
