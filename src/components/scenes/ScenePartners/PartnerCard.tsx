import { cn } from "@/lib/utils";
import type { Partner } from "./partners";

/**
 * PartnerCard - a floating glass partner panel. Reuses the Design System glass
 * tokens. Logo rests in mono (grayscale) and reveals its official colour on
 * hover/focus; the panel lifts, the shadow deepens, a hairline glow appears,
 * the logo scales 1.02, and the descriptor brightens. Keyboard-focusable with a
 * visible focus ring; the descriptor stays in the a11y tree at all times.
 */
export function PartnerCard({
  partner,
  className,
}: {
  partner: Partner;
  /** optional extra classes on the <li> so callers can re-compose the layout */
  className?: string;
}) {
  const isFeature = partner.weight === "feature";

  return (
    <li
      data-partner
      className={cn(
        "mb-8 break-inside-avoid list-none",
        partner.weight === "offset" && "xl:mt-[9vh]",
        className
      )}
    >
      <div
        tabIndex={0}
        role="group"
        aria-label={`${partner.name} — ${partner.description}`}
        className={cn(
          "group relative flex flex-col justify-between rounded-lg border border-white/70 bg-white/55 shadow-soft outline-none backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,background-color] duration-150 ease-brand-out will-change-transform",
          "hover:-translate-y-1 hover:bg-white/75 hover:shadow-floating hover:ring-1 hover:ring-primary-600/25",
          "focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent-500",
          isFeature ? "min-h-[300px] p-10" : "min-h-[220px] p-8"
        )}
      >
        <div className={cn("flex items-center", isFeature ? "h-24" : "h-16")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            loading="lazy"
            decoding="async"
            className="max-h-full w-auto max-w-[72%] grayscale transition-[filter,transform] duration-150 ease-brand-out group-hover:grayscale-0 group-hover:scale-[1.02] group-focus-visible:grayscale-0"
          />
        </div>

        <div className="mt-8">
          <p
            className={cn(
              "font-display font-medium text-neutral-900",
              isFeature ? "text-h4" : "text-body-lg"
            )}
          >
            {partner.name}
          </p>
          <p className="mt-1.5 font-sans text-caption uppercase tracking-[0.18em] text-neutral-500 opacity-70 transition-opacity duration-150 ease-brand-out group-hover:opacity-100 group-focus-visible:opacity-100">
            {partner.description}
          </p>
        </div>
      </div>
    </li>
  );
}
