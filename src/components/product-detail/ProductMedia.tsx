"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ProductMedia — a responsive image container, styled beautifully whether or not
 * the real photograph exists yet.
 *
 * The on-brand labelled placeholder is ALWAYS rendered as the background, so the
 * layout looks finished immediately (and holds its aspect ratio → zero CLS). When
 * `src` is provided, a Next.js <Image fill> is overlaid on top (object-cover); if
 * that file isn't in place yet it fails silently (onError) and the placeholder
 * shows through. Drop the asset at the given path and it simply appears:
 *
 *   <ProductMedia src="/images/products/poultry/.../hero.webp" alt="…" label="…" />
 *
 * No new design language — same neutral surface, hairline grid and daylight sheen.
 */
export function ProductMedia({
  label,
  alt,
  src,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
}: {
  label: string;
  alt: string;
  src?: string;
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-neutral-100", className)}>
      {/* styled placeholder — always present (fallback + while loading) */}
      <div role="img" aria-label={`${label} — image placeholder`} className="absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(155deg, #F2F5F7 0%, #FFFFFF 52%, #EAF2F7 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,35,44,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.03) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 22% 12%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 55%)",
          }}
        />
        <div className="absolute inset-4 flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-neutral-300/80 text-center md:inset-6">
          <span className="text-primary-400" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.6" />
              <path d="m21 16-5-5L5 20" />
            </svg>
          </span>
          <span className="font-display text-h4 font-medium text-neutral-700">{label}</span>
          <span className="font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
            Image placeholder
          </span>
        </div>
      </div>

      {/* real photograph — overlaid once the asset is dropped in */}
      {src && !failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="relative z-raised object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
