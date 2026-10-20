"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { ProductMedia } from "@/components/product-detail/ProductMedia";
import { CatalogCard } from "@/components/catalog/CatalogCard";

/**
 * POULTRY · SECTION 03 — PRODUCT CATEGORIES.
 *
 * Category cards via the shared CatalogCard (same as the ruminant grid):
 * image, title, one line, "Explore →"; 200ms lift + image zoom on hover.
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
  { name: "Probiotics", blurb: "Gut health that fuels performance.", href: "/products/poultry/probiotics" },
  { name: "Fly Control", blurb: "Break the fly cycle at the source.", href: "/products/poultry/fly-control" },
  { name: "Feed Pigment", blurb: "Consistent color without compromise", href: "/products/poultry/feed-pigment" },
  { name: "Feed Hygienizer", blurb: "Fresher feed, fewer toxin risks", href: "/products/poultry/feed-hygienizer" },
  { name: "Phytogenic Anticoccidials", blurb: "Plant-powered protection against coccidiosis.", href: "/products/poultry/phytogenic-anticoccidials" },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <li data-pp-card>
      <CatalogCard
        href={product.href}
        title={product.name}
        line={product.blurb}
        action="Explore"
        image={<ProductMedia label={product.name} alt={`${product.name} for poultry — Agriprom Pakistan`} src={product.image} className="h-full w-full" />}
      />
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
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none none" },
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

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-pp-header className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
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

        <ul className="mt-[10vh] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
}
