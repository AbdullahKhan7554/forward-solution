"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";
import { MapPinIcon, PhoneIcon, ClockIcon, MailIcon, ArrowUpRightIcon } from "./icons";

/**
 * CONTACT · SCENE 02 — REACH US.
 *
 * Not a card grid — floating editorial information panels set at different
 * heights, each revealing individually on scroll. Soft glass, luxury shadow,
 * generous whitespace, thin-line Lucide icons. Hover lifts the panel, deepens
 * the shadow and slides the optional action. Reduced motion: visible, static.
 */

type Panel = {
  icon: ReactNode;
  label: string;
  lines: string[];
  href?: string;
  action?: string;
  offset: string; // editorial vertical offset (desktop)
};

const PANELS: Panel[] = [
  {
    icon: <MapPinIcon />,
    label: "Address",
    lines: [
      "1st Floor, Plot 19B,",
      "Off Abdul Sattar Edhi Road,",
      "Near Qazalbash Chowk,",
      "Rahimabad, Lahore 53700",
    ],
    href: "#visit",
    action: "View location",
    offset: "md:mt-0",
  },
  {
    icon: <PhoneIcon />,
    label: "Phone",
    lines: ["+92 300 0801213"],
    href: "tel:+923000801213",
    action: "Call now",
    offset: "md:mt-16",
  },
  {
    icon: <ClockIcon />,
    label: "Business Hours",
    lines: ["Open 24 Hours", "Seven days a week"],
    offset: "md:mt-4",
  },
  {
    icon: <MailIcon />,
    label: "Email",
    lines: ["info@agriprompakistan.com"],
    href: "mailto:info@agriprompakistan.com",
    action: "Write to us",
    offset: "md:mt-20",
  },
];

function InfoPanel({ panel }: { panel: Panel }) {
  const inner = (
    <>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-600/15 bg-primary-50/60 text-primary-700 transition-colors duration-300 ease-brand-out group-hover:border-accent-300/50 group-hover:text-accent-600">
        {panel.icon}
      </span>

      <div className="mt-7">
        <span className="font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
          {panel.label}
        </span>
        <div className="mt-3 space-y-0.5">
          {panel.lines.map((line, i) => (
            <p key={i} className="font-sans text-body-lg leading-[1.5] text-neutral-800">
              {line}
            </p>
          ))}
        </div>
      </div>

      {panel.action && (
        <span className="mt-7 inline-flex items-center gap-2 font-sans text-small font-medium text-primary-700">
          {panel.action}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <ArrowUpRightIcon />
          </span>
        </span>
      )}
    </>
  );

  const className = cn(
    "group flex h-full flex-col rounded-2xl border border-white/70 bg-white/60 p-8 shadow-glass backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,border-color] duration-300 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:border-accent-300/40 hover:shadow-floating md:p-9",
    panel.offset
  );

  return (
    <div data-info-panel>
      {panel.href ? (
        <a href={panel.href} className={cn(className, "outline-none focus-visible:ring-2 focus-visible:ring-accent-500")}>
          {inner}
        </a>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </div>
  );
}

export function ContactInfo() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-info-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-info-fade]", {
        start: "top 88%",
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

      // Each panel reveals individually.
      gsap.set("[data-info-panel]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-info-panel]", {
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
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="contact-info-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(64% 46% at 82% 6%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-info-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(02)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Reach Us</span>
          </div>
          <div data-info-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Get In Touch
            </span>
          </div>
          <h2
            id="contact-info-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Every Door Is Open"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[60px]"
            />
          </h2>
        </header>

        {/* Floating editorial panels — staggered heights */}
        <div className="mt-[12vh] grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {PANELS.map((panel) => (
            <InfoPanel key={panel.label} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
