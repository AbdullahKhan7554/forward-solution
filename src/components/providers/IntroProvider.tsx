"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

/**
 * IntroProvider - the single orchestration clock for Scene 01.
 *
 * The whole opening is gated on one phase transition:
 *   "loading"  -> preloader is on screen, WebGL warms behind it
 *   "revealing"-> curtain lifts; navbar, type and camera-push all key off this
 *
 * Keeping this in one tiny context means the navbar, the hero content and the
 * WebGL camera all start from the exact same instant - no drift between layers.
 */

type Phase = "loading" | "revealing";

type IntroValue = {
  phase: Phase;
  /** called by the Preloader when the loading sequence has played out */
  complete: () => void;
};

const IntroContext = createContext<IntroValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const complete = useCallback(() => setPhase("revealing"), []);

  return (
    <IntroContext.Provider value={{ phase, complete }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro(): IntroValue {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
