/**
 * Motion tokens — the single rhythm of the entire film.
 *
 * Every scene pulls its durations and easings from here so the whole
 * experience breathes with one cadence (Design System §13, Motion Bible).
 * No scene defines a raw duration or easing inline.
 *
 * Easing law: narrative motion decelerates (ease-out). Exits are shorter
 * than entrances (×0.65). Never linear for UI, never bounce, never overshoot.
 */

// GSAP-style cubic-bezier easing strings (used via CustomEase-free bezier arrays).
export const EASE = {
  /** micro-feedback, hover, focus */
  out: "power2.out",
  /** the signature weighted deceleration for reveals */
  luxury: "power3.out",
  /** exits — ease-in, quicker */
  in: "power2.in",
} as const;

// Raw cubic-bezier control points (for Framer Motion / CSS parity).
export const BEZIER = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  luxury: [0.16, 1, 0.3, 1] as [number, number, number, number],
  in: [0.4, 0, 1, 1] as [number, number, number, number],
};

// Durations in seconds (Design System §13).
export const DURATION = {
  fast: 0.12,
  medium: 0.25,
  luxury: 0.6,
  hero: 0.9,
} as const;

/** Exits run at 65% of their entrance duration. */
export const EXIT_MULTIPLIER = 0.65;

/** Stagger base between grouped elements. */
export const STAGGER = {
  tight: 0.06,
  base: 0.09,
  text: 0.12,
} as const;
