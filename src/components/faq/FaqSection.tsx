"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";
import type { FaqCategory } from "./faqData";

/**
 * FAQ · SECTIONS 03–07 — a reusable accordion section.
 *
 * Premium glass accordion cards: the body height animates open/closed with GSAP,
 * the content fades, the chevron rotates — premium easing, GPU-friendly. One
 * open at a time. Fully keyboard accessible + ARIA (button ⇄ region), 48px touch
 * targets. Reduced motion: instant toggle, no animation.
 */

function AccordionItem({
  item,
  open,
  onToggle,
  id,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const chevRef = useRef<HTMLSpanElement>(null);
  const firstRun = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const body = bodyRef.current;
    const chev = chevRef.current;
    if (!body) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || firstRun.current) {
      gsap.set(body, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
      if (chev) gsap.set(chev, { rotate: open ? 180 : 0 });
      firstRun.current = false;
      return;
    }
    gsap.to(body, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0, duration: 0.5, ease: "power3.inOut" });
    if (chev) gsap.to(chev, { rotate: open ? 180 : 0, duration: 0.4, ease: "power3.inOut" });
  }, [open]);

  return (
    <div
      data-faq-card
      className={cn(
        "overflow-hidden rounded-2xl border bg-white/70 shadow-soft backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,border-color] duration-200 ease-brand-out",
        open ? "border-accent-300/40 shadow-medium" : "border-secondary-500/15 hover:shadow-medium"
      )}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          id={`${id}-btn`}
          className="flex min-h-[48px] w-full items-center justify-between gap-6 px-6 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-500 md:px-8"
        >
          <span className="font-display text-h4 font-light tracking-[-0.01em] text-neutral-900 md:text-[22px]">
            {item.q}
          </span>
          <span
            ref={chevRef}
            aria-hidden="true"
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-brand-out",
              open ? "border-accent-300/50 text-accent-600" : "border-neutral-200 text-primary-700"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={`${id}-body`} role="region" aria-labelledby={`${id}-btn`} ref={bodyRef} className="h-0 overflow-hidden">
        <p className="max-w-[68ch] px-6 pb-6 font-sans text-body-lg leading-[1.7] text-neutral-600 md:px-8">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export function FaqSection({
  category,
  index,
  bg = "base",
}: {
  category: FaqCategory;
  index: number;
  bg?: "base" | "pure";
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-faq-head]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-faq-head]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      gsap.set("[data-faq-card]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-faq-card]", {
        start: "top 90%",
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  return (
    <section
      id={category.id}
      ref={rootRef}
      aria-labelledby={`${category.id}-heading`}
      className={cn("relative scroll-mt-24 overflow-hidden", bg === "pure" ? "bg-pure" : "bg-base")}
    >
      <div className="relative mx-auto w-full max-w-4xl px-6 py-[13vh] md:px-8">
        <header className="mb-[7vh]">
          <div data-faq-head className="mb-6 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">
              {String(index).padStart(2, "0")}
            </span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">{category.slate}</span>
          </div>
          <div data-faq-head className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              {category.eyebrow}
            </span>
          </div>
          <h2 id={`${category.id}-heading`} className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text={category.heading}
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-start text-[8vw] md:text-[4vw] xl:text-[48px]"
            />
          </h2>
        </header>

        <div className="flex flex-col gap-4">
          {category.items.map((item, i) => (
            <AccordionItem
              key={item.q}
              id={`${category.id}-${i}`}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
