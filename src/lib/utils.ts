/**
 * Minimal, dependency-free className joiner.
 * Deliberately not clsx/tailwind-merge — we keep the surface tiny and
 * handcrafted; class conflicts are avoided by discipline, not runtime merging.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
