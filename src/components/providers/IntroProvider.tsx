"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * IntroProvider - the single orchestration clock for Scene 01.
 *
 * The whole opening is gated on one phase transition:
 *   "loading"  -> preloader is on screen, WebGL warms behind it
 *   "revealing"-> curtain lifts; navbar, type and camera-push all key off this
 *
 * Keeping this in one tiny context means the navbar, the hero content and the
 * WebGL camera all start from the exact same instant - no drift between layers.
 *
 * The preloader plays once per browser session (sessionStorage flag). On any
 * later load or navigation it is skipped and the phase jumps straight to
 * "revealing" before paint, so hero content is visible immediately.
 */

type Phase = "loading" | "revealing";

/** "pending" until the client has checked the session flag */
type PreloaderMode = "pending" | "play" | "skip";

const SEEN_KEY = "intro-preloader-seen";

type IntroValue = {
  phase: Phase;
  preloader: PreloaderMode;
  /** called by the Preloader when the loading sequence has played out */
  complete: () => void;
};

const IntroContext = createContext<IntroValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [preloader, setPreloader] = useState<PreloaderMode>("pending");
  const complete = useCallback(() => setPhase("revealing"), []);
  const checked = useRef(false);

  useIsomorphicLayoutEffect(() => {
    // guard so a dev strict-mode effect re-run doesn't read our own write
    if (checked.current) return;
    checked.current = true;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      if (!seen) window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage unavailable - fall back to playing the preloader
    }

    if (seen) {
      setPhase("revealing");
      setPreloader("skip");
    } else {
      setPreloader("play");
    }
  }, []);

  return (
    <IntroContext.Provider value={{ phase, preloader, complete }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro(): IntroValue {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
