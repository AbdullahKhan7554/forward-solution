"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";

// Client WhatsApp number (E.164, no symbols).
const WHATSAPP_URL = "https://wa.me/923000801213";
// TODO: replace with the client's real profile URLs.
const FACEBOOK_URL = "FB_LINK";
const LINKEDIN_URL = "LINKEDIN_LINK";

const LINKS = [
  {
    label: "Visit us on Facebook",
    href: FACEBOOK_URL,
    bg: "bg-[#1877F2]",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  {
    label: "Chat on WhatsApp",
    href: WHATSAPP_URL,
    bg: "bg-[#25D366]",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 0 1 6.988 2.9 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884z",
  },
  {
    label: "Connect on LinkedIn",
    href: LINKEDIN_URL,
    bg: "bg-[#0A66C2]",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

/**
 * FloatingWhatsApp — floating vertical social bar (Facebook, WhatsApp,
 * LinkedIn). Square brand-colored buttons with white glyphs, fixed
 * bottom-right above everything. Compact on mobile so it hugs the edge.
 * Smooth GSAP entrance on load; hover nudges each button left and lifts the
 * shadow. Reduced motion: a simple fade in.
 */
export function FloatingWhatsApp() {
  const ref = useRef<HTMLElement>(null);

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
        el.children,
        { autoAlpha: 0, x: 26 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.6, stagger: 0.08 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={ref}
      aria-label="Social links"
      className="fixed bottom-4 right-0 z-[120] flex flex-col shadow-[0_14px_36px_-8px_rgba(22,22,63,0.45)] md:bottom-8"
    >
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`${link.bg} flex h-10 w-10 items-center justify-center outline-none first:rounded-tl-md last:rounded-bl-md transition-[transform,filter] duration-200 ease-brand-out hover:-translate-x-1 hover:brightness-110 focus-visible:brightness-110 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 md:h-12 md:w-12`}
        >
          <svg viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true" className="h-5 w-5 md:h-6 md:w-6">
            <path d={link.path} />
          </svg>
        </a>
      ))}
    </nav>
  );
}
