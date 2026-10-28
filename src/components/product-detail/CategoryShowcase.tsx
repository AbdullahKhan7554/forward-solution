"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/scroll-trigger";
import { RevealText } from "@/components/primitives/RevealText";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { ProductMedia } from "./ProductMedia";
import type { ProductDetailData } from "./types";
import { containRuminantImage } from "@/components/ruminants/categories";

/**
 * CategoryShowcase — a category page: header, then a grid of shared
 * CatalogCard product cards (image, name, tagline, "Details →") linking to each
 * product page. Empty categories show a graceful state.
 */
export type ShowcaseItem = { href: string; data: ProductDetailData };

export function CategoryShowcase({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  items,
  backHref = "/products/poultry",
}: {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  items: ShowcaseItem[];
  backHref?: string;
}) {
  const headerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = headerRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-cs-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-cs-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 78%", toggleActions: "play none none none" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const products = items;

  return (
    <>
      <section ref={headerRef} aria-labelledby="cs-heading" className="relative overflow-hidden bg-base">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(80% 55% at 20% 6%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 58%)" }}
        />
        <div className="relative mx-auto w-full max-w-container px-6 pb-[6vh] pt-[26vh] md:px-12 xl:px-20">
          <div data-cs-fade className="mb-7 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.28em] text-neutral-900">
            <span className="h-px w-10 bg-accent-500" />
            <a href={backHref} className="transition-colors hover:text-primary-700">{eyebrow}</a>
          </div>
          <h1 id="cs-heading" className="font-display font-light leading-[1.03] tracking-[-0.015em] text-neutral-900">
            <RevealText text={titleTop} as="span" trigger="scroll" stagger={0.06} className="justify-start text-[11vw] md:text-[5.4vw] xl:text-[72px]" />
            <RevealText text={titleBottom} as="span" trigger="scroll" stagger={0.06} className="justify-start text-[11vw] text-primary-700 md:text-[5.4vw] xl:text-[72px]" />
          </h1>
          <p data-cs-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-900">{intro}</p>
        </div>

        {products.length === 0 && (
          <div className="relative mx-auto w-full max-w-container px-6 pb-16 md:pb-24 md:px-12 xl:px-20">
            <div data-cs-fade className="rounded-lg border border-white/70 bg-white/85 p-12 text-center shadow-glass md:p-16">
              <p className="font-serif text-body-lg italic text-neutral-900">Products coming soon.</p>
              <p className="mx-auto mt-4 max-w-[46ch] font-sans text-body text-neutral-900">
                We&rsquo;re expanding this range. Talk to our technical team about solutions for your
                operation in the meantime.
              </p>
              <a
                href="/contact-us/"
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Contact Our Experts
              </a>
            </div>
          </div>
        )}
      </section>

      {products.length > 0 && (
        <section aria-label={`${titleTop} ${titleBottom} products`} className="bg-base">
          <ul className="mx-auto grid w-full max-w-container grid-cols-1 gap-6 px-6 pb-16 md:pb-24 pt-[6vh] sm:grid-cols-2 md:gap-8 md:px-12 lg:grid-cols-3 xl:grid-cols-4 xl:px-20">
            {products.map((p) => (
              <li key={p.data.slug}>
                <CatalogCard
                  href={p.href}
                  title={p.data.name}
                  line={p.data.subtitle}
                  action="Details"
                  image={<ProductMedia label={p.data.name} alt={`${p.data.name} — Agriprom Pakistan`} src={p.data.assets?.hero} className={containRuminantImage(p.data.assets?.hero) ? "h-full w-full [&_img]:!object-contain" : "h-full w-full"} />}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
