"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * ABOUT · SCENE 02 — WHO WE ARE.
 *
 * The storytelling beat after the hero: text + CTA on the left, a single static
 * image on the right in normal flow. On enter the heading, paragraph and button
 * reveal. Reuses every design/motion token — nothing new invented.
 */

const IMG_LAB = "/images/heroabout/h1.jpg";

type Pillar = { label: string; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    label: "01 — Science",
    title: "Science First",
    body: "Every product is grounded in globally-qualified research and held to rigorous quality standards.",
  },
  {
    label: "02 — Partnership",
    title: "Global Partnerships",
    body: "We bring world-class manufacturers and proven technologies to Pakistani farms, clinics and distributors.",
  },
  {
    label: "03 — Pakistan",
    title: "Rooted in Pakistan",
    body: "Built for local challenges and delivered farm-to-farm with technical support that stays close.",
  },
];

export function AboutWhoWeAre() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // prime hidden states before paint
      gsap.set("[data-about-text]", { autoAlpha: 0, y: 50 });
      gsap.set("[data-who-line]", { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set("[data-who-card]", { autoAlpha: 0, y: 26 });

      // reveal: text (heading → paragraph → button), staggered
      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 0.8 },
        scrollTrigger: { trigger: root, start: "top 70%", toggleActions: "play none none none" },
      });
      tl.to("[data-about-text]", { autoAlpha: 1, y: 0, stagger: 0.15 }, 0.1);

      // pillars settle in as they enter
      ScrollTrigger.batch("[data-who-card]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });
      gsap.to("[data-who-line]", {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: "[data-who-line]", start: "top 90%", toggleActions: "play none none none" },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="who-we-are"
      ref={rootRef}
      aria-labelledby="about-who-heading"
      className="relative overflow-hidden bg-base"
    >
      {/* soft daylight bloom + faint technical grid — the recurring scientific motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 22% 8%, rgba(234,242,247,0.55) 0%, rgba(255,255,255,0) 58%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.022) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* editorial two-column: story left, image right */}
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-14 lg:grid-cols-2">
          {/* LEFT — text + CTA */}
          <div className="max-w-xl">
            <div data-about-text className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-900">
                Who We Are
              </span>
            </div>

            <h2
              id="about-who-heading"
              className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
            >
              <RevealText
                text="A Science-Led Animal Health"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[54px]"
              />
              <RevealText
                text="Company, Rooted in Pakistan"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="mt-1 justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[54px]"
              />
            </h2>

            <p data-about-text className="mt-8 text-pretty font-sans text-body-lg text-neutral-900">
              Agriprom Pakistan exists to bring globally-qualified animal health and nutrition
              science to the veterinarians, livestock producers and distributors who feed the
              nation.
            </p>
            <p data-about-text className="mt-5 text-pretty font-sans text-body text-neutral-900">
              We pair world-class manufacturing partnerships with deep local understanding —
              delivering vaccines, feed additives, biosecurity and nutrition that raise the
              standard of productivity across every province.
            </p>

            <a
              data-about-text
              href="/products"
              className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out hover:bg-primary-700"
            >
              Explore Our Products
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>

          {/* RIGHT — single static image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-soft">
            <Image
              src={IMG_LAB}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* defining pillars */}
        <div className="mt-[16vh]">
          <span data-who-line aria-hidden="true" className="mb-12 block h-px w-full bg-neutral-200" />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} data-who-card>
                <GlassCard label={pillar.label} className="h-full">
                  <h3 className="font-display text-h4 font-medium text-neutral-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-pretty font-sans text-body text-neutral-900">
                    {pillar.body}
                  </p>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
