"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: ReactNode[];
};

/**
 * LegalPage — a luxury editorial legal document (Privacy, Terms).
 *
 * A soft-white cinematic hero, a fixed reading-progress indicator, a sticky
 * glass table-of-contents that tracks the active section, smooth anchor
 * navigation (Lenis) and elegant fade-in sections at a generous reading width.
 * Reduced motion: everything static; the progress bar and TOC still work.
 */
export function LegalPage({
  eyebrow = "Legal",
  title,
  subheading,
  updated,
  sections,
}: {
  eyebrow?: string;
  title: string;
  subheading: string;
  updated?: string;
  sections: LegalSection[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  // reading progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active section tracking
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-24% 0px -68% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  // section fade reveals
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-legal-fade]", { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch("[data-legal-fade]", {
        start: "top 86%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const navTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -120 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    if (typeof history !== "undefined") history.replaceState(null, "", `#${id}`);
  };

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-pure">
      {/* reading progress indicator */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[120] h-[3px] bg-transparent"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-primary-600 to-accent-500 transition-[width] duration-150 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* subtle scientific texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 40% at 80% 2%, rgba(219,239,231,0.3) 0%, rgba(255,255,255,0) 56%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 md:px-12 xl:px-20">
        {/* HERO */}
        <header className="max-w-3xl pb-[7vh] pt-[20vh]">
          <div data-legal-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              {eyebrow}
            </span>
          </div>
          <h1 className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text={title}
              as="span"
              trigger="mount"
              stagger={0.06}
              className="justify-start text-[11vw] md:text-[6vw] xl:text-[76px]"
            />
          </h1>
          <p
            data-legal-fade
            className="mt-8 max-w-[52ch] text-pretty font-serif text-[1.35rem] font-light leading-[1.5] text-neutral-700 md:text-[1.5rem]"
          >
            {subheading}
          </p>
          {updated && (
            <p data-legal-fade className="mt-8 font-sans text-caption uppercase tracking-[0.18em] text-neutral-400">
              Last updated · {updated}
            </p>
          )}
          <div data-legal-fade className="mt-10 h-px w-full bg-neutral-200" />
        </header>

        {/* BODY */}
        <div className="grid grid-cols-1 gap-x-16 pb-[18vh] lg:grid-cols-12">
          {/* sticky glass TOC (desktop) */}
          <aside className="hidden lg:col-span-4 lg:block xl:col-span-3">
            <nav
              aria-label="On this page"
              className="sticky top-[16vh] rounded-2xl border border-white/70 bg-white/60 p-6 shadow-glass backdrop-blur-xl backdrop-saturate-150"
            >
              <span className="mb-4 block font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
                On This Page
              </span>
              <ul className="space-y-1">
                {sections.map((s) => {
                  const isActive = s.id === active;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={navTo(s.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "group flex items-start gap-3 rounded-lg px-3 py-2 font-sans text-small outline-none transition-colors duration-200 ease-brand-out focus-visible:ring-2 focus-visible:ring-accent-500",
                          isActive ? "bg-primary-50/70 text-primary-700" : "text-neutral-500 hover:text-neutral-900"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ease-brand-out",
                            isActive ? "bg-accent-500" : "bg-neutral-300 group-hover:bg-neutral-400"
                          )}
                        />
                        <span className="leading-snug">{s.heading}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* content */}
          <div className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
            <div className="max-w-[68ch]">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className={cn("scroll-mt-[120px]", i > 0 && "mt-16 md:mt-20")}
                >
                  <div data-legal-fade className="mb-6 flex items-baseline gap-4">
                    <span className="font-sans text-caption tracking-[0.18em] text-neutral-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-h3 font-light tracking-[-0.01em] text-neutral-900 md:text-[32px]">
                      {s.heading}
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {s.paragraphs.map((p, j) => (
                      <p
                        key={j}
                        data-legal-fade
                        className="text-pretty font-sans text-body-lg leading-[1.75] text-neutral-600"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
