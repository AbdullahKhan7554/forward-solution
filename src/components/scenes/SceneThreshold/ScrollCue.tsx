"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A whisper-quiet scroll mark - a thin vertical line down which a single point
 * of light slowly descends, with a lowercase serif label. No "SCROLL" caps, no
 * looping bar. Editorial and near-silent, cornered rather than centred.
 */
export function ScrollCue() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="relative block h-16 w-px overflow-hidden bg-neutral-200/80">
        {!reducedMotion && (
          <span className="absolute left-0 top-0 block h-6 w-px animate-scroll-cue bg-primary-600" />
        )}
      </span>
      <span className="font-serif text-small italic text-neutral-400">scroll</span>
    </div>
  );
}
