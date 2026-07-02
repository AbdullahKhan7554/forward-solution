"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { ProductMedia } from "@/components/product-detail/ProductMedia";

/**
 * CATEGORY LISTING — a premium grid of products within one poultry category
 * (e.g. Enzymes). Reuses the established card grammar: MaskedReveal image
 * (drop-in ProductMedia placeholder), RevealText title, glass elevation + image
 * zoom + magnetic arrow on hover, sequential reveal. No new design language.
 */

export type ListingItem = { name: string; blurb: string; href: string };

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

function Card({ item }: { item: ListingItem }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

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
    <li data-cl-card>
      <a
        ref={cardRef}
        href={item.href}
        aria-label={`${item.name} — view product`}
        className="group block h-full rounded-lg p-3 transition-[transform,background-color,box-shadow] duration-200 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:bg-white/55 hover:shadow-floating hover:backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <MaskedReveal className="aspect-[3/4] w-full overflow-hidden rounded-md ring-1 ring-white/50">
          <div className="h-full w-full transition-transform duration-300 ease-brand-out group-hover:scale-[1.05]">
            <ProductMedia label={item.name} alt={`${item.name} — Agriprom Pakistan`} className="h-full w-full" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        </MaskedReveal>

        <div className="mt-5 flex items-start justify-between gap-4 px-1">
          <div>
            <h3 className="font-display text-h4 font-medium tracking-[-0.01em] text-neutral-900">
              <RevealText text={item.name} as="span" trigger="scroll" stagger={0.05} />
            </h3>
            <p className="mt-1.5 max-w-[34ch] text-pretty font-sans text-small text-neutral-500">
              {item.blurb}
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

export function CategoryListing({
  eyebrow,
  titleTop,
  titleBottom,
  intro,
  items,
}: {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  intro: string;
  items: ListingItem[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-cl-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-cl-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.set("[data-cl-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-cl-card]", {
        start: "top 92%",
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
    <section ref={rootRef} aria-labelledby="cl-heading" className="relative overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(80% 55% at 20% 6%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 pb-[16vh] pt-[26vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-cl-fade className="mb-7 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
            <span className="h-px w-10 bg-accent-500" />
            <a href="/products/poultry" className="transition-colors hover:text-primary-700">
              {eyebrow}
            </a>
          </div>
          <h1 id="cl-heading" className="font-display font-light leading-[1.03] tracking-[-0.015em] text-neutral-900">
            <RevealText text={titleTop} as="span" trigger="scroll" stagger={0.06} className="justify-start text-[11vw] md:text-[5.4vw] xl:text-[72px]" />
            <RevealText text={titleBottom} as="span" trigger="scroll" stagger={0.06} className="justify-start text-[11vw] text-primary-700 md:text-[5.4vw] xl:text-[72px]" />
          </h1>
          <p data-cl-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
            {intro}
          </p>
        </header>

        {items.length > 0 ? (
          <ul className="mt-[10vh] grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.href} item={item} />
            ))}
          </ul>
        ) : (
          <div data-cl-fade className="mt-[10vh] rounded-lg border border-white/70 bg-white/55 p-12 text-center shadow-glass backdrop-blur-xl backdrop-saturate-150 md:p-16">
            <p className="font-serif text-body-lg italic text-neutral-500">Products coming soon.</p>
            <p className="mx-auto mt-4 max-w-[46ch] font-sans text-body text-neutral-600">
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
        )}
      </div>
    </section>
  );
}
