import { cn } from "@/lib/utils";

/**
 * Wordmark - the Agriprom Pakistan brand logo (public/logos.png). Rendered as a
 * plain <img> so its natural aspect ratio is preserved without knowing the
 * intrinsic dimensions. `className` still flows through for layout tweaks.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logos.png" alt="Agriprom Pakistan" className="h-11 w-auto object-contain md:h-12" />
    </span>
  );
}
