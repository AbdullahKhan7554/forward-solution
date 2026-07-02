"use client";

import { useEffect, useState } from "react";

/**
 * Reduced-motion contract (Design System §15).
 * Returns true when the user has requested less motion. Every scene must read
 * this and collapse parallax / push-ins / mask sweeps into simple cross-fades.
 * Motion is never load-bearing — no information depends on it.
 */
export function usePrefersReducedMotion(): boolean {
  // Default to `true` (reduced) so the very first paint is calm and safe;
  // we relax to full motion only once we've confirmed the user allows it.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
