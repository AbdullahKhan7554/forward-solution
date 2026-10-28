"use client";

import { useEffect, useState } from "react";

/**
 * True once the browser confirms a Supabase session. Runs only after hydration, so
 * public pages stay static; visitors without an auth cookie never load the Supabase client.
 */
export function useHasSession() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!/(?:^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    void import("@/lib/supabase/client").then(({ createClient }) => {
      if (cancelled) return;
      const auth = createClient().auth;
      void auth.getSession().then(({ data }) => !cancelled && setHasSession(Boolean(data.session)));
      const { data } = auth.onAuthStateChange((_event, session) => setHasSession(Boolean(session)));
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return hasSession;
}
