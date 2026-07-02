"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";

/**
 * POULTRY · SECTION 03 — PRODUCT CATEGORIES.
 *
 * Eight premium editorial cards: large image, minimal title, a short line, and a
 * magnetic arrow button. Hover lifts the card into glass elevation, zooms the
 * image and draws the button toward the cursor (magnetic). Reuses MaskedReveal,
 * LabPlate, RevealText and the GSAP clock; the magnetic pull uses gsap.quickTo.
 * Reduced motion: no magnetism, no zoom — everything calm and legible.
 */

type Product = { name: string; blurb: string; href: string; image?: string };

const PRODUCTS: Product[] = [
  { name: "Enzymes", blurb: "Unlock more nutrition from every gram of feed.", href: "/products/poultry/enzymes", image: "/images/products/poultry/Compound-Enzyme-NSP.jpg" },
  { name: "Organic Acids", blurb: "Lower gut pH to control pathogens naturally.", href: "/products/poultry/organic-acids", image: "/images/products/poultry/ProPhorce-SR-130-Esterified-Butyric-Acid-768x949.jpg" },
  { name: "Toxin Binders", blurb: "Neutralise mycotoxins before they cost performance.", href: "/products/poultry/toxin-binders", image: "/images/products/poultry/ElencoFix-Super.png" },
  { name: "Antioxidants", blurb: "Protect feed and cells from oxidative stress.", href: "/products/poultry/antioxidants", image: "/images/products/poultry/Bornsun-Antioxidant-Q1-768x949.jpg" },
  { name: "Emulsifiers", blurb: "Improve fat digestion and energy uptake.", href: "/products/poultry/emulsifier", image: "/images/products/poultry/LysoLip-768x949.jpg" },
  { name: "Bile Acids", blurb: "Enhance lipid absorption and liver function.", href: "/products/poultry/bile-acids", image: "/images/products/poultry/Bilepro.jpg" },
  { name: "Organic Minerals", blurb: "Highly bioavailable trace minerals for vitality.", href: "/products/poultry/organic-minerals", image: "/images/products/poultry/Minlex-Poultry.jpg" },
  { name: "Alternative Protein", blurb: "Sustainable protein without compromising growth.", href: "/products/poultry/alternative-protein", image: "/images/products/poultry/MSG-Single-Cell-Protein.jpg" },
];

function ArrowGlyph() {
  return (
    <svg
      width="22"
      height="10"
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

function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  // Magnetic button — the arrow leans toward the cursor while over the card.
  useIsomorphicLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const card = cardRef.current;
    const btn = btnRef.current;
    if (!card || !btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.16);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.16);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <li data-pp-card>
      <a
        ref={cardRef}
        href={product.href}
        aria-label={`${product.name} — explore`}
        className="group block h-full rounded-lg p-3 transition-[transform,background-color,box-shadow] duration-200 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:bg-white/55 hover:shadow-floating hover:backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <MaskedReveal className="aspect-[3/4] w-full overflow-hidden rounded-md ring-1 ring-white/50">
          <div className="h-full w-full transition-transform duration-300 ease-brand-out group-hover:scale-[1.05]">
            <LabPlate src={product.image} alt={`${product.name} for poultry — Agriprom Pakistan`} />
          </div>
        </MaskedReveal>

        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div>
            <h3 className="font-display text-h4 font-medium tracking-[-0.01em] text-neutral-900">
              <RevealText text={product.name} as="span" trigger="scroll" stagger={0.05} />
            </h3>
            <p className="mt-1.5 max-w-[30ch] text-pretty font-sans text-small text-neutral-500">
              {product.blurb}
            </p>
          </div>
          <span
            ref={btnRef}
            aria-hidden="true"
            className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-primary-700 will-change-transform transition-colors duration-200 ease-brand-out group-hover:border-primary-500 group-hover:bg-primary-600 group-hover:text-pure"
          >
            <ArrowGlyph />
          </span>
        </div>
      </a>
    </li>
  );
}

export function PoultryProducts() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-pp-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-pp-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      gsap.set("[data-pp-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-pp-card]", {
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
      id="products"
      ref={rootRef}
      aria-labelledby="poultry-products-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 80% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-pp-header className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Product Categories
            </span>
          </div>
          <h2
            id="poultry-products-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="A Complete Toolkit"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="for Poultry Nutrition"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>
        </header>

        <ul className="mt-[12vh] grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
}
