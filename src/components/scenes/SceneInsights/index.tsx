"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RevealText } from "@/components/primitives/RevealText";
import type { BlogPost } from "@/components/info-center/types";
import { useInsightsChoreography } from "./useInsightsChoreography";

/** Cards visible per breakpoint - matches basis-full / md:basis-1/2 / lg:basis-1/3. */
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return count;
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** `blogPosts` — the latest published posts (newest first). */
export function SceneInsights({ blogPosts }: { blogPosts: BlogPost[] }) {
  const rootRef = useRef<HTMLElement>(null);
  useInsightsChoreography(rootRef);

  const visible = useVisibleCount();
  const maxIndex = Math.max(0, blogPosts.length - visible);
  const [index, setIndex] = useState(0);
  const current = Math.min(index, maxIndex);
  const touchX = useRef<number | null>(null);

  const go = (step: number) => setIndex(Math.max(0, Math.min(maxIndex, current + step)));

  return (
    <section
      ref={rootRef}
      aria-labelledby="insights-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* blueprint grid @ ~2% + soft luminous gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 78% 8%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-insights-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
              Insights &amp; Knowledge
            </span>
          </div>

          <h2
            id="insights-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Latest Articles &"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Industry Insights"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-insights-fade
            className="mt-8 max-w-[58ch] text-pretty font-sans text-body-lg text-neutral-900"
          >
            Stay updated with expert perspectives, animal nutrition research, poultry
            management strategies and the latest developments shaping modern livestock
            health.
          </p>
        </header>

        {/* ARTICLE SLIDER - one card per step */}
        <div className="relative mt-[12vh]">
          <div
            className="-mx-3 overflow-hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <ul
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${(current * 100) / visible}%)` }}
            >
              {blogPosts.map((post) => (
                <li key={post.title} className="shrink-0 basis-full list-none px-3 md:basis-1/2 lg:basis-1/3">
                  <a
                    href={post.href}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft outline-none transition-shadow duration-150 hover:shadow-floating focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                      {post.image && (
                        <Image
                          src={post.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-h4 font-medium text-neutral-900">{post.title}</h3>
                      <p className="mt-3 text-pretty font-sans text-body text-neutral-900">{post.excerpt}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {current > 0 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous articles"
              className="absolute left-0 top-28 z-raised flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-500 text-white shadow-soft transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <Arrow dir="prev" />
            </button>
          )}
          {current < maxIndex && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next articles"
              className="absolute right-0 top-28 z-raised flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-neutral-500 text-white shadow-soft transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <Arrow dir="next" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div data-insights-fade className="mt-[16vh] flex flex-col items-center text-center">
          <span className="mb-14 block h-px w-full max-w-3xl bg-neutral-200" />
          <h3 className="font-display text-h3 font-light tracking-[-0.01em] text-neutral-900 md:text-[36px]">
            Want More Industry Insights?
          </h3>
          <p className="mt-4 max-w-[46ch] font-sans text-body-lg text-neutral-900">
            Explore our growing knowledge library.
          </p>
          <a
            href="/blog"
            className="group mt-9 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-colors duration-200 ease-brand-out hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            View All Articles
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
