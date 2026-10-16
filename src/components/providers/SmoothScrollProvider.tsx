import type { ReactNode } from "react";

/**
 * Scroll is native. Kept as a passthrough so the root layout stays unchanged.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
