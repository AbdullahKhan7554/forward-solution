"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MapPinIcon, PhoneIcon, ClockIcon, MailIcon, ArrowUpRightIcon } from "./icons";

const MAPS_QUERY =
  "Agriprom Pakistan, 1st Floor Plot 19B, Off Abdul Sattar Edhi Road, Rahimabad, Lahore 53700";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;

/**
 * CONTACT · SCENE 02 — REACH US & FIND US (MERGED).
 *
 * One cohesive section that folds together what were three separate scenes —
 * the contact details ("Reach Us"), the office place ("The Place") and the map
 * ("Find Us"). Editorial two-column layout: the details rail on the left (address,
 * phone, hours, email + an Open-in-Maps action), the large integrated Google Map
 * on the right (lazy-mounted on scroll, brand-graded, with an animated marker and
 * a floating glass overlay). Everything reveals on scroll. Reduced motion: static.
 */

type Detail = {
  icon: ReactNode;
  label: string;
  lines: string[];
  href?: string;
};

const DETAILS: Detail[] = [
  {
    icon: <MapPinIcon />,
    label: "Address",
    lines: [
      "1st Floor, Plot 19B,",
      "Off Abdul Sattar Edhi Road,",
      "Near Qazalbash Chowk,",
      "Rahimabad, Lahore 53700",
    ],
    href: MAPS_URL,
  },
  {
    icon: <PhoneIcon />,
    label: "Phone",
    lines: ["+92 300 0801213"],
    href: "tel:+923000801213",
  },
  {
    icon: <ClockIcon />,
    label: "Business Hours",
    lines: ["Open 24 Hours", "Seven days a week"],
  },
  {
    icon: <MailIcon />,
    label: "Email",
    lines: ["info@agriprompakistan.com"],
    href: "mailto:info@agriprompakistan.com",
  },
];

function DetailRow({ detail }: { detail: Detail }) {
  const inner = (
    <>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-600/15 bg-primary-50/60 text-primary-700 transition-colors duration-300 ease-brand-out group-hover:border-accent-300/50 group-hover:text-accent-600">
        {detail.icon}
      </span>
      <div className="min-w-0">
        <span className="font-sans text-caption uppercase tracking-[0.24em] text-neutral-400">
          {detail.label}
        </span>
        <div className="mt-2 space-y-0.5">
          {detail.lines.map((line, i) => (
            <p key={i} className="font-sans text-body-lg leading-[1.5] text-neutral-800">
              {line}
            </p>
          ))}
        </div>
      </div>
    </>
  );

  const className =
    "group flex items-start gap-5 rounded-2xl border border-transparent px-3 py-5 transition-colors duration-300 ease-brand-out";

  return (
    <div data-loc-row className="border-t border-neutral-200/70 first:border-t-0">
      {detail.href ? (
        <a
          href={detail.href}
          {...(detail.href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={`${className} outline-none hover:border-accent-300/30 hover:bg-white/50 focus-visible:ring-2 focus-visible:ring-accent-500`}
        >
          {inner}
        </a>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </div>
  );
}

export function ContactLocation() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Lazy-mount the map only when the section nears the viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-loc-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-loc-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });

      gsap.set("[data-loc-row]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-loc-row]", {
        start: "top 90%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
      });

      gsap.fromTo(
        frameRef.current,
        { autoAlpha: 0, scale: 0.985, y: 24 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        }
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="reach"
      aria-labelledby="reach-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(64% 46% at 82% 6%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* header */}
        <header className="max-w-3xl">
          <div data-loc-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400"></span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400"></span>
          </div>
          <div data-loc-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
             
            </span>
          </div>
          <h2
            id="reach-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Every Door Is Open"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[60px]"
            />
          </h2>
        </header>

        {/* two-column: details rail + integrated map */}
        <div className="mt-[10vh] grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          {/* details rail */}
          <div>
            <div className="rounded-3xl border border-white/70 bg-white/55 p-6 shadow-glass backdrop-blur-xl backdrop-saturate-150 md:p-8">
              <h3 data-loc-fade className="px-3 font-display text-h4 font-light tracking-[-0.01em] text-neutral-900">
                Agriprom Pakistan
              </h3>
              <div className="mt-4">
                {DETAILS.map((detail) => (
                  <DetailRow key={detail.label} detail={detail} />
                ))}
              </div>
              <div className="px-3 pt-6">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-sm bg-primary-600 px-7 py-3.5 font-sans text-small font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  Open in Google Maps
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1 group-hover:-translate-y-1"
                  >
                    <ArrowUpRightIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* integrated, brand-graded map */}
          <div
            ref={frameRef}
            className="group relative overflow-hidden rounded-2xl shadow-floating ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/3] w-full lg:aspect-[16/13]">
              {mounted ? (
                <iframe
                  title="Agriprom Pakistan location, Lahore"
                  src={MAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[0.28] contrast-[1.04] transition-[filter] duration-500 ease-brand-out group-hover:grayscale-0 group-hover:contrast-100"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(155deg, #EDF2F5 0%, #FFFFFF 52%, #F1F5F7 100%)",
                  }}
                />
              )}

              {/* soft integrating scrim (does not block interaction) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(20,35,44,0.05) 0%, rgba(20,35,44,0) 22%, rgba(20,35,44,0) 74%, rgba(20,35,44,0.06) 100%)",
                }}
              />

              {/* animated location marker */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-raised -translate-x-1/2 -translate-y-full">
                <span className="relative flex flex-col items-center">
                  <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-primary-600 text-pure shadow-floating">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 animate-ping rounded-full bg-accent-500/40"
                    />
                    <span className="relative">
                      <MapPinIcon />
                    </span>
                  </span>
                  <span className="mt-1 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-r border-white/70 bg-primary-600" />
                </span>
              </div>

              {/* floating glass overlay card */}
              <div
                data-loc-fade
                className="pointer-events-auto absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/70 p-5 shadow-glass backdrop-blur-xl backdrop-saturate-150 sm:right-auto sm:max-w-sm sm:p-6"
              >
                <span className="font-sans text-caption uppercase tracking-[0.22em] text-primary-700">
                  Agriprom Pakistan
                </span>
                <p className="mt-2 font-sans text-body leading-[1.5] text-neutral-700">
                  Rahimabad, Lahore 53700 · Open 24 Hours
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mt-4 inline-flex items-center gap-2.5 font-sans text-small font-medium text-primary-700 outline-none focus-visible:text-primary-800"
                >
                  Open in Google Maps
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 ease-brand-out group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                  >
                    <ArrowUpRightIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
