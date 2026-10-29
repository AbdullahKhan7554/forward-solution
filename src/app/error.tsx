"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/error/ErrorScreen";

/** Route error boundary (Next `error` convention) — rendered inside the root layout. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorScreen reset={reset} />;
}
