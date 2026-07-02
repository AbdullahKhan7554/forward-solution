"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * CONTACT · SCENE 06 — FAQ.
 *
 * A minimal luxury accordion — hairline dividers, no heavy borders, generous
 * whitespace. One panel open at a time; the body height animates open/closed
 * with GSAP; the marker rotates. Reduced motion: instant toggle, no animation.
 */

const FAQS = [
  {
    q: "How can I become a distributor?",
    a: "We partner with distributors across Pakistan. Share your details through the form above or call us directly, and our commercial team will guide you through the process and product portfolio.",
  },
  {
    q: "How quickly do you respond?",
    a: "Our team is available around the clock. Messages are typically answered the same day, and urgent enquiries by phone are handled immediately.",
  },
  {
    q: "Do you offer nationwide supply?",
    a: "Yes. From our Lahore base we supply veterinarians, producers and distributors across Pakistan, coordinating logistics to reach you wherever you operate.",
  },
  {
    q: "Can I request product information?",
    a: "Absolutely. Tell us which range you're interested in — Veterinary Pharmaceuticals, Feed Additives or Animal Nutrition — and we'll send detailed technical documentation.",
  },
];

function AccordionItem({
  item,
  open,
  onToggle,
  index,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const firstRun = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const body = bodyRef.current;
    const mark = markRef.current;
    if (!body) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || firstRun.current) {
      gsap.set(body, { height: open ? "auto" : 0, autoAlpha: open ? 1 : 0 });
      if (mark) gsap.set(mark, { rotate: open ? 45 : 0 });
      firstRun.current = false;
      return;
    }

    gsap.to(body, {
      height: open ? "auto" : 0,
      autoAlpha: open ? 1 : 0,
      duration: 0.5,
      ease: "power3.inOut",
    });
    if (mark) gsap.to(mark, { rotate: open ? 45 : 0, duration: 0.4, ease: "power3.inOut" });
  }, [open]);

  return (
    <div data-faq-row className="border-t border-neutral-200/80">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-body-${index}`}
          className="group flex w-full items-center justify-between gap-8 py-8 text-left outline-none"
        >
          <span className="font-display text-h4 font-light tracking-[-0.01em] text-neutral-900 transition-colors duration-200 ease-brand-out group-hover:text-primary-700 md:text-[26px]">
            {item.q}
          </span>
          <span
            ref={markRef}
            aria-hidden="true"
            className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center text-primary-600"
          >
            <span className="absolute h-px w-4 bg-current" />
            <span className="absolute h-4 w-px bg-current" />
          </span>
        </button>
      </h3>
      <div
        id={`faq-body-${index}`}
        ref={bodyRef}
        className="h-0 overflow-hidden"
      >
        <p className="max-w-[64ch] pb-9 pr-10 font-sans text-body-lg leading-[1.7] text-neutral-600">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export function ContactFAQ() {
  const rootRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-faq-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-faq-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      gsap.set("[data-faq-row]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-faq-row]", {
        start: "top 90%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
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
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div className="relative mx-auto w-full max-w-4xl px-6 py-[16vh] md:px-8">
        <header className="mb-[9vh] text-center">
          <div data-faq-fade className="mb-8 flex items-center justify-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(06)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">Answered</span>
          </div>
          <h2
            id="faq-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Questions, Answered"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-center text-[8.5vw] md:text-[4.4vw] xl:text-[54px]"
            />
          </h2>
        </header>

        <div className="border-b border-neutral-200/80">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={item.q}
              item={item}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
