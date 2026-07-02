"use client";

import { useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { BlogCard } from "@/components/scenes/SceneInsights/BlogCard";
import { articles, ARTICLE_FILTERS } from "@/components/info-center/articles";
import { BlogFilters } from "./BlogFilters";

const PAGE_SIZE = 6;

/**
 * BLOG · SCENE 04 — ALL ARTICLES.
 *
 * The full, data-driven library. Owns the shared interactive state (active
 * filter + how many are visible) and renders the Scene-03 BlogFilters at its
 * head, so filtering and pagination live in one client boundary. Cards are the
 * existing BlogCard — 3 columns on desktop, 2 on tablet, 1 on mobile — with the
 * established hover grammar (image zoom, lift, shadow, glass metadata). Fresh
 * cards fade+rise exactly once (marked [data-shown]); Load More reveals the next
 * page. Reduced motion: everything visible and static.
 */
export function ArticlesGrid() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const reducedRef = useRef(false);

  const [active, setActive] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (active === "All" ? articles : articles.filter((a) => a.filter === active)),
    [active]
  );
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const selectFilter = (filter: string) => {
    if (filter === active) return;
    setActive(filter);
    setVisible(PAGE_SIZE);
  };

  // Header + filter fade — once, on scroll into view.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-blog-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-blog-fade]", {
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

      // Gate the very first card reveal until the grid is in view.
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          inViewRef.current = true;
          revealFreshCards();
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // Animate any card that hasn't been shown yet (initial reveal, Load More, or a
  // filter switch that mounts fresh nodes). Each card animates exactly once.
  const revealFreshCards = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const fresh = grid.querySelectorAll<HTMLElement>("[data-grid-card]:not([data-shown])");
    if (!fresh.length) return;
    fresh.forEach((el) => el.setAttribute("data-shown", "true"));
    if (reducedRef.current) return;
    gsap.fromTo(
      fresh,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }
    );
    ScrollTrigger.refresh();
  };

  // Reveal fresh cards whenever the visible set changes (after in view).
  useIsomorphicLayoutEffect(() => {
    if (!inViewRef.current) return;
    revealFreshCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, visible]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="all-articles-heading"
      className="relative overflow-hidden bg-base"
    >
      {/* blueprint grid @ ~2% + soft luminous gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
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
            "radial-gradient(66% 44% at 22% 4%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 pb-[20vh] pt-[14vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="mx-auto max-w-3xl text-center">
          <div data-blog-fade className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              All Articles
            </span>
          </div>
          <h2
            id="all-articles-heading"
            className="font-display font-light leading-[1.06] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Explore the Knowledge Library"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8vw] md:text-[3.6vw] xl:text-[46px]"
            />
          </h2>
        </header>

        {/* FILTERS */}
        <div className="mt-12">
          <BlogFilters filters={ARTICLE_FILTERS} active={active} onSelect={selectFilter} />
        </div>

        {/* GRID — 3 / 2 / 1 */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((post) => (
            <div key={post.slug} data-grid-card>
              <BlogCard post={post} variant="secondary" />
            </div>
          ))}
        </div>

        {/* empty state (a filter with no articles yet) */}
        {shown.length === 0 && (
          <p className="mt-14 text-center font-sans text-body text-neutral-500">
            New articles in this category are on the way.
          </p>
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-[9vh] flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="group inline-flex items-center gap-3 rounded-sm border border-primary-600/30 bg-white/60 px-8 py-4 font-sans text-body font-medium text-primary-700 shadow-soft outline-none backdrop-blur-xl transition-colors duration-200 ease-brand-out hover:border-primary-600/60 hover:bg-white focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Load More Articles
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-y-0.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3v10M3 8l5 5 5-5" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
