"use client";

import { useRef, type ComponentType } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { RevealText } from "@/components/primitives/RevealText";
import { FlaskIcon, VetIcon, TruckIcon, LifebuoyIcon, PeopleIcon, AwardIcon } from "@/components/services/icons";
import { MailIcon } from "@/components/contact/icons";

/**
 * FAQ · SCENE 02 — QUICK NAVIGATION.
 *
 * Premium glass cards that smooth-scroll to each FAQ section (Lenis). Hover
 * lifts the card, deepens the shadow, adds a soft green glow and animates the
 * icon. Reveals on scroll with the shared batch stagger. Reduced motion safe.
 */

type NavCard = { label: string; href: string; Icon: ComponentType };

const CARDS: NavCard[] = [
  { label: "Products", href: "#faq-products", Icon: FlaskIcon },
  { label: "Animal Health", href: "#faq-animal-health", Icon: VetIcon },
  { label: "Orders", href: "#faq-orders", Icon: TruckIcon },
  { label: "Technical Support", href: "#faq-support", Icon: LifebuoyIcon },
  { label: "Partnerships", href: "#faq-partnerships", Icon: PeopleIcon },
  { label: "Company", href: "/about", Icon: AwardIcon },
  { label: "Contact", href: "#faq-cta", Icon: MailIcon },
];

export function FaqQuickNav() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-qn-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-qn-fade]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
      gsap.set("[data-qn-card]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-qn-card]", {
        start: "top 90%",
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, []);

  const onNav = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return; // real routes navigate normally
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -100 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={rootRef} aria-labelledby="qn-heading" className="relative overflow-hidden bg-pure">
      <div className="relative mx-auto w-full max-w-container px-6 py-[14vh] md:px-12 xl:px-20">
        <header className="mb-[7vh] max-w-3xl">
          <div data-qn-fade className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Quick Navigation
            </span>
          </div>
          <h2 id="qn-heading" className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text="Jump to a Topic"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8vw] md:text-[3.8vw] xl:text-[46px]"
            />
          </h2>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {CARDS.map((card) => (
            <a
              key={card.label}
              data-qn-card
              href={card.href}
              onClick={onNav(card.href)}
              className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-secondary-500/15 bg-white/70 p-5 shadow-glass outline-none backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow,border-color] duration-200 ease-brand-out hover:-translate-y-1.5 hover:border-accent-300/40 hover:shadow-floating focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              {/* soft glow on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ease-brand-out group-hover:opacity-100"
                style={{ background: "radial-gradient(70% 60% at 50% 0%, rgba(0,138,75,0.10) 0%, rgba(255,255,255,0) 70%)" }}
              />
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary-600/12 bg-primary-50/70 text-primary-700 transition-transform duration-200 ease-brand-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-accent-600">
                <card.Icon />
              </span>
              <span className="relative font-sans text-small font-medium leading-snug text-neutral-800">
                {card.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
