"use client";

import { cn } from "@/lib/utils";

/**
 * BLOG · SCENE 03 — THE FILTERS.
 *
 * Premium glass filter pills. Presentational and controlled — the ArticlesGrid
 * owns the active state and passes it down, so the filter row and the grid stay
 * in one interactive boundary. On mobile the row scrolls horizontally (scrollbar
 * hidden); on desktop it centres and wraps. Inactive pills glow softly on hover;
 * the active pill fills with brand blue. The fade-in is handled by the grid's
 * choreography via the shared [data-blog-fade] hook.
 */
export function BlogFilters({
  filters,
  active,
  onSelect,
}: {
  filters: readonly string[];
  active: string;
  onSelect: (filter: string) => void;
}) {
  return (
    <div
      data-blog-fade
      role="tablist"
      aria-label="Filter articles by category"
      className={cn(
        "flex gap-3 overflow-x-auto pb-1",
        "md:flex-wrap md:justify-center md:overflow-visible",
        // hide the scrollbar on the mobile horizontal scroll
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      {filters.map((filter) => {
        const isActive = filter === active;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(filter)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 font-sans text-small font-medium outline-none transition-all duration-300 ease-brand-out focus-visible:ring-2 focus-visible:ring-accent-500",
              isActive
                ? "border-primary-600 bg-primary-600 text-pure shadow-soft"
                : "border-white/60 bg-white/55 text-neutral-600 shadow-glass backdrop-blur-xl backdrop-saturate-150 hover:-translate-y-px hover:border-accent-300/60 hover:text-primary-700 hover:shadow-[0_6px_24px_-6px_rgba(0,138,75,0.35)]"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
