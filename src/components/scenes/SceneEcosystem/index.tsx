"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { RevealText } from "@/components/primitives/RevealText";
import { useEcosystemChoreography } from "./useEcosystemChoreography";

/**
 * SCENE 05 - PRODUCT ECOSYSTEM.
 *
 * Four category cards in one row on desktop (2 on tablet, 1 on mobile): image
 * on top, then a theme-green icon + title, then the subhead. Subheads are the
 * existing homepage category descriptions.
 */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  className: "h-6 w-6 shrink-0",
  "aria-hidden": true,
} as const;

const HenIcon = () => (
  <svg {...iconProps}>
    <path d="M9 3c1.2 0 2 .9 2 2v.4c.6-.3 1.3-.4 2-.4 1.1 0 2 .3 2.7.9L18 4.5c.3 1.3-.1 2.4-.9 3.1.6.8.9 1.8.9 2.9v.5l3-1.5c.3 4.2-2.2 8-6 9.2V21h1v1.5h-5V21h1v-1.6A7 7 0 0 1 6 12.5V9.4L3.5 8.5 6 7V5.5C6 4.1 7.3 3 9 3zm-.5 3a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z" />
  </svg>
);

const CowIcon = () => (
  <svg {...iconProps}>
    <path d="M3 5.5 5.5 7h1.2A4 4 0 0 1 10 5.5h4A4 4 0 0 1 17.3 7h1.2L21 5.5 20 8.6 18 9.3V13a3 3 0 0 1-1.2 2.4l.7 4.6h-2l-.6-4h-5.8l-.6 4h-2l.7-4.6A3 3 0 0 1 6 13V9.3L4 8.6 3 5.5zm6.5 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3zm-1.2 13.6-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6z" />
  </svg>
);

const LeafIcon = () => (
  <svg {...iconProps}>
    <path d="M20.5 3.5C11 3.5 5 8 5 14.5c0 1.6.4 3 1.1 4.2L3.5 21.3l1.2 1.2 2.6-2.6c1.2.7 2.6 1.1 4.2 1.1 6.5 0 9-6 9-17.5zM9.2 16.2l-1.4-1.4c2.6-2.6 5.4-4.6 8.4-6l.8 1.8c-2.8 1.3-5.4 3.2-7.8 5.6z" />
  </svg>
);

const CATEGORIES: { name: string; description: string; image: string; href: string; icon: ReactNode }[] = [
  {
    name: "Poultry",
    description: "Committed to enhancing poultry nutrition and performance.",
    image: "/images/home/cat-poultry.webp",
    href: "/products/poultry",
    icon: <HenIcon />,
  },
  {
    name: "Ruminants",
    description: "Supporting better health, growth, and performance.",
    image: "/images/home/cat-ruminants.webp",
    href: "/ruminants/",
    icon: <CowIcon />,
  },
  {
    name: "Biosecurity",
    description: "Disease prevention and hygiene that keep herds protected.",
    image: "/images/home/cat-biosecurity.webp",
    href: "/products/ruminants/biosecurity",
    icon: <ShieldIcon />,
  },
  {
    name: "Nutrition",
    description: "Research-driven nutrition that improves feed conversion and productivity.",
    image: "/images/home/cat-nutrition.webp",
    href: "/products",
    icon: <LeafIcon />,
  },
];

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

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-eco-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
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
            className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Agriprom Pakistan delivers research-driven products across every major
            livestock sector.
          </p>
        </header>

        {/* CATEGORY CARDS */}
        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.name} data-eco-fade className="list-none">
              <a
                href={c.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition-shadow duration-150 ease-brand-out hover:shadow-floating focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 ease-brand-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-primary-600">
                    {c.icon}
                    <h3 className="font-display text-h4 font-medium text-neutral-900">{c.name}</h3>
                  </div>
                  <p className="mt-3 text-pretty font-sans text-body text-neutral-900">
                    {c.description}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
