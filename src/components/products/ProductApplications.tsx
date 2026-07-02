"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * PRODUCTS · SCENE 05 — WHERE THEY'RE USED (Applications).
 *
 * Six real-world settings where Agriprom products go to work, as interactive
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
const Paw = () => (
  <Icon>
    <circle cx="7" cy="8" r="1.6" />
    <circle cx="12" cy="6" r="1.6" />
    <circle cx="17" cy="8" r="1.6" />
    <path d="M12 12c-2.5 0-4.5 2-4.5 4.2C7.5 18 9 19 12 19s4.5-1 4.5-2.8C16.5 14 14.5 12 12 12z" />
  </Icon>
);

type Application = { title: string; body: string; icon: ReactNode };

const APPLICATIONS: Application[] = [
  { title: "Poultry Farms", body: "Broiler and layer operations of every scale.", icon: <Barn /> },
  { title: "Dairy Farms", body: "Herd health, milk yield and productivity.", icon: <Milk /> },
  { title: "Livestock", body: "Beef cattle, sheep and goat production.", icon: <Livestock /> },
  { title: "Veterinary Clinics", body: "Trusted pharmaceuticals for animal care.", icon: <Clinic /> },
  { title: "Feed Mills", body: "Additives and premixes for feed production.", icon: <Mill /> },
  { title: "Companion Animals", body: "Everyday health for pets and companions.", icon: <Paw /> },
];

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  return (
    <li data-app-card>
      <GlassCard className="relative h-full overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
          style={{
            background: "radial-gradient(closest-side, rgba(0,138,75,0.35), rgba(0,138,75,0))",
          }}
        />
        <div className="relative flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary-700 shadow-soft transition-colors duration-300 ease-brand-out group-hover:text-accent-600">
              {app.icon}
            </span>
            <span className="font-sans text-caption tracking-[0.24em] text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-display text-h4 font-medium text-neutral-900">{app.title}</h3>
          <p className="mt-3 text-pretty font-sans text-body text-neutral-600">{app.body}</p>

          {/* quiet interactive affordance */}
          <span className="mt-6 inline-flex items-center gap-2 font-sans text-caption uppercase tracking-[0.2em] text-primary-700 opacity-0 transition-opacity duration-300 ease-brand-out group-hover:opacity-100">
            Learn more
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </span>
        </div>
      </GlassCard>
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
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
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

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-app-header className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(05)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Field</span>
          </div>
          <div data-app-header className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
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

        <ul className="mt-[12vh] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {APPLICATIONS.map((app, i) => (
            <ApplicationCard key={app.title} app={app} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
