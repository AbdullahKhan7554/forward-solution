"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { WorldMap } from "@/components/scenes/ScenePartners/WorldMap";
import { PartnerCard } from "@/components/scenes/ScenePartners/PartnerCard";
import { partners } from "@/components/scenes/ScenePartners/partners";

/**
 * PRODUCTS · SCENE 06 — INTERNATIONAL BRANDS.
 *
 * Reuses the Partners architecture wholesale — the same WorldMap atmosphere +
 * arc-draw/node-breathe animation, the same partners data and the same
 * glass PartnerCard (mono → colour on hover, lift, glow) — but re-composes it as
 * a floating editorial grid (a diagonal drift, not the homepage masonry) so it
 * never duplicates the homepage Network scene.
 */

// A gentle floating diagonal — offset each column so the field never reads as a grid.
const OFFSET = ["md:mt-0", "md:mt-[7vh]", "md:mt-[14vh]"];

export function ProductBrands() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-brand-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-brand-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      // brand panels — curated sequential reveal (reuses PartnerCard's data-partner)
      gsap.set("[data-partner]", { autoAlpha: 0, y: 26, scale: 0.985 });
      ScrollTrigger.batch("[data-partner]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.12,
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
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="brand-heading"
      className="relative overflow-hidden bg-base"
    >
      <WorldMap />

      <div className="relative mx-auto w-full max-w-container px-6 pb-[22vh] pt-[18vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-brand-header className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(06)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Brands</span>
          </div>
          <div data-brand-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              International Brands
            </span>
          </div>
          <h2
            id="brand-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Powered by the World's"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Leading Brands"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-brand-header
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Every Agriprom product is backed by a globally recognised manufacturer — the science
            and standards of the world&rsquo;s best, delivered to Pakistan.
          </p>
        </header>

        {/* floating brand field — grid with a diagonal drift, not masonry.
            Only an additive column offset is passed; PartnerCard keeps its own
            margins (single-property, so nothing compounds). items-start lets the
            offsets read as a float. */}
        <ul className="mt-[12vh] grid grid-cols-1 items-start gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} className={OFFSET[i % 3]} />
          ))}
        </ul>
      </div>
    </section>
  );
}
