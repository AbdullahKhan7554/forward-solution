"use client";

import { useRef, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { IntroProvider, useIntro } from "@/components/providers/IntroProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { Navbar } from "@/components/navbar/Navbar";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Footer } from "@/components/layout/Footer";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";
import { BENEFIT_ICONS, applicationIcon, DocIcon } from "./icons";
import { ProductMedia } from "./ProductMedia";
import type { ProductDetailData } from "./products";
import { cn } from "@/lib/utils";

/** Image slot — LabPlate procedural art, or a drop-in placeholder when the
 *  product opts into `media: "placeholder"`. Same size/mask either way. */
function SlotImage({
  media,
  alt,
  label,
  sizes,
  src,
}: {
  media: ProductDetailData["media"];
  alt: string;
  label: string;
  sizes?: string;
  src?: string;
}) {
  if (media === "placeholder") {
    return <ProductMedia label={label} alt={alt} src={src} sizes={sizes} className="h-full w-full" />;
  }
  return <LabPlate src={src} alt={alt} />;
}

/**
 * PRODUCT DETAIL — the shared poultry product page.
 *
 * One data-driven template so every product (Compound Enzyme NSP, CorGest M,
 * Xylanase, …) reads as the same premium page. Reuses every primitive:
 * RevealText, MaskedReveal, LabPlate, GlassCard, the CTA choreography, the intro
 * shell (Preloader + Navbar + Footer) and all GSAP/motion tokens. No new design
 * language. Image slots are LabPlate — drop real photography in via `src`.
 */

/** Shared reveal: [data-fade] rises on enter, [data-rise] batches, [data-line] draws. */
function useReveal(ref: RefObject<HTMLElement>) {
  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-fade]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        })
        .to("[data-line]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.1)
        .to("[data-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.25);

      gsap.set("[data-rise]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-rise]", {
        start: "top 88%",
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
  }, [ref]);
}

/* ─── Section shell ─────────────────────────────────────────────────────── */
function Slate({ n, label }: { n: string; label: string }) {
  return (
    <div data-fade className="mb-8 flex items-center gap-4">
      <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">{n}</span>
      <span className="h-px w-10 bg-neutral-300" />
      <span className="font-serif text-small italic text-neutral-400">{label}</span>
    </div>
  );
}

/* ─── 01 · HERO ─────────────────────────────────────────────────────────── */
function Hero({ data }: { data: ProductDetailData }) {
  const { phase } = useIntro();
  const rootRef = useRef<HTMLElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !rootRef.current) return;
    const root = rootRef.current;
    gsap.set(root.querySelectorAll("[data-ph-fade]"), { autoAlpha: 0, y: 18 });
    const ctx = gsap.context(() => {
      gsap.to("[data-ph-parallax]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !rootRef.current) return;
    playedRef.current = true;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-ph-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
        stagger: 0.12,
      });
    }, root);
    return () => ctx.revert();
  }, [revealing]);

  return (
    <section ref={rootRef} aria-labelledby="pd-hero-heading" className="relative overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 22% 20%, rgba(234,242,247,0.6) 0%, rgba(255,255,255,0) 58%)",
        }}
      />
      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-container grid-cols-1 items-center gap-x-12 gap-y-12 px-6 pb-[12vh] pt-[22vh] md:grid-cols-12 md:px-12 md:pb-[10vh] xl:px-20">
        <div className="md:col-span-6 md:pr-6">
          <div data-ph-fade className="mb-7 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
            <span className="h-px w-10 bg-accent-500" />
            <a href="/products/poultry" className="transition-colors hover:text-primary-700">
              {data.eyebrow}
            </a>
          </div>

          <h1
            id="pd-hero-heading"
            className="font-display font-light leading-[1.02] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text={data.name}
              as="span"
              play={revealing}
              delay={0.5}
              stagger={0.05}
              className="justify-start text-[11vw] md:text-[5.4vw] xl:text-[74px]"
            />
          </h1>

          {data.subtitle && (
            <p data-ph-fade className="mt-5 max-w-[48ch] font-serif text-body-lg italic text-neutral-500">
              {data.subtitle}
            </p>
          )}

          <p data-ph-fade className="mt-6 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600">
            {data.intro}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              data-ph-fade
              href="/contact-us/"
              className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Talk To Our Experts
              <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <a
              data-ph-fade
              href="#downloads"
              className="inline-flex items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Download Resources
            </a>
          </div>
        </div>

        <div className="md:col-span-6">
          <MaskedReveal
            direction="up"
            trigger="mount"
            className="aspect-[4/5] w-full rounded-lg shadow-medium ring-1 ring-white/60"
          >
            <div data-ph-parallax className="h-[112%] w-full will-change-transform">
              <SlotImage
                media={data.media}
                label="Hero Product Image"
                alt={`${data.name} — Agriprom Pakistan poultry solution`}
                src={data.assets?.hero}
              />
            </div>
          </MaskedReveal>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-raised -translate-x-1/2">
        <ScrollCue />
      </div>
    </section>
  );
}

/* ─── 02 · OVERVIEW ─────────────────────────────────────────────────────── */
function Overview({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-labelledby="pd-overview-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(01)" label="Overview" />
        <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 md:grid-cols-12">
          {/* optional overview image — left */}
          {data.overviewImageLabel && (
            <div className="md:col-span-6">
              <MaskedReveal
                direction="up"
                className="aspect-[4/5] w-full rounded-lg shadow-medium ring-1 ring-white/60 md:aspect-[5/6]"
              >
                <SlotImage media={data.media} label={data.overviewImageLabel} alt={`${data.name} — overview`} src={data.assets?.overview} />
              </MaskedReveal>
            </div>
          )}

          {/* text */}
          <div className={data.overviewImageLabel ? "md:col-span-6" : "md:col-span-6"}>
            <h2
              id="pd-overview-heading"
              className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
            >
              <RevealText text="How It Helps" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8vw] md:text-[3.8vw] xl:text-[48px]" />
              <RevealText text="Your Flock" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8vw] text-primary-700 md:text-[3.8vw] xl:text-[48px]" />
            </h2>
            <p data-fade className="mt-8 text-pretty font-sans text-body-lg text-neutral-600">
              {data.overviewLead}
            </p>
            {/* image variant keeps the points beneath the copy in the same column */}
            {data.overviewImageLabel && (
              <ul className="mt-8">
                {data.overviewPoints.map((p, i) => (
                  <li
                    key={p}
                    data-rise
                    className="flex items-start gap-4 border-t border-neutral-200 py-4 first:border-t-0 first:pt-0"
                  >
                    <span className="mt-1 font-sans text-caption tracking-[0.2em] text-neutral-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-body text-neutral-700">{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* no-image fallback keeps the original two-column split */}
          {!data.overviewImageLabel && (
            <ul className="md:col-span-5 md:col-start-8">
              {data.overviewPoints.map((p, i) => (
                <li
                  key={p}
                  data-rise
                  className="flex items-start gap-4 border-t border-neutral-200 py-5 first:border-t-0 first:pt-0"
                >
                  <span className="mt-1 font-sans text-caption tracking-[0.2em] text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-body text-neutral-700">{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── 03 · BENEFITS ─────────────────────────────────────────────────────── */
function Benefits({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-labelledby="pd-benefits-heading" className="relative overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 45% at 80% 4%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)" }}
      />
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(02)" label="Benefits" />
        <h2 id="pd-benefits-heading" className="max-w-3xl font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Proven Benefits" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="on the Farm" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <ul className="mt-[10vh] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {data.benefits.map((b, i) => {
            const IconCmp = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <li key={b} data-rise>
                <GlassCard className="relative h-full overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
                    style={{ background: "radial-gradient(closest-side, rgba(0,138,75,0.35), rgba(0,138,75,0))" }}
                  />
                  <div className="relative flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-300 ease-brand-out group-hover:text-accent-600">
                      <IconCmp />
                    </span>
                    <h3 className="mt-2 font-display text-h4 font-medium leading-[1.15] text-neutral-900">{b}</h3>
                  </div>
                </GlassCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─── 04 · HOW IT WORKS (animated flow) ─────────────────────────────────── */
function HowItWorks({ data }: { data: ProductDetailData }) {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      // the flow line draws as you descend
      gsap.set("[data-flow-fill]", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.to("[data-flow-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 78%", end: "bottom 82%", scrub: true },
      });

      // each step settles + its arrow follows
      gsap.set("[data-flow-step]", { autoAlpha: 0, y: 24, scale: 0.97 });
      ScrollTrigger.batch("[data-flow-step]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
      gsap.set("[data-flow-arrow]", { autoAlpha: 0 });
      ScrollTrigger.batch("[data-flow-arrow]", {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, duration: 0.5, ease: "power2.out", stagger: 0.12, overwrite: true }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="pd-how-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <div data-fade className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">(03) — How It Works</span>
            <span className="h-px w-10 bg-accent-500" />
          </div>
          <h2 id="pd-how-heading" className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-900">
            <RevealText text="From Feed" as="span" trigger="scroll" stagger={0.05} className="justify-center text-[8.5vw] md:text-[4.2vw] xl:text-[54px]" />
            <RevealText text="to Performance" as="span" trigger="scroll" stagger={0.05} className="justify-center text-[8.5vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
          </h2>
        </div>

        <div ref={listRef} className="relative mx-auto mt-[12vh] flex max-w-xl flex-col items-center">
          {/* central drawing line */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-neutral-200" />
            <div
              data-flow-fill
              className="absolute inset-0 will-change-transform"
              style={{ background: "linear-gradient(to bottom, #008A4B 0%, #0064C1 60%, #0064C1 100%)" }}
            />
          </div>

          {data.flow.map((step, i) => (
            <div key={step} className="relative flex w-full flex-col items-center">
              <div data-flow-step className="relative z-raised w-full max-w-sm">
                <div className="flex items-center gap-4 rounded-lg border border-white/70 bg-white/60 px-6 py-4 shadow-glass backdrop-blur-xl backdrop-saturate-150">
                  <span className="font-sans text-caption tracking-[0.2em] text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-h4 font-medium text-neutral-900">{step}</span>
                </div>
              </div>
              {i < data.flow.length - 1 && (
                <span data-flow-arrow aria-hidden="true" className="relative z-raised my-5 text-primary-600">
                  <svg width="16" height="26" viewBox="0 0 16 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 1v20M2 15l6 6 6-6" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 05 · APPLICATIONS ─────────────────────────────────────────────────── */
function Applications({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-labelledby="pd-apps-heading" className="relative overflow-hidden bg-base">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(04)" label="Applications" />
        <h2 id="pd-apps-heading" className="max-w-3xl font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Suitable For" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <ul className="mt-[8vh] grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {data.applications.map((a) => (
            <li key={a} data-rise>
              <GlassCard className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft">
                  {applicationIcon(a)}
                </span>
                <h3 className="font-display text-h4 font-medium text-neutral-900">{a}</h3>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── 06 · TECHNICAL HIGHLIGHTS (spec table) ────────────────────────────── */
function TechnicalHighlights({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-labelledby="pd-tech-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(05)" label="Technical Highlights" />
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-12">
          <h2 id="pd-tech-heading" className="md:col-span-4 font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText text="Specifications" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8vw] md:text-[3.2vw] xl:text-[40px]" />
          </h2>

          <div data-fade className="md:col-span-8">
            <dl className="overflow-hidden rounded-lg border border-white/70 bg-white/55 shadow-glass backdrop-blur-xl backdrop-saturate-150">
              {data.specs.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-1 gap-2 px-7 py-6 sm:grid-cols-[minmax(160px,1fr)_2fr] sm:gap-8",
                    i > 0 && "border-t border-neutral-200/70"
                  )}
                >
                  <dt className="font-sans text-caption uppercase tracking-[0.2em] text-neutral-500">
                    {row.label}
                  </dt>
                  <dd>
                    {row.values.length > 1 ? (
                      <ul className="flex flex-wrap gap-2">
                        {row.values.map((v) => (
                          <li
                            key={v}
                            className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-sans text-small text-neutral-700"
                          >
                            {v}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="font-display text-body-lg text-neutral-900">{row.values[0]}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 07 · GALLERY ──────────────────────────────────────────────────────── */
const DEFAULT_GALLERY = ["Product", "Packaging", "Application"];
function Gallery({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const gallery = data.gallery ?? DEFAULT_GALLERY;
  return (
    <section ref={ref} aria-labelledby="pd-gallery-heading" className="relative overflow-hidden bg-base">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(06)" label="Gallery" />
        <h2 id="pd-gallery-heading" className="sr-only">
          {data.name} gallery
        </h2>
        <ul
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8",
            gallery.length === 4 ? "lg:grid-cols-4" : "md:grid-cols-3"
          )}
        >
          {gallery.map((label, i) => (
            <li key={label} data-rise className="group">
              <MaskedReveal className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-medium ring-1 ring-white/60">
                <div className="h-full w-full transition-transform duration-300 ease-brand-out group-hover:scale-[1.04]">
                  <SlotImage
                    media={data.media}
                    label={label}
                    alt={`${data.name} — ${label}`}
                    sizes="(max-width: 768px) 100vw, 25vw"
                    src={data.assets?.gallery?.[i]}
                  />
                </div>
              </MaskedReveal>
              <p className="mt-4 font-sans text-caption uppercase tracking-[0.24em] text-neutral-500">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── 08 · DOWNLOADS ────────────────────────────────────────────────────── */
const DOWNLOADS = ["Product Brochure", "Technical Sheet", "MSDS"] as const;
function Downloads({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="downloads" ref={ref} aria-labelledby="pd-dl-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(07)" label="Downloads" />
        <h2 id="pd-dl-heading" className="max-w-3xl font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Documentation" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <ul className="mt-[8vh] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {(data.downloads ?? DOWNLOADS).map((doc) => (
            <li key={doc} data-rise>
              <a
                href="#"
                aria-label={`Download ${data.name} ${doc} (PDF)`}
                className="group block h-full focus:outline-none"
              >
                <GlassCard className="flex h-full items-center justify-between gap-6">
                  <span className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-200 ease-brand-out group-hover:text-accent-600">
                      <DocIcon />
                    </span>
                    <span>
                      <span className="block font-display text-h4 font-medium text-neutral-900">{doc}</span>
                      <span className="mt-0.5 block font-sans text-caption uppercase tracking-[0.2em] text-neutral-400">PDF</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-primary-600 transition-transform duration-200 ease-brand-out group-hover:translate-y-0.5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v13M7 12l5 5 5-5M5 21h14" />
                    </svg>
                  </span>
                </GlassCard>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── 09 · RELATED PRODUCTS ─────────────────────────────────────────────── */
function RelatedProducts({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const related = data.related ?? [];
  if (related.length === 0) return null;
  return (
    <section ref={ref} aria-labelledby="pd-related-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <Slate n="(08)" label="Related Products" />
        <h2 id="pd-related-heading" className="max-w-3xl font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
          <RevealText text="More Poultry" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="Solutions" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[8.5vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <ul className="mt-[10vh] grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <li key={r.href} data-rise>
              <a
                href={r.href}
                aria-label={`${r.name} — view product`}
                className="group block h-full rounded-lg p-3 transition-[transform,background-color,box-shadow] duration-200 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:bg-white/55 hover:shadow-floating hover:backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <MaskedReveal className="aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-white/50">
                  <div className="h-full w-full transition-transform duration-300 ease-brand-out group-hover:scale-[1.05]">
                    <SlotImage media={data.media} label={r.name} alt={`${r.name} — Agriprom Pakistan`} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                </MaskedReveal>
                <div className="mt-5 flex items-start justify-between gap-4 px-1">
                  <div>
                    <h3 className="font-display text-h4 font-medium tracking-[-0.01em] text-neutral-900">{r.name}</h3>
                    <p className="mt-1.5 max-w-[34ch] text-pretty font-sans text-small text-neutral-500">{r.blurb}</p>
                  </div>
                  <span aria-hidden="true" className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-primary-700 transition-colors duration-200 ease-brand-out group-hover:border-primary-500 group-hover:bg-primary-600 group-hover:text-pure">
                    <svg width="22" height="10" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 6h27M22 1l6 5-6 5" />
                    </svg>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── 10 · CTA ──────────────────────────────────────────────────────────── */
function ExpertsCTA({ data }: { data: ProductDetailData }) {
  const ref = useRef<HTMLElement>(null);
  useCTAChoreography(ref);
  return (
    <section ref={ref} aria-labelledby="pd-cta-heading" className="relative overflow-hidden bg-base">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)" }}
      />
      <div className="relative mx-auto flex min-h-[72svh] w-full max-w-container flex-col items-center justify-center px-6 py-[18vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[760px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">Technical Support</span>
          </div>
          <h2 id="pd-cta-heading" className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText text={data.cta?.top ?? "Talk To Our"} as="span" trigger="scroll" stagger={0.05} className="justify-center text-[9vw] md:text-[5vw] xl:text-[64px]" />
            <RevealText text={data.cta?.bottom ?? "Experts"} as="span" trigger="scroll" stagger={0.05} className="justify-center text-[9vw] text-primary-700 md:text-[5vw] xl:text-[64px]" />
          </h2>
          <p data-cta-fade className="mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600">
            {data.cta?.body ?? `Get tailored recommendations for ${data.name} built around your birds, your feed and your goals.`}
          </p>
          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              data-cta-fade
              href="/contact-us/"
              className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
            >
              {data.cta?.primaryLabel ?? "Talk To Our Experts"}
            </a>
            {data.cta?.secondaryLabel && (
              <a
                data-cta-fade
                href={data.cta.secondaryHref ?? "/products/poultry"}
                className="inline-flex w-full items-center justify-center rounded-sm border border-neutral-300 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-primary-50 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
              >
                {data.cta.secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDetail({ data }: { data: ProductDetailData }) {
  return (
    <IntroProvider>
      <Preloader caption={`N°01 — ${data.name}`} ariaLabel={`Entering Agriprom Pakistan — ${data.name}`} />
      <Navbar />
      <main>
        <Hero data={data} />
        <Overview data={data} />
        <Benefits data={data} />
        <HowItWorks data={data} />
        <Applications data={data} />
        <TechnicalHighlights data={data} />
        <Gallery data={data} />
        <Downloads data={data} />
        <RelatedProducts data={data} />
        <ExpertsCTA data={data} />
      </main>
      <Footer />
    </IntroProvider>
  );
}
