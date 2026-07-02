"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { PartnerCard } from "./PartnerCard";
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

      <div className="relative mx-auto w-full max-w-container px-6 pb-[24vh] pt-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-partners-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(06)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Network</span>
          </div>

          <div data-partners-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
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
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
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

        {/* PARTNER FIELD - editorial masonry, reflows for any count */}
        <ul
          data-partners-field
          className="mt-[12vh] columns-1 gap-8 will-change-transform md:columns-2 xl:columns-3"
        >
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </ul>
      </div>
    </section>
  );
}
