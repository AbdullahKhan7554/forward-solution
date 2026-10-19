"use client";

import { useRef, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { ScrollCue } from "@/components/scenes/SceneThreshold/ScrollCue";

export type CatalogHeroFeature = { label: string; icon: ReactNode };

type CatalogHeroProps = {
  id: string;
  crumb: string;
  eyebrow: string;
  title: string;
  image: { src: string; alt: string };
  description: ReactNode;
  features?: CatalogHeroFeature[];
};

/**
 * PRODUCTS · CATALOG HERO.
 *
 * Shared cinematic hero for the species catalogues (ruminants, poultry): a
 * full-bleed image revealed by MaskedReveal, a glass breadcrumb, an oversized
 * "<Title> Solutions" headline surfacing off the shared intro clock, and an
 * optional right-side feature list. Light type sits on a soft cinematic scrim.
 */
export function CatalogHero({ id, crumb, eyebrow, title, image, description, features }: CatalogHeroProps) {
  const { phase } = useIntro();
  const rootRef = useRef<HTMLElement>(null);
  const reducedRef = useRef(false);
  const playedRef = useRef(false);
  const revealing = phase === "revealing";

  useIsomorphicLayoutEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current || !rootRef.current) return;
    const root = rootRef.current;
    gsap.set(root.querySelectorAll("[data-ch-fade]"), { autoAlpha: 0, y: 18 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!revealing || reducedRef.current || playedRef.current || !rootRef.current) return;
    playedRef.current = true;
    const root = rootRef.current;
    const ctx = gsap.context(() => {
      gsap.to(root.querySelectorAll("[data-ch-fade]"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
        stagger: 0.12,
      });
    }, root);
    return () => ctx.revert();
  }, [revealing]);

  const headingId = `${id}-hero-heading`;

  return (
    <section ref={rootRef} aria-labelledby={headingId} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-dark">
      {/* full-bleed cinematic image */}
      <MaskedReveal direction="up" trigger="mount" className="absolute inset-0">
        <div className="h-full w-full will-change-transform">
          <LabPlate src={image.src} alt={image.alt} />
        </div>
      </MaskedReveal>

      {/* cinematic scrim for legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,17,22,0.45) 0%, rgba(11,17,22,0.1) 32%, rgba(11,17,22,0.2) 62%, rgba(11,17,22,0.72) 100%)",
        }}
      />

      {/* content */}
      <div className="relative z-raised flex h-full w-full flex-col justify-between px-6 pb-[10vh] pt-[16vh] md:px-12 md:pb-[9vh] xl:px-20">
        {/* glass breadcrumb */}
        <nav data-ch-fade aria-label="Breadcrumb" className="w-fit">
          <ol className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-sans text-caption uppercase tracking-[0.24em] text-white/80">
            <li><a href="/" className="transition-colors hover:text-white">Home</a></li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li><a href="/products" className="transition-colors hover:text-white">Products</a></li>
            <li aria-hidden="true" className="text-white/40">/</li>
            <li className="text-white">{crumb}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 max-w-3xl flex-1">
            <div data-ch-fade className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-300" />
              <span className="font-sans text-caption uppercase tracking-[0.3em] text-white/80">
                {eyebrow}
              </span>
            </div>

            <h1 id={headingId} className="font-display font-light leading-[1.0] tracking-[-0.02em] text-neutral-50">
              <RevealText text={title} as="span" play={revealing} delay={0.5} stagger={0.06} className="justify-start text-[17vw] md:text-[8vw] xl:text-[104px]" />
              <RevealText text="Solutions" as="span" play={revealing} delay={0.85} stagger={0.06} className="justify-start text-[17vw] text-accent-300 md:text-[8vw] xl:text-[104px]" />
            </h1>

            <p data-ch-fade className="mt-8 max-w-[54ch] text-pretty font-sans text-body-lg text-neutral-200">
              {description}
            </p>
          </div>

          {features && features.length > 0 && (
            <ul className="hidden shrink-0 flex-col gap-5 md:mb-14 md:flex">
              {features.map((f) => (
                <li key={f.label} data-ch-fade className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-accent-300">
                    {f.icon}
                  </span>
                  <span className="font-sans text-caption uppercase tracking-[0.24em] text-white/90">
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 z-raised md:right-12 xl:right-20">
        <ScrollCue />
      </div>
    </section>
  );
}
