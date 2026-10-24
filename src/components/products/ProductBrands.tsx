"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { WorldMap } from "@/components/scenes/ScenePartners/WorldMap";
import { partners } from "@/components/scenes/ScenePartners/partners";

/**
 * PRODUCTS · SCENE 06 — INTERNATIONAL BRANDS.
 *
 * Reuses the Partners architecture wholesale — the same WorldMap atmosphere +
 * arc-draw/node-breathe animation, the same partners data and the same
 * — rendered as an infinite auto-scrolling logo marquee in full colour.
 */

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
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none" },
      });

      // world map — reuse the draw-then-breathe animation
      gsap.set("[data-map-path]", { strokeDashoffset: 1 });
      gsap.to("[data-map-path]", {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.3,
        scrollTrigger: { trigger: root, start: "top 75%", toggleActions: "play none none none" },
      });
      gsap.to("[data-map-node] circle", {
        opacity: 0.5,
        duration: 3.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
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

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-brand-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
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
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Every Agriprom product is backed by a globally recognised manufacturer — the science
            and standards of the world&rsquo;s best, delivered to Pakistan.
          </p>
        </header>

        {/* BRAND MARQUEE - infinite auto-scroll; list duplicated for a seamless loop */}
        <style>{`
          @keyframes brands-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .brands-track { animation: brands-marquee 40s linear infinite; }
          .brands-marquee:hover .brands-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .brands-track { animation: none; } }
        `}</style>
        <div className="brands-marquee mt-[12vh] overflow-hidden">
          <ul className="brands-track flex w-max">
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
