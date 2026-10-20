"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * GlobalSearch — the navbar search trigger. Redirects to the dedicated /search
 * page (a real link, so it works without JS and is prefetchable). ⌘K / Ctrl K
 * routes to the same page.
 *
 *   Desktop: a glass pill with label.
 *   Mobile:  the search icon.
 */
export function GlobalSearch() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <Link
      href="/search"
      aria-label="Search"
      aria-keyshortcuts="Control+K Meta+K"
      className="group flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-2 backdrop-blur-md transition-colors duration-[360ms] ease-brand-out hover:bg-white/20 lg:px-4"
    >
      <span aria-hidden="true" className="text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <span className="hidden font-sans text-small font-medium text-white lg:inline">
        Search
      </span>
    </Link>
  );
}
