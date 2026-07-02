"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { ProductMedia } from "./ProductMedia";
import type { ProductDetailData } from "./products";
import { cn } from "@/lib/utils";

/**
 * ProductShowcase — a premium, full presentation of a single product inside a
 * category page. NOT a card. Five layout variants cycle by index so no two
 * products ever share the same composition:
 *
 *   0 — Image Left · Specifications Right
 *   1 — Image Right · Benefits Left
 *   2 — Full-width background image · floating glass spec panel
 *   3 — Split editorial (oversized name + image, details band beneath)
 *   4 — Floating product image · overlapping luxury glass card
 *
 * Each contains image, name, description, specifications, key benefits,
 * applications, features and a CTA. Reuses MaskedReveal, LabPlate/ProductMedia,
 * RevealText, GlassCard, GSAP (image reveal, mask reveal, text reveal, spec-card
 * reveal, dolly parallax) and micro-hover. Reduced motion: static and legible.
 */

/* ── shared content atoms ─────────────────────────────────────────────────── */

function Media({ data, className }: { data: ProductDetailData; className?: string }) {
  const inner =
    data.media === "placeholder" ? (
      <ProductMedia label={`${data.name}`} alt={`${data.name} — Agriprom Pakistan`} src={data.assets?.hero} className="h-full w-full" />
    ) : (
      <LabPlate src={data.assets?.hero} alt={`${data.name} — Agriprom Pakistan`} />
    );
  return (
    <MaskedReveal direction="up" className={cn("overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60", className)}>
      <div data-sw-img className="h-full w-full will-change-transform">
        {inner}
      </div>
    </MaskedReveal>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-sw-fade>
      <span className="mb-3 block font-sans text-caption uppercase tracking-[0.24em] text-neutral-500">{label}</span>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it} className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-sans text-small text-neutral-700">
          {it}
        </li>
      ))}
    </ul>
  );
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3 font-sans text-body text-neutral-700">
          <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
          {it}
        </li>
      ))}
    </ul>
  );
}

function SpecPanel({ data }: { data: ProductDetailData }) {
  return (
    <GlassCard label="Technical Specifications" className="h-full">
      <dl className="flex flex-col">
        {data.specs.map((row, i) => (
          <div
            key={row.label}
            className={cn("grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(120px,1fr)_1.6fr] sm:gap-6", i > 0 && "border-t border-neutral-200/70")}
          >
            <dt className="font-sans text-caption uppercase tracking-[0.18em] text-neutral-500">{row.label}</dt>
            <dd className="font-sans text-body text-neutral-900">{row.values.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}

function CTAs({ data, href }: { data: ProductDetailData; href: string }) {
  return (
    <div data-sw-fade className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <a
        href={href}
        className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        View {data.name}
        <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">&rarr;</span>
      </a>
      <a
        href="/contact-us/"
        className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        Contact Expert
      </a>
    </div>
  );
}

function Heading({ data, num, light = false }: { data: ProductDetailData; num: string; light?: boolean }) {
  return (
    <>
      <div data-sw-fade className="mb-5 flex items-center gap-3">
        <span className={cn("font-sans text-caption tracking-[0.2em]", light ? "text-white/60" : "text-neutral-400")}>{num}</span>
        <span className="h-px w-8 bg-accent-500" />
        <span className={cn("font-sans text-caption uppercase tracking-[0.28em]", light ? "text-white/80" : "text-primary-700")}>{data.eyebrow}</span>
      </div>
      <h3 className={cn("font-display font-light leading-[1.06] tracking-[-0.015em]", light ? "text-neutral-50" : "text-neutral-900")}>
        <RevealText text={data.name} as="span" trigger="scroll" stagger={0.05} className="justify-start text-[8.5vw] md:text-[3.6vw] xl:text-[46px]" />
      </h3>
      {data.subtitle && (
        <p data-sw-fade className={cn("mt-3 font-serif text-body-lg italic", light ? "text-white/70" : "text-neutral-500")}>{data.subtitle}</p>
      )}
      <p data-sw-fade className={cn("mt-5 max-w-[52ch] text-pretty font-sans text-body-lg", light ? "text-neutral-200" : "text-neutral-600")}>
        {data.intro}
      </p>
    </>
  );
}

/* ── the showcase ─────────────────────────────────────────────────────────── */

export function ProductShowcase({ data, href, index }: { data: ProductDetailData; href: string; index: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const variant = index % 5;
  const num = String(index + 1).padStart(2, "0");

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-sw-fade]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-sw-fade]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
      gsap.set("[data-sw-panel]", { autoAlpha: 0, y: 30, scale: 0.99 });
      ScrollTrigger.batch("[data-sw-panel]", {
        start: "top 88%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out", overwrite: true }),
      });
      gsap.utils.toArray<HTMLElement>("[data-sw-img]").forEach((el) => {
        gsap.fromTo(el, { scale: 1 }, { scale: 1.07, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  const bg = variant === 1 || variant === 3 ? "bg-base" : "bg-pure";

  /* Variant 2 — full-width background image + floating glass panel */
  if (variant === 2) {
    return (
      <section ref={rootRef} aria-label={data.name} className="relative min-h-[92svh] overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <div data-sw-img className="h-full w-full will-change-transform">
            {data.media === "placeholder" ? (
              <ProductMedia label={data.name} alt={`${data.name} — Agriprom Pakistan`} src={data.assets?.hero} className="h-full w-full" sizes="100vw" />
            ) : (
              <LabPlate src={data.assets?.hero} alt={`${data.name} — Agriprom Pakistan`} />
            )}
          </div>
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(11,17,22,0.55) 0%, rgba(11,17,22,0.15) 45%, rgba(11,17,22,0.05) 100%)" }} />
        </div>
        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-container items-center px-6 py-[14vh] md:px-12 xl:px-20">
          <div data-sw-panel className="w-full max-w-[560px] rounded-lg border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl backdrop-saturate-150 md:p-12">
            <Heading data={data} num={num} />
            <div className="mt-8 space-y-8">
              <Block label="Technical Specifications"><SpecPanelInline data={data} /></Block>
              <Block label="Key Benefits"><Ticks items={data.benefits.slice(0, 5)} /></Block>
              <Block label="Applications"><Chips items={data.applications} /></Block>
            </div>
            <div className="mt-10"><CTAs data={data} href={href} /></div>
          </div>
        </div>
      </section>
    );
  }

  /* Variant 3 — split editorial: oversized name + image, details band beneath */
  if (variant === 3) {
    return (
      <section ref={rootRef} aria-label={data.name} className={cn("relative overflow-hidden", bg)}>
        <div className="mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 md:grid-cols-12">
            <div className="md:col-span-6"><Heading data={data} num={num} /><div className="mt-9"><CTAs data={data} href={href} /></div></div>
            <div className="md:col-span-6"><Media data={data} className="aspect-[5/4] w-full" /></div>
          </div>
          <div className="mt-[10vh] grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-4">
            <Block label="Key Benefits"><Ticks items={data.benefits.slice(0, 5)} /></Block>
            <Block label="Applications"><Chips items={data.applications} /></Block>
            <Block label="Features"><Ticks items={data.overviewPoints.slice(0, 5)} /></Block>
            <div data-sw-panel><SpecPanel data={data} /></div>
          </div>
        </div>
      </section>
    );
  }

  /* Variant 4 — floating product image + overlapping luxury glass card */
  if (variant === 4) {
    return (
      <section ref={rootRef} aria-label={data.name} className="relative overflow-hidden bg-pure">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 55% at 75% 12%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)" }}
        />
        <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
          <div className="relative md:grid md:grid-cols-12 md:items-center">
            <div className="md:col-span-7"><Media data={data} className="aspect-[4/3] w-full md:aspect-[16/11]" /></div>
            <div data-sw-panel className="relative z-raised mt-[-8vh] md:col-span-6 md:col-start-6 md:mt-0">
              <div className="rounded-lg border border-white/70 bg-white/70 p-8 shadow-glass backdrop-blur-2xl backdrop-saturate-150 md:p-12">
                <Heading data={data} num={num} />
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Block label="Key Benefits"><Ticks items={data.benefits.slice(0, 5)} /></Block>
                  <Block label="Applications"><Chips items={data.applications} /></Block>
                </div>
                <div className="mt-8"><Block label="Technical Specifications"><SpecPanelInline data={data} /></Block></div>
                <div className="mt-10"><CTAs data={data} href={href} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* Variants 0 & 1 — image left/right with details beside */
  const imageLeft = variant === 0;
  return (
    <section ref={rootRef} aria-label={data.name} className={cn("relative overflow-hidden", bg)}>
      <div className="mx-auto grid w-full max-w-container grid-cols-1 items-start gap-x-16 gap-y-12 px-6 py-[16vh] md:grid-cols-12 md:px-12 xl:px-20">
        <div className={cn("md:col-span-6", imageLeft ? "md:order-1" : "md:order-2")}>
          <Media data={data} className="aspect-[4/5] w-full md:aspect-[5/6]" />
        </div>
        <div className={cn("md:col-span-6", imageLeft ? "md:order-2" : "md:order-1")}>
          <Heading data={data} num={num} />
          <div className="mt-9 space-y-9">
            {imageLeft ? (
              <>
                <div data-sw-panel><SpecPanel data={data} /></div>
                <Block label="Key Benefits"><Ticks items={data.benefits.slice(0, 6)} /></Block>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Block label="Applications"><Chips items={data.applications} /></Block>
                  <Block label="Features"><Ticks items={data.overviewPoints.slice(0, 4)} /></Block>
                </div>
              </>
            ) : (
              <>
                <Block label="Key Benefits"><Ticks items={data.benefits.slice(0, 6)} /></Block>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Block label="Applications"><Chips items={data.applications} /></Block>
                  <Block label="Features"><Ticks items={data.overviewPoints.slice(0, 4)} /></Block>
                </div>
                <div data-sw-panel><SpecPanel data={data} /></div>
              </>
            )}
          </div>
          <div className="mt-10"><CTAs data={data} href={href} /></div>
        </div>
      </div>
    </section>
  );
}

/* Compact spec list used inside glass panels (variants 2 & 4). */
function SpecPanelInline({ data }: { data: ProductDetailData }) {
  return (
    <dl className="flex flex-col">
      {data.specs.map((row, i) => (
        <div key={row.label} className={cn("grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(120px,1fr)_1.6fr] sm:gap-6", i > 0 && "border-t border-neutral-200/70")}>
          <dt className="font-sans text-caption uppercase tracking-[0.18em] text-neutral-500">{row.label}</dt>
          <dd className="font-sans text-body text-neutral-900">{row.values.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}
