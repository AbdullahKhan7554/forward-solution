"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * SCENE 01 - THE THRESHOLD (existing Hero section, content preserved).
 *
 * Content is verbatim from the client site (Agriprom homepage hero):
 *   - eyebrow:  "Creative Enhancer From Nature"   (typo is in the source;
 *               flagged in audit §9, preserved under the content-freeze)
 *   - H1:       "Empowering Animal Health And Productivity Through
 *               Innovative Feed Additives"       (split into visual lines only
 *               - same words, same order)
 *   - CTA:      "Contact Now"  ->  /contact-us/
 *
 * Only layout, storytelling and motion are transformed: editorial lower-left
 * mass, the H1 surfacing line-by-line with a held beat, a single light-sheen,
 * and the CTA settling last. All Design System tokens.
 */
export function HeroContent() {
  const { phase } = useIntro();
  const ref = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !ref.current) return;
    gsap.set(ref.current.querySelectorAll("[data-hero-fade]"), { autoAlpha: 0, y: 16 });
    gsap.set(ref.current.querySelectorAll("[data-hero-cta]"), { autoAlpha: 0, y: 20 });
    gsap.set(ref.current.querySelectorAll("[data-sheen]"), { xPercent: -140, autoAlpha: 0 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !ref.current) return;
    playedRef.current = true;
    const root = ref.current;

    const ctx = gsap.context(() => {
      // labels + slate settle first
      gsap.to(root.querySelectorAll("[data-hero-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
      });

      // one sheen of light sweeps the headline as the second line resolves
      gsap.to(root.querySelectorAll("[data-sheen]"), {
        keyframes: [
          { autoAlpha: 0.5, duration: 0.1 },
          { xPercent: 140, duration: 0.4, ease: "power2.inOut" },
          { autoAlpha: 0, duration: 0.1 },
        ],
      });

      // the CTA settles last, once the statement has landed
      gsap.to(root.querySelectorAll("[data-hero-cta]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.1,
      });
    }, root);

    return () => ctx.revert();
  }, [revealing]);

  return (
    <div
      ref={ref}
      className="flex h-full flex-col justify-between px-6 pb-[9vh] pt-[17vh] md:px-12 md:pb-[10vh] xl:px-20"
    >
      {/* Eyebrow / tagline - top-left (verbatim source copy) */}
      <div data-hero-fade className="flex items-center gap-4">
        <span className="h-px w-10 bg-accent-500" />
        <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-900">
          Creative Enhancer From Nature
        </span>
      </div>

      {/* Lower-left mass: slate + headline + CTA */}
      <div className="max-w-2xl">
        {/* H1 - same words, split into visual lines, lit by one sheen */}
        <h1 className="relative overflow-hidden pb-[0.08em] font-display font-semibold text-neutral-900">
          <span
            data-sheen
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-raised w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent, rgba(255,255,255,0.9), transparent)",
            }}
          />
          <RevealText
            text="Empowering Animal Health And Productivity"
            as="span"
            play={revealing}
            delay={0}
            duration={0.5}
            stagger={0.06}
            className="justify-start text-[9.5vw] leading-[1.02] tracking-[-0.015em] md:text-[5.4vw] xl:text-[64px]"
          />
          <RevealText
            text="Through Innovative Feed Additives"
            as="span"
            play={revealing}
            delay={0.1}
            duration={0.5}
            stagger={0.06}
            className="mt-2 justify-start text-[9.5vw] leading-[1.02] tracking-[-0.015em] text-primary-700 md:text-[5.4vw] xl:text-[64px]"
          />
        </h1>

        {/* CTA - single primary action (verbatim label + real destination) */}
        <a
          data-hero-cta
          href="/contact-us/"
          className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out hover:bg-primary-700"
        >
          Contact Now
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
