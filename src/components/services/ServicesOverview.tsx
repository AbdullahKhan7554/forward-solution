"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import {
  ConsultationIcon,
  VetIcon,
  FlaskIcon,
  LeafIcon,
  ShieldIcon,
  TruckIcon,
} from "./icons";

/**
 * SERVICES · SCENE 02 — CORE SERVICES.
 *
 * Premium editorial floating glass cards — not a template grid — with generous
 * breathing space, thin-line icons and the established hover grammar (lift +
 * shadow deepen + accent glow). Cards reveal sequentially on scroll (batch
 * stagger). Reduced motion: visible, static.
 */

type Service = { icon: ReactNode; title: string; body: string };

const SERVICES: Service[] = [
  {
    icon: <ConsultationIcon />,
    title: "Technical Consultation",
    body: "Expert technical guidance tailored to your operation — from formulation to on-farm practice.",
  },
  {
    icon: <VetIcon />,
    title: "Veterinary Support",
    body: "Direct access to veterinary expertise for health, prevention and treatment decisions.",
  },
  {
    icon: <FlaskIcon />,
    title: "Product Recommendations",
    body: "The right product for the right challenge, matched to your species and your goals.",
  },
  {
    icon: <LeafIcon />,
    title: "Feed Optimization",
    body: "Nutrition and additive strategies that improve feed efficiency and animal performance.",
  },
  {
    icon: <ShieldIcon />,
    title: "Disease Management Guidance",
    body: "Practical biosecurity and disease-prevention programmes that protect your animals.",
  },
  {
    icon: <TruckIcon />,
    title: "Distributor Support",
    body: "Commercial, technical and supply partnership for distributors across Pakistan.",
  },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      data-service-card
      className="group relative flex h-full flex-col rounded-2xl border border-white/70 bg-white/60 p-8 shadow-glass backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,border-color] duration-300 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:border-accent-300/40 hover:shadow-floating md:p-10"
    >
      {/* soft glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(0,138,75,0.10) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary-600/15 bg-primary-50/60 text-primary-700 transition-colors duration-300 ease-brand-out group-hover:border-accent-300/50 group-hover:text-accent-600">
        {service.icon}
      </span>

      <h3 className="relative mt-8 font-display text-h4 font-light tracking-[-0.01em] text-neutral-900 md:text-[26px]">
        {service.title}
      </h3>
      <p className="relative mt-4 text-pretty font-sans text-body leading-[1.65] text-neutral-600">
        {service.body}
      </p>
    </div>
  );
}

export function ServicesOverview() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-services-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-services-fade]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });

      gsap.set("[data-service-card]", { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch("[data-service-card]", {
        start: "top 86%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", stagger: 0.14, overwrite: true }),
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
      aria-labelledby="services-overview-heading"
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
        <header className="max-w-3xl">
          <div data-services-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(02)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">What We Do</span>
          </div>
          <div data-services-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Core Services
            </span>
          </div>
          <h2
            id="services-overview-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Expertise at Every Step"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[58px]"
            />
          </h2>
        </header>

        <div className="mt-[12vh] grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
