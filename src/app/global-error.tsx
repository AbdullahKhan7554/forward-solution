"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/error/ErrorScreen";
import "./globals.css";

/** Last-resort boundary for errors in the root layout itself — replaces it, so it brings its own html/body. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorScreen reset={reset} />
      </body>
    </html>
  );
}
