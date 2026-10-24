"use client";

import { useRef } from "react";
import Image from "next/image";
import { RevealText } from "@/components/primitives/RevealText";
import { WorldMap } from "./WorldMap";
import { partners } from "./partners";
import { usePartnersChoreography } from "./usePartnersChoreography";

export function ScenePartners() {
  const rootRef = useRef<HTMLElement>(null);
  usePartnersChoreography(rootRef);

  return (
    <section
      ref={rootRef}
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-pure"
    >
      <WorldMap />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-partners-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
              Global Network
            </span>
          </div>

          <h2
            id="partners-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Trusted By Global Animal"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Health Leaders"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-partners-fade
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Agriprom Pakistan works alongside globally recognised leaders in animal
            health and nutrition, bringing world-class, research-driven solutions to
            Pakistan through long-term international partnerships.
          </p>

          <span
            data-partners-line
            aria-hidden="true"
            className="mt-12 block h-px w-full origin-left bg-neutral-200"
          />
        </header>

        {/* PARTNER MARQUEE - infinite auto-scroll; list duplicated for a seamless loop */}
        <style>{`
          @keyframes partners-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .partners-track { animation: partners-marquee 40s linear infinite; }
          .partners-marquee:hover .partners-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .partners-track { animation: none; } }
        `}</style>
        <div data-partners-field className="partners-marquee mt-[12vh] overflow-hidden">
          <ul className="partners-track flex w-max">
            {[...partners, ...partners].map((partner, i) => (
              <li
                key={`${partner.name}-${i}`}
                aria-hidden={i >= partners.length || undefined}
                className="mr-6 flex w-56 shrink-0 list-none flex-col items-center rounded-lg border border-white/70 bg-white/85 p-6 shadow-soft"
              >
                <div className="flex h-24 w-full items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={176}
                    height={96}
                    sizes="176px"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-4 text-center font-display text-body-lg font-medium text-neutral-900">
                  {partner.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
