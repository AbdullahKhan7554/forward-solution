import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * GlassCard - a reusable floating translucent panel (Design System §7/§10).
 *
 * Hover is pure CSS, GPU-only, completes in 150ms: lifts 4px, brightens the
 * glass, deepens the shadow. No bounce, no rotation. Reduced-motion users get
 * the same end-states instantly (global transition-duration override).
 */
export function GlassCard({
  label,
  children,
  className,
  ...rest
}: {
  label?: string;
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-secondary-500/20 bg-white/55 p-6 shadow-medium backdrop-blur-xl backdrop-saturate-150 transition-[transform,background-color,box-shadow] duration-150 ease-brand-out will-change-transform hover:-translate-y-1 hover:bg-white/72 hover:shadow-floating md:p-7",
        className
      )}
      {...rest}
    >
      {label && (
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.24em] text-primary-700">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
