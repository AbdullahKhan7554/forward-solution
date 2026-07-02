"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";

/**
 * PRODUCTS · SCENE 03 — THE CATEGORIES.
 *
 * The five major categories as an editorial, asymmetric magazine composition —
 * a large feature anchors the field, the rest stagger around it. Each card
 * reuses the established image language (LabPlate) unveiled by MaskedReveal, the
 * RevealText title and the same nested hover grammar as the homepage
 * CategoryBlock (image zooms, card lifts) — plus the requested glass overlay
 * carrying an Explore action. Cards reveal sequentially. Tokens throughout.
 */

function ArrowGlyph() {
  return (
    <svg
      width="26"
      height="11"
      viewBox="0 0 30 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h27M22 1l6 5-6 5" />
    </svg>
  );
}

type Category = {
  name: string;
  description: string;
  href: string;
  imageSrc?: string;
};

function CategoryCard({
  category,
  feature = false,
}: {
  category: Category;
  feature?: boolean;
}) {
  return (
    <a
      href={category.href}
      aria-label={`${category.name} — explore`}
      className="group block h-full focus:outline-none"
    >
      {/* image + hover surface (lift + glass overlay) */}
      <div className="relative overflow-hidden rounded-md shadow-soft ring-1 ring-transparent transition-[transform,box-shadow] duration-200 ease-brand-out will-change-transform group-hover:-translate-y-1 group-hover:shadow-floating group-hover:ring-primary-600/25 group-focus-visible:ring-primary-600/40">
        <MaskedReveal className={cn("w-full", feature ? "aspect-[4/5]" : "aspect-[4/3]")}>
          {/* nested scale so CSS hover and GSAP clip never fight */}
          <div className="h-full w-full transition-transform duration-200 ease-brand-out group-hover:scale-[1.04]">
            <LabPlate src={category.imageSrc} alt={category.name} fit="contain" />
          </div>
        </MaskedReveal>

        {/* glass overlay — rises in on hover with the Explore action */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition-[transform,opacity] duration-300 ease-brand-out group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between rounded-md border border-white/70 bg-white/55 px-5 py-3 shadow-glass backdrop-blur-xl backdrop-saturate-150">
            <span className="font-sans text-caption uppercase tracking-[0.24em] text-primary-700">
              Explore
            </span>
            <span className="text-primary-700">
              <ArrowGlyph />
            </span>
          </div>
        </div>
      </div>

      {/* title + description */}
      <div className="mt-5 flex items-start justify-between gap-6 md:mt-6">
        <div>
          <h3
            className={cn(
              "font-display font-light tracking-[-0.01em] text-neutral-900",
              feature
                ? "text-[7vw] md:text-[2.6vw] xl:text-[34px]"
                : "text-[6vw] md:text-[1.9vw] xl:text-[26px]"
            )}
          >
            <RevealText text={category.name} as="span" trigger="scroll" stagger={0.05} />
          </h3>
          <p
            data-cat-fade
            className="mt-2 max-w-[38ch] text-pretty font-sans text-body text-neutral-600"
          >
            {category.description}
          </p>
        </div>
        <span data-cat-fade className="mt-1 shrink-0 text-primary-600">
          <span className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1.5">
            <ArrowGlyph />
          </span>
        </span>
      </div>
    </a>
  );
}

const POULTRY: Category = {
  name: "Poultry",
  description:
    "Nutrition, gut health and performance solutions for every stage of poultry production.",
  href: "/products/poultry",
  imageSrc: "/poultry.png",
};
const OTHERS: Category[] = [
  {
    name: "Ruminants",
    description: "Health, growth and productivity support for dairy and beef cattle.",
    href: "/ruminants/",
    imageSrc: "/reuminant.png",
  },
  {
    name: "Companion Animals",
    description: "Everyday health and nutrition for dogs, cats and companion species.",
    href: "/companion-animals",
    imageSrc: "/animal%20comapnion.png",
  },
];
export function ProductCategories() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-cat-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-cat-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      gsap.set("[data-cat-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-cat-fade]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
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
      aria-labelledby="cat-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 20% 4%, rgba(219,239,231,0.38) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-cat-header className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(03)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Categories</span>
          </div>
          <div data-cat-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Product Categories
            </span>
          </div>
          <h2
            id="cat-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Explore Every Category"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="of Animal Health"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>
        </header>

        {/* MAGAZINE FIELD — feature + two, then two */}
        <div className="mt-[12vh] grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12 md:grid-rows-2">
          <div className="md:col-span-7 md:row-span-2">
            <CategoryCard category={POULTRY} feature />
          </div>
          <div className="md:col-span-5 md:col-start-8 md:row-start-1">
            <CategoryCard category={OTHERS[0]} />
          </div>
          <div className="md:col-span-5 md:col-start-8 md:row-start-2 md:pt-[6vh]">
            <CategoryCard category={OTHERS[1]} />
          </div>
        </div>

      </div>
    </section>
  );
}
