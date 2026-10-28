"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Thin top bar while a client navigation is in flight. The app router has no
 * route events, so it starts on internal link clicks and finishes when the
 * URL changes (or after a safety timeout).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith("/admin")) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      clear();
      setVisible(true);
      setWidth(12);
      timers.current.push(
        setTimeout(() => setWidth(45), 120),
        setTimeout(() => setWidth(72), 600),
        setTimeout(() => setWidth(88), 1600),
        setTimeout(() => setVisible(false), 10_000),
      );
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // URL changed → the new route has rendered
  useEffect(() => {
    clear();
    setWidth((w) => (w ? 100 : 0));
    timers.current.push(
      setTimeout(() => setVisible(false), 200),
      setTimeout(() => setWidth(0), 400),
    );
    return clear;
  }, [pathname, search]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] transition-opacity duration-150 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-[#008848] shadow-[0_0_8px_rgba(0,136,72,0.5)] transition-[width] duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
