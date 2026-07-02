"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { WorldMap } from "@/components/scenes/ScenePartners/WorldMap";

/**
 * ABOUT · SCENE 07 — GLOBAL PRESENCE.
 *
 * Reuses the homepage Partners atmosphere — the same WorldMap (dot graticule +
 * glowing connection arcs + node glows) and the same arc-draw / node-breathe /
 * parallax animation — but tells a different story so it never duplicates the
 * homepage Network scene: Global Reach, International Supply Network and
 * Scientific Collaboration, anchored by live-counting statistics.
 *
 * Statistics: Global Partners is the real count (9, from the partners list);
 * Countries / Solutions are rounded illustrative figures — confirm official
 * numbers and swap in one place.
 */

/* Minimal Lucide-style line icons (stroke 1.5). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
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
const Globe = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
  </Icon>
);
const Truck = () => (
  <Icon>
    <path d="M1 3h13v11H1zM14 7h4l3 3v4h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="18" cy="18" r="1.6" />
  </Icon>
);
const Flask = () => (
  <Icon>
    <path d="M9 2h6M10 2v6L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8V2" />
    <path d="M7.5 14h9" />
  </Icon>
);

const FOCUS = [
  {
    title: "Global Reach",
    body: "Partnerships spanning Europe, Asia and beyond bring world-class animal health science to Pakistani farms.",
    icon: <Globe />,
  },
  {
    title: "International Supply Network",
    body: "A reliable global-to-local supply chain keeps globally-qualified products flowing to every province.",
    icon: <Truck />,
  },
  {
    title: "Scientific Collaboration",
    body: "Shared research and technical exchange with leading manufacturers sharpen every solution we deliver.",
    icon: <Flask />,
  },
];

const STATS = [
  { target: 8, suffix: "+", label: "Countries" },
  { target: 9, suffix: "", label: "Global Partners" },
  { target: 50, suffix: "+", label: "Solutions" },
];

/* Floating indicators drifting over the map atmosphere. */
const INDICATORS = [
  { label: "Europe", top: "24%", left: "20%" },
  { label: "South Asia", top: "52%", left: "58%" },
  { label: "East Asia", top: "34%", left: "82%" },
];

export function AboutGlobalPresence() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // header
      gsap.set("[data-glob-fade]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-glob-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        })
        .to("[data-glob-line]", { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0)
        .to("[data-glob-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.3);

      // focus cards + stats — sequential reveal
      gsap.set("[data-glob-card]", { autoAlpha: 0, y: 26, scale: 0.985 });
      ScrollTrigger.batch("[data-glob-card]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.14,
            overwrite: true,
          }),
      });

      // world map — reuse the draw-then-breathe animation + parallax
      gsap.set("[data-map-path]", { strokeDashoffset: 1 });
      gsap.to("[data-map-path]", {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.3,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.to("[data-map-node] circle", {
        opacity: 0.5,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
      });
      gsap.to("[data-worldmap]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });

      // floating indicators — soft pulse
      gsap.to("[data-glob-indicator] [data-pulse]", {
        scale: 1.9,
        opacity: 0,
        duration: 2.6,
        ease: "sine.out",
        repeat: -1,
        stagger: { each: 0.5, from: "random" },
      });

      // statistics — count up as they enter
      gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
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
      ref={rootRef}
      aria-labelledby="about-global-heading"
      className="relative overflow-hidden bg-pure"
    >
      <WorldMap />

      {/* floating indicators over the map */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {INDICATORS.map((ind) => (
          <span
            key={ind.label}
            data-glob-indicator
            className="absolute flex items-center gap-2"
            style={{ top: ind.top, left: ind.left }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                data-pulse
                className="absolute inset-0 rounded-full bg-accent-500/50"
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
            </span>
            <span className="font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
              {ind.label}
            </span>
          </span>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-container px-6 pb-[22vh] pt-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-glob-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(07)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Global Presence</span>
          </div>

          <div data-glob-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              International Collaboration
            </span>
          </div>

          <h2
            id="about-global-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Connecting Pakistan to"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="a World of Science"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-glob-fade
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Through long-term international partnerships, Agriprom Pakistan brings globally
            recognised animal health and nutrition science home — and keeps it moving,
            reliably, to every farm and clinic.
          </p>

          <span
            data-glob-line
            aria-hidden="true"
            className="mt-12 block h-px w-full bg-neutral-200"
          />
        </header>

        {/* FOCUS PILLARS */}
        <ul className="mt-[12vh] grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {FOCUS.map((f) => (
            <li key={f.title} data-glob-card>
              <GlassCard className="h-full">
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft">
                  {f.icon}
                </span>
                <h3 className="font-display text-h4 font-medium text-neutral-900">{f.title}</h3>
                <p className="mt-3 text-pretty font-sans text-body text-neutral-600">{f.body}</p>
              </GlassCard>
            </li>
          ))}
        </ul>

        {/* STATISTICS */}
        <div className="mt-[14vh] grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} data-glob-card className="text-center sm:text-left">
              <div className="flex items-baseline justify-center gap-1 sm:justify-start">
                <span
                  data-stat-num
                  data-target={stat.target}
                  className="font-display text-[13vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[5vw] xl:text-[72px]"
                >
                  {stat.target}
                </span>
                <span className="font-display text-h2 font-light text-accent-500">
                  {stat.suffix}
                </span>
              </div>
              <span className="mt-4 block font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
