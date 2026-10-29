"use client";

import { useEffect } from "react";

/** Admin error boundary — keeps the admin chrome and offers a retry instead of a blank screen. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-[520px] flex-col items-center gap-3 rounded-xl border border-[#E3E7EF] bg-white px-6 py-10 text-center">
      <div className="text-[18px] font-semibold">Something went wrong</div>
      <p className="m-0 text-[14px] text-[#5B6178]">
        This page couldn&apos;t load. Check your connection and try again.
        {error.digest && <span className="mt-1 block text-[12px]">Reference: {error.digest}</span>}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border-none bg-[#008848] px-[18px] py-[11px] text-[14px] font-semibold text-white [font-family:inherit]"
        >
          Try again
        </button>
        <a
          href="/admin"
          className="rounded-lg border border-[#D5DAE6] bg-white px-[18px] py-[11px] text-[14px] font-semibold text-[#1B1F3B] no-underline hover:border-[#B8C0D4]"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
