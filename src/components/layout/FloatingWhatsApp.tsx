"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

// Client WhatsApp number (E.164, no symbols).
const WHATSAPP_URL = "https://wa.me/923000801213";

/**
 * FloatingWhatsApp — a premium circular WhatsApp button.
 *
 * A 70px #25D366 circle with the official white WhatsApp glyph, a thin
 * translucent ring, a soft green outer glow and a premium navy shadow. Fixed
 * bottom-right (32px), above everything. Smooth GSAP entrance on load; hover
 * scales + lifts and expands the glow. Reduced motion: a simple fade in.
 */
export function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 0.3 });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.6, y: 26 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <a
      ref={ref}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-8 right-8 z-[120] block h-[70px] w-[70px] rounded-full outline-none transition-transform duration-200 ease-brand-out will-change-transform hover:-translate-y-1 hover:scale-[1.06]"
    >
      {/* soft green glow — expands on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-32%] rounded-full bg-[#25D366] opacity-45 blur-2xl transition-transform duration-300 ease-brand-out group-hover:scale-125"
      />
      {/* inner circle + thin translucent ring + premium shadow */}
      <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[#25D366] ring-1 ring-white/30 shadow-[0_14px_36px_-8px_rgba(22,22,63,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-white/70">
        {/* official WhatsApp glyph, white */}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 0 1 6.988 2.9 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
        </svg>
      </span>
    </a>
  );
}
