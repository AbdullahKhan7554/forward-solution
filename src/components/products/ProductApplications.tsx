"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";

/**
 * PRODUCTS · SCENE 05 — WHERE THEY'RE USED (Applications).
 *
 * Five real-world settings where Agriprom products go to work, as interactive
 * editorial glass cards. Minimal Lucide-style line icons (matching the Footer
 * set). Hover reuses GlassCard's lift + shadow and adds an accent glow, an icon
 * shift and a quiet "Learn more" affordance. Cards reveal in sequence. Reuses
 * GlassCard, RevealText, the GSAP/ScrollTrigger clock and tokens.
 */

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const Barn = () => (
  <Icon>
    <path d="M3 21V9l9-6 9 6v12" />
    <path d="M3 21h18M7 21v-6h10v6M7 12h10" />
  </Icon>
);
const Milk = () => (
  <Icon>
    <path d="M8 2h8M8 2v3l-2 4v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9l-2-4V2" />
    <path d="M6 12h12" />
  </Icon>
);
const Livestock = () => (
  <Icon>
    <path d="M4 10c-1 0-2 1-2 2s1 2 2 2M20 10c1 0 2 1 2 2s-1 2-2 2" />
    <path d="M5 14c0 3 3 5 7 5s7-2 7-5v-3a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5z" />
    <path d="M9 10h.01M15 10h.01" />
  </Icon>
);
const Clinic = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M12 8v8M8 12h8" />
  </Icon>
);
const Mill = () => (
  <Icon>
    <path d="M3 21V8l7-3v3l7-3v16M3 21h18M7 21v-4h3v4M14 21v-4h3v4" />
  </Icon>
);

type Application = { title: string; body: string; icon: ReactNode; tone: string };

const APPLICATIONS: Application[] = [
  { title: "Poultry Farms", body: "Broiler and layer operations of every scale.", icon: <Barn />, tone: "bg-primary-600 text-white" },
  { title: "Dairy Farms", body: "Herd health, milk yield and productivity.", icon: <Milk />, tone: "bg-primary-900 text-white" },
  { title: "Livestock", body: "Beef cattle, sheep and goat production.", icon: <Livestock />, tone: "bg-[#0E7C86] text-white" },
  { title: "Veterinary Clinics", body: "Trusted pharmaceuticals for animal care.", icon: <Clinic />, tone: "bg-[#F2B33D] text-neutral-900" },
  { title: "Feed Mills", body: "Additives and premixes for feed production.", icon: <Mill />, tone: "bg-[#B8432A] text-white" },
];

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  return (
    <li
      data-app-card
      className={cn(
        "md:col-span-2",
        // 5 cards: 3 + 2, with the second row centred
        index === 3 && "md:col-start-2",
        index === 4 && "sm:col-span-2 md:col-span-2"
      )}
    >
      {/* solid colour circle — icon, title and text centred inside */}
      <div
        className={cn(
          "group mx-auto flex aspect-square w-full max-w-[280px] flex-col items-center justify-center rounded-full p-8 text-center shadow-medium transition-[transform,box-shadow] duration-300 ease-brand-out hover:scale-105 hover:shadow-floating md:max-w-[230px] md:p-6 lg:max-w-[300px] lg:p-10",
          app.tone
        )}
      >
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 md:mb-3 md:h-10 md:w-10 lg:mb-4 lg:h-12 lg:w-12">
          {app.icon}
        </span>
        <h3 className="font-display text-h4 font-medium md:text-lg lg:text-h4">{app.title}</h3>
        <p className="mt-2 max-w-[22ch] text-pretty font-sans text-body opacity-90 md:text-sm lg:text-body">{app.body}</p>
      </div>
    </li>
  );
}

export function ProductApplications() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-app-header]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-app-header]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 70%", toggleActions: "play none none none" },
      });

      gsap.set("[data-app-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-app-card]", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="app-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 24% 4%, rgba(219,239,231,0.38) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-app-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-900">
              Applications
            </span>
          </div>
          <h2
            id="app-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Where Our Products"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Go to Work"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>
        </header>

        <ul className="mt-[12vh] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-6 md:gap-8">
          {APPLICATIONS.map((app, i) => (
            <ApplicationCard key={app.title} app={app} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
