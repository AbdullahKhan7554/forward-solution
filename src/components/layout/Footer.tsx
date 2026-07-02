"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { Wordmark } from "@/components/navbar/Wordmark";
import { cn } from "@/lib/utils";

/* Minimal Lucide-style line icons (stroke, 1.5) */
function Icon({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
const LinkedIn = () => (
  <Icon>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Icon>
);
const Facebook = () => (
  <Icon>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Icon>
);
const WhatsApp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.825 9.825 0 0 1 6.988 2.9 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
  </svg>
);
const MapPin = () => (
  <Icon>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
const Phone = () => (
  <Icon>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Icon>
);
const Mail = () => (
  <Icon>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </Icon>
);
const Clock = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-block py-1.5 font-sans text-body text-white/85 outline-none transition-colors duration-200 ease-brand-out hover:text-[#008A4B] focus-visible:text-[#008A4B]"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#0064C1] transition-transform duration-300 ease-brand-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
    </a>
  );
}

function ColHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-6 font-sans text-caption uppercase tracking-[0.24em] text-white/70">
      {children}
    </h3>
  );
}

const SOCIALS = [
  { label: "LinkedIn", icon: <LinkedIn />, href: "https://pk.linkedin.com/company/agriprompakistan" },
  { label: "Facebook", icon: <Facebook />, href: "https://www.facebook.com/AgripromPakistan" },
  { label: "WhatsApp", icon: <WhatsApp />, href: "https://wa.me/923000801213" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-footer-watermark]", { autoAlpha: 0 });
      gsap.set("[data-footer-fade]", { autoAlpha: 0, y: 20 });
      gsap.set("[data-footer-col]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-footer-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set("[data-footer-bottom]", { autoAlpha: 0, y: 10 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        })
        .to("[data-footer-watermark]", { autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0.15)
        .to("[data-footer-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14 }, 0.1)
        .to("[data-footer-col]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.5)
        .to("[data-footer-line]", { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 1.0)
        .to("[data-footer-bottom]", { autoAlpha: 1, y: 0, duration: 0.8 }, 1.3);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-dark-rich text-neutral-300"
      aria-label="Site footer"
    >
      {/* white -> navy bridge from Scene 08 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-pure to-transparent"
      />
      {/* soft blue bloom + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 6%, rgba(28,100,136,0.18) 0%, rgba(20,35,44,0) 55%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.25) 0%, rgba(20,35,44,0) 60%)",
        }}
      />
      {/* ultra-subtle molecular dot network */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* GIANT AGRIPROM WATERMARK — luxury editorial, bottom-centered, ~5% */}
      <div
        data-footer-watermark
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex select-none flex-col items-center pb-[3vh]"
      >
        <span className="block whitespace-nowrap font-display text-[17vw] font-semibold leading-[0.82] tracking-[-0.03em] text-white/[0.05] md:text-[16vw] xl:text-[15vw]">
          AGRIPROM
        </span>
        <span
          className="mt-2 block whitespace-nowrap ps-[0.6em] text-center font-sans text-[1.7vw] uppercase text-white md:text-[1.05vw] xl:text-[0.85vw]"
          style={{ letterSpacing: "0.6em", opacity: 0.08 }}
        >
          Animal Health • Nutrition • Science
        </span>
      </div>

      <div className="relative z-raised mx-auto w-full max-w-container px-6 pt-[16vh] md:px-12 xl:px-20">
        {/* TOP MESSAGE */}
        <div className="mx-auto max-w-3xl text-center">
          <div data-footer-fade className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-400">
              Agriprom Pakistan
            </span>
          </div>
          <h2 className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-50">
            <RevealText
              text="Delivering Trusted Animal Health"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8vw] md:text-[3.9vw] xl:text-[50px]"
            />
            <RevealText
              text="Solutions Across Pakistan"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8vw] text-accent-300 md:text-[3.9vw] xl:text-[50px]"
            />
          </h2>
          <p
            data-footer-fade
            className="mx-auto mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-white/75"
          >
            Connecting global scientific innovation with Pakistan&rsquo;s livestock
            industry through quality, expertise and long-term partnerships.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-[14vh] grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div data-footer-col>
            <Wordmark className="text-neutral-50" />
            <p className="mt-6 max-w-[34ch] font-sans text-body text-white/75">
              Science-driven animal health and nutrition solutions, delivered across
              Pakistan through trusted global partnerships.
            </p>
            <ul className="mt-7 flex items-center gap-3">
              {SOCIALS.map((s) => {
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 outline-none transition-[transform,color,border-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:border-[#008A4B]/50 hover:text-[#008A4B] focus-visible:ring-2 focus-visible:ring-accent-500"
                    >
                      {s.icon}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <nav data-footer-col aria-label="Quick links">
            <ColHeading>Quick Links</ColHeading>
            <ul className="flex flex-col gap-1">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/about">About</FooterLink></li>
              <li><FooterLink href="/products">Products</FooterLink></li>
              <li><FooterLink href="/blog">Blogs</FooterLink></li>
              <li><FooterLink href="/contact-us/">Contact</FooterLink></li>
            </ul>
          </nav>

          {/* Product Categories */}
          <nav data-footer-col aria-label="Product categories">
            <ColHeading>Product Categories</ColHeading>
            <ul className="flex flex-col gap-1">
              <li><FooterLink href="/products/poultry">Poultry</FooterLink></li>
              <li><FooterLink href="/ruminants/">Ruminants</FooterLink></li>
              <li><FooterLink href="/companion-animals">Companion Animals</FooterLink></li>
              <li><FooterLink href="/products/poultry">Feed Additives</FooterLink></li>
              <li><FooterLink href="/ruminants/">Veterinary Solutions</FooterLink></li>
            </ul>
          </nav>

          {/* Contact */}
          <div data-footer-col>
            <ColHeading>Contact</ColHeading>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3 font-sans text-body text-white/75">
                <span className="mt-0.5 text-[#0064C1]"><MapPin /></span>
                <span>Pakistan</span>
              </li>
              <li className="flex items-start gap-3 font-sans text-body text-white/75">
                <span className="mt-0.5 text-[#0064C1]"><Phone /></span>
                <a href="tel:03000801249" className="outline-none transition-colors hover:text-[#008A4B] focus-visible:text-[#008A4B]">
                  0300 0801249
                </a>
              </li>
              <li className="flex items-start gap-3 font-sans text-body text-white/75">
                <span className="mt-0.5 text-[#0064C1]"><Mail /></span>
                <a href="mailto:Info@agriprompakistan.com" className="break-all outline-none transition-colors hover:text-neutral-50 focus-visible:text-neutral-50">
                  Info@agriprompakistan.com
                </a>
              </li>
              <li className="flex items-start gap-3 font-sans text-body text-white/75">
                <span className="mt-0.5 text-[#0064C1]"><Clock /></span>
                <span>Mon &ndash; Sat · 9:00&ndash;18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <span
          data-footer-line
          aria-hidden="true"
          className="mt-[12vh] block h-px w-full bg-white/10"
        />
        <div
          data-footer-bottom
          className="flex flex-col items-center justify-between gap-4 py-8 text-center font-sans text-small text-neutral-500 md:flex-row md:text-left"
        >
          <p>© 2026 Agriprom Pakistan. All Rights Reserved.</p>
          <p className="font-serif italic text-neutral-400">Designed with Precision.</p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <FooterLink href="/privacy-policy/">Privacy Policy</FooterLink>
            <FooterLink href="/terms-of-use/">Terms</FooterLink>
            <FooterLink href="#">Sitemap</FooterLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}
