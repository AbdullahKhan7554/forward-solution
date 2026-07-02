"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { searchAll, type SearchItem } from "@/lib/search";

/**
 * SEARCH RESULTS — the dedicated /search experience.
 *
 * Premium editorial: a large heading, a glass search input synced to the ?q=
 * param, group filters (reusing BlogFilters), a sort control (Relevance / Newest
 * / Alphabetical), a results grid of reused GlassCards, animated pagination and
 * an elegant empty state. Reduced motion: static, fully functional.
 */

const FILTERS = ["All", "Products", "Blogs", "Services", "Pages"] as const;
const SORTS = ["Relevance", "Newest", "Alphabetical"] as const;
type Sort = (typeof SORTS)[number];
const PAGE_SIZE = 9;

function sortItems(items: SearchItem[], sort: Sort): SearchItem[] {
  if (sort === "Alphabetical") {
    return [...items].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sort === "Newest") {
    return [...items].sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : NaN;
      const db = b.date ? Date.parse(b.date) : NaN;
      if (isNaN(da) && isNaN(db)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db)) return -1;
      return db - da;
    });
  }
  return items; // Relevance — already ranked
}

function ResultCard({ item }: { item: SearchItem }) {
  return (
    <a
      data-result-card
      href={item.href}
      aria-label={`${item.title} — ${item.group}`}
      className="group block h-full outline-none focus-visible:-translate-y-1 focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-accent-500"
    >
      <GlassCard label={item.group} className="flex h-full flex-col">
        <h3 className="font-display text-h4 font-light leading-[1.15] tracking-[-0.01em] text-neutral-900">
          {item.title}
        </h3>
        {item.category && (
          <span className="mt-3 inline-flex w-fit rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            {item.category}
          </span>
        )}
        {item.description && (
          <p className="mt-4 text-pretty font-sans text-small leading-[1.6] text-neutral-600">
            {item.description}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-sans text-small font-medium text-primary-700">
          View
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1.5"
          >
            <svg width="20" height="9" viewBox="0 0 24 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 5h21M17 1l5 4-5 4" />
            </svg>
          </span>
        </span>
      </GlassCard>
    </a>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true" className="text-primary-600/30">
        <circle cx="42" cy="42" r="26" stroke="currentColor" strokeWidth="2" strokeDasharray="4 7" />
        <path d="M61 61 79 79" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 42h16M42 34v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-500/50" />
      </svg>
      <h3 className="mt-8 font-display text-h3 font-light text-neutral-900">
        Nothing found{query ? " for that" : ""}
      </h3>
      <p className="mt-4 max-w-[44ch] font-sans text-body-lg text-neutral-500">
        {query
          ? "We couldn't match your search. Try a product name, a category, or a topic like “mycotoxins” or “enzymes”."
          : "Start typing to search products, blogs, services and pages."}
      </p>
    </div>
  );
}

export function SearchResultsView() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ);
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("Relevance");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // debounce the query + reflect it in the URL (shareable, no history spam)
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(query);
      const next = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
      router.replace(next, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [query, router]);

  const all = useMemo(() => searchAll(debounced), [debounced]);
  const filtered = useMemo(
    () => (filter === "All" ? all : all.filter((i) => i.group === filter)),
    [all, filter]
  );
  const sorted = useMemo(() => sortItems(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // reset to page 1 whenever the result set changes
  useEffect(() => {
    setPage(1);
  }, [debounced, filter, sort]);

  // animate the visible cards on any change (animated pagination)
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const cards = grid.querySelectorAll("[data-result-card]");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, overwrite: true }
    );
  }, [pageItems]);

  const goToPage = (p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden bg-base">
      {/* blueprint grid @ ~2% + soft gradient */}
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
            "radial-gradient(60% 40% at 78% 2%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 56%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 pb-[16vh] pt-[20vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Search
            </span>
          </div>
          <h1 className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text="Find What You Need"
              as="span"
              trigger="mount"
              stagger={0.06}
              className="justify-start text-[10vw] md:text-[5.4vw] xl:text-[66px]"
            />
          </h1>
        </header>

        {/* SEARCH INPUT */}
        <div className="mt-12 max-w-2xl">
          <div className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/60 px-6 py-5 shadow-glass backdrop-blur-xl backdrop-saturate-150">
            <span aria-hidden="true" className="text-neutral-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, blogs or services..."
              aria-label="Search"
              className="w-full bg-transparent font-sans text-body-lg text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-neutral-400 transition-colors duration-200 ease-brand-out hover:text-neutral-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* CONTROLS — filters + sort + count */}
        <div className="mt-12 flex flex-col gap-6 border-b border-neutral-200/70 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <BlogFilters filters={FILTERS} active={filter} onSelect={setFilter} />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-caption uppercase tracking-[0.16em] text-neutral-400 sm:inline">
              {sorted.length} result{sorted.length === 1 ? "" : "s"}
            </span>
            <label className="flex items-center gap-2.5">
              <span className="font-sans text-caption uppercase tracking-[0.16em] text-neutral-400">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Sort results"
                className="rounded-full border border-neutral-200 bg-white/70 py-2 pl-4 pr-9 font-sans text-small font-medium text-neutral-700 shadow-glass outline-none backdrop-blur-xl transition-colors duration-200 ease-brand-out focus-visible:ring-2 focus-visible:ring-accent-500"
                style={{
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7A82' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* RESULTS */}
        {sorted.length === 0 ? (
          <EmptyState query={debounced} />
        ) : (
          <>
            <div
              ref={gridRef}
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                aria-label="Search results pages"
                className="mt-[9vh] flex items-center justify-center gap-2"
              >
                <PageButton
                  ariaLabel="Previous page"
                  disabled={safePage === 1}
                  onClick={() => goToPage(safePage - 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </PageButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PageButton key={p} active={p === safePage} onClick={() => goToPage(p)} ariaLabel={`Page ${p}`}>
                    {p}
                  </PageButton>
                ))}

                <PageButton
                  ariaLabel="Next page"
                  disabled={safePage === totalPages}
                  onClick={() => goToPage(safePage + 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </PageButton>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-11 min-w-[44px] items-center justify-center rounded-full px-3 font-sans text-small font-medium outline-none transition-all duration-300 ease-brand-out focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed disabled:opacity-35",
        active
          ? "bg-primary-600 text-pure shadow-soft"
          : "border border-white/60 bg-white/55 text-neutral-600 shadow-glass backdrop-blur-xl hover:-translate-y-px hover:border-accent-300/60 hover:text-primary-700"
      )}
    >
      {children}
    </button>
  );
}
