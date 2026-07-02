"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * GlobalSearch — the navbar search trigger. Redirects to the dedicated /search
 * page (a real link, so it works without JS and is prefetchable). ⌘K / Ctrl K
 * routes to the same page.
 *
 *   Desktop: a glass pill with label + shortcut badge.
 *   Mobile:  the search icon.
 */
export function GlobalSearch() {
  const router = useRouter();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent));
  }, []);

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
      className="group flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white/50 px-2.5 py-2 backdrop-blur-md transition-colors duration-[360ms] ease-brand-out hover:border-accent-500/60 hover:bg-white/70 group-data-[scrolled=true]/nav:border-white/25 group-data-[scrolled=true]/nav:bg-white/10 group-data-[scrolled=true]/nav:hover:border-accent-300/60 lg:px-4"
    >
      <span aria-hidden="true" className="text-neutral-600 transition-colors duration-[360ms] ease-brand-out group-hover:text-primary-700 group-data-[scrolled=true]/nav:text-neutral-300">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <span className="hidden font-sans text-small font-medium text-neutral-600 transition-colors duration-[360ms] ease-brand-out group-hover:text-primary-700 group-data-[scrolled=true]/nav:text-neutral-200 lg:inline">
        Search
      </span>
      <span className="hidden items-center gap-1 rounded-md border border-neutral-300 bg-white/60 px-1.5 py-0.5 font-sans text-[11px] font-medium text-neutral-500 group-data-[scrolled=true]/nav:border-white/20 group-data-[scrolled=true]/nav:bg-white/10 group-data-[scrolled=true]/nav:text-neutral-300 lg:flex">
        {isMac ? (
          <>
            <span className="text-[13px] leading-none">⌘</span>K
          </>
        ) : (
          <>Ctrl K</>
        )}
      </span>
    </Link>
  );
}
