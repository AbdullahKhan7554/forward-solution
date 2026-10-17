"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * ProductCompact — the ONE shared product layout for poultry and ruminants.
 * Short and scannable, in a fixed order:
 *   hero (name, tagline, intro, image) → specs table → key benefits →
 *   applications → features (only when present) → CTA.
 * Motion is a short fade only; reduced-motion safe.
 */
export type CompactProduct = {
  name: string;
  tagline?: string;
  intro: string;
  image: ReactNode;
  specs: { label: string; values: string[] }[];
  benefits: string[];
  applications: string[];
  features?: string[];
};

export type CompactCTA = {
  heading?: string;
  body?: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-5 flex items-center gap-4 font-sans text-caption uppercase tracking-[0.24em] text-neutral-500">
      <span className="h-px w-8 bg-accent-500" />
      {children}
    </h3>
  );
}

function TickList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 font-sans text-body text-neutral-800">
          <Check />
          <span className="mt-0.5">{b}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProductCompact({
  product,
  cta,
  eyebrow,
  as: Heading = "h3",
  className,
}: {
  product: CompactProduct;
  cta: CompactCTA;
  eyebrow?: ReactNode;
  /** h1 on a standalone product page, h3 inside a category section. */
  as?: "h1" | "h3";
  className?: string;
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
      gsap.set("[data-pc-fade]", { autoAlpha: 0, y: 16 });
      ScrollTrigger.batch("[data-pc-fade]", {
        start: "top 90%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, overwrite: true }),
      });
    }, root);
    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <article ref={rootRef} aria-label={product.name} className={className}>
      {/* hero */}
      <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 md:grid-cols-12">
        <div data-pc-fade className="md:col-span-6">
          {eyebrow && (
            <div className="mb-6 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
              <span className="h-px w-10 bg-accent-500" />
              {eyebrow}
            </div>
          )}
          <Heading className="font-display text-h1 font-light leading-[1.05] tracking-[-0.01em] text-neutral-900">{product.name}</Heading>
          {product.tagline && (
            <p className="mt-4 font-sans text-caption uppercase tracking-[0.16em] text-primary-700">{product.tagline}</p>
          )}
          <p className="mt-5 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600">{product.intro}</p>
        </div>
        <div data-pc-fade className="md:col-span-5 md:col-start-8">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60">{product.image}</div>
        </div>
      </div>

      {/* specs table */}
      <section data-pc-fade className="mt-[8vh]">
        <Label>Specifications</Label>
        <dl className="overflow-hidden rounded-lg border border-neutral-200/80 bg-white/85">
          {product.specs.map((row, i) => (
            <div
              key={row.label}
              className={cn("grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-[minmax(160px,1fr)_2fr] sm:gap-8", i > 0 && "border-t border-neutral-200/70")}
            >
              <dt className="font-sans text-caption uppercase tracking-[0.18em] text-neutral-500">{row.label}</dt>
              <dd className="font-sans text-body text-neutral-900">{row.values.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* key benefits */}
      <section data-pc-fade className="mt-[6vh]">
        <Label>Key Benefits</Label>
        <TickList items={product.benefits} />
      </section>

      {/* applications */}
      <section data-pc-fade className="mt-[6vh]">
        <Label>Applications</Label>
        <ul className="flex flex-wrap gap-3">
          {product.applications.map((a) => (
            <li key={a} className="rounded-full border border-neutral-200 bg-white/70 px-5 py-2 font-sans text-body text-neutral-700">
              {a}
            </li>
          ))}
        </ul>
      </section>

      {/* features — only when the data exists */}
      {product.features && product.features.length > 0 && (
        <section data-pc-fade className="mt-[6vh]">
          <Label>Features</Label>
          <TickList items={product.features} />
        </section>
      )}

      {/* CTA */}
      <div data-pc-fade className="mt-[7vh] border-t border-neutral-200/80 pt-[5vh]">
        {cta.heading && (
          <p className="font-display text-h3 font-light leading-[1.15] text-neutral-900">{cta.heading}</p>
        )}
        {cta.body && (
          <p className="mt-3 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">{cta.body}</p>
        )}
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", (cta.heading || cta.body) && "mt-8")}>
          <a
            href={cta.primaryHref ?? "/contact-us/"}
            className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            {cta.primaryLabel}
            <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1">&rarr;</span>
          </a>
          {cta.secondaryLabel && cta.secondaryHref && (
            <a
              href={cta.secondaryHref}
              className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              {cta.secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
