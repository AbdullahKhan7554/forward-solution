/**
 * Error screen — the 404's calm full-viewport surface, without the motion, so it
 * renders even when the page that failed never hydrated. Shared by app/error.tsx
 * and app/global-error.tsx.
 */
export function ErrorScreen({ reset }: { reset: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-base px-6">
      {/* very subtle scientific texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* soft luminous centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 42% at 50% 42%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)",
        }}
      />

      <div role="alert" className="relative z-raised mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="mb-8 flex items-center gap-4 font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
          <span className="h-px w-10 bg-accent-500" />
          Something went wrong
        </span>

        <h1 className="font-display text-h2 font-light tracking-[-0.01em] text-neutral-900 md:text-[40px]">
          This page couldn&rsquo;t load
        </h1>

        <p className="mt-5 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-900">
          A temporary problem stopped this page from loading. Please try again in a moment.
        </p>

        <div className="mt-11 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full items-center justify-center rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex w-full items-center justify-center rounded-sm border border-neutral-300 bg-white/50 px-8 py-4 font-sans text-body font-medium text-neutral-800 outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-primary-400 hover:bg-white/80 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
          >
            Return Home
          </a>
        </div>
      </div>
    </section>
  );
}
