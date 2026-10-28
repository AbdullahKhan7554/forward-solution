/** Small inline spinner that inherits the text color. */
export function Spinner({ className = "h-[14px] w-[14px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`shrink-0 animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Button label: spinner + pending text while busy, the normal label otherwise. */
export function Pending({ pending, label, children }: { pending: boolean; label: string; children: React.ReactNode }) {
  if (!pending) return <>{children}</>;
  return (
    <span className="inline-flex items-center justify-center gap-2" aria-live="polite">
      <Spinner />
      {label}
    </span>
  );
}

/** Thin upload progress bar (0–100). */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Upload progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="h-[4px] w-full overflow-hidden rounded-full bg-[#EEF1F6]"
    >
      <div className="h-full rounded-full bg-[#008848] transition-[width] duration-150" style={{ width: `${value}%` }} />
    </div>
  );
}
