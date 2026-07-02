"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { articles, type Article } from "@/components/info-center/articles";

/**
 * BLOG · SCENE 02 — THE FEATURED ARTICLE.
 *
 * The newest article, given the weight of a magazine cover. Reuses the exact
 * BlogCard grammar — MaskedReveal unveils the image, a hover zoom (scale 1.04),
 * the glass metadata pill, RevealText title and the sliding Read More arrow —
 * scaled up into a full-bleed editorial split. Text staggers in on scroll; the
 * image reveal is owned by MaskedReveal. Reduced motion: everything static.
 */
export function FeaturedArticle({
  article = articles[0],
}: {
  article?: Article;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-feat-fade]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-feat-fade]", {
        start: "top 84%",
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
      id="articles"
      aria-labelledby="featured-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft luminous gradient — upper-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(64% 46% at 80% 6%, rgba(219,239,231,0.34) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        {/* Section slate */}
        <header className="mb-[8vh] max-w-3xl">
          <div data-feat-fade className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Featured Article
            </span>
          </div>
          <h2
            id="featured-heading"
            data-feat-fade
            className="font-display text-h3 font-light tracking-[-0.01em] text-neutral-900 md:text-[40px]"
          >
            The Latest From Our Desk
          </h2>
        </header>

        {/* Editorial feature — large image + text */}
        <a
          href={article.href}
          aria-label={`Read article: ${article.title}`}
          className="group grid grid-cols-1 items-center gap-x-14 gap-y-9 outline-none md:grid-cols-12"
        >
          {/* Large image */}
          <div className="md:col-span-7">
            <div className="relative overflow-hidden rounded-xl shadow-soft ring-1 ring-transparent transition-[transform,box-shadow] duration-200 ease-brand-out group-hover:-translate-y-1 group-hover:shadow-floating group-hover:ring-primary-600/20 group-focus-visible:ring-primary-600/40">
              <MaskedReveal className="aspect-[16/11] w-full">
                <div className="h-full w-full transition-transform duration-[650ms] ease-brand-out group-hover:scale-[1.04]">
                  <LabPlate src={article.image} alt={article.title} />
                </div>
              </MaskedReveal>

              {/* glass metadata pill */}
              <span className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/60 px-4 py-2 font-sans text-caption uppercase tracking-[0.18em] text-primary-700 shadow-soft backdrop-blur-xl backdrop-saturate-150">
                {article.category}
              </span>
            </div>
          </div>

          {/* Text column */}
          <div className="md:col-span-5">
            <div
              data-feat-fade
              className="mb-5 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.16em] text-neutral-400"
            >
              <span>{article.date}</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span>{article.readingTime}</span>
            </div>

            <h3
              data-feat-fade
              className="font-display text-h3 font-light leading-[1.1] tracking-[-0.01em] text-neutral-900 md:text-[38px]"
            >
              {article.title}
            </h3>

            <p
              data-feat-fade
              className="mt-6 max-w-[54ch] text-pretty font-sans text-body-lg text-neutral-600"
            >
              {article.excerpt}
            </p>

            <span
              data-feat-fade
              className="mt-9 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out group-hover:bg-primary-700"
            >
              Read Article
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1.5"
              >
                <svg
                  width="24"
                  height="10"
                  viewBox="0 0 24 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 5h21M17 1l5 4-5 4" />
                </svg>
              </span>
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
