"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { BlogCard } from "@/components/scenes/SceneInsights/BlogCard";
import type { Article } from "@/components/info-center/articles";

/**
 * BLOG · ARTICLE DETAIL — the reading experience.
 *
 * One continuous chapter in the same film: the calm editorial hero (category
 * slate + RevealText title + byline), the graded featured image unveiled by
 * MaskedReveal, a measured prose column, a glass Key-Takeaways panel, and a
 * "Continue Reading" row that reuses the existing BlogCard. Everything fades up
 * on scroll via [data-article-fade]. Reduced motion: visible and static.
 */
export function ArticleView({
  article,
  related,
}: {
  article: Article;
  related: Article[];
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
      gsap.set("[data-article-fade]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-article-fade]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
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
    <article ref={rootRef} className="relative">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-base">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(64% 46% at 80% 8%, rgba(219,239,231,0.34) 0%, rgba(255,255,255,0) 58%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[880px] px-6 pb-[6vh] pt-[20vh] md:px-8">
          {/* back link */}
          <a
            href="/blog"
            className="group inline-flex items-center gap-2.5 font-sans text-small font-medium text-neutral-500 outline-none transition-colors duration-200 ease-brand-out hover:text-primary-700 focus-visible:text-primary-700"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 ease-brand-out group-hover:-translate-x-1"
            >
              &larr;
            </span>
            All Articles
          </a>

          {/* category slate */}
          <div className="mb-7 mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">
              {article.category}
            </span>
          </div>

          {/* title */}
          <h1 className="font-display font-light leading-[1.08] tracking-[-0.015em] text-neutral-900">
            <RevealText
              text={article.title}
              as="span"
              trigger="mount"
              stagger={0.05}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[52px]"
            />
          </h1>

          {/* byline */}
          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-caption uppercase tracking-[0.16em] text-neutral-400">
            <span className="text-neutral-600">{article.author}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{article.date}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{article.readingTime}</span>
          </div>
        </div>

        {/* featured image */}
        <div className="relative mx-auto w-full max-w-[1120px] px-6 pb-[2vh] md:px-8">
          <div className="overflow-hidden rounded-xl shadow-soft">
            <MaskedReveal className="aspect-[16/9] w-full">
              <LabPlate src={article.image} alt={article.title} />
            </MaskedReveal>
          </div>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-pure">
        <div className="relative mx-auto w-full max-w-[720px] px-6 py-[12vh] md:px-8">
          {/* lead / intro */}
          <p
            data-article-fade
            className="text-pretty font-serif text-[1.5rem] font-light leading-[1.5] text-neutral-800 md:text-[1.7rem]"
          >
            {article.intro}
          </p>

          {/* sections */}
          {article.sections.map((section, i) => (
            <section key={i} className="mt-14">
              {section.heading && (
                <h2
                  data-article-fade
                  className="mb-6 font-display text-h4 font-light tracking-[-0.01em] text-neutral-900 md:text-[30px]"
                >
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  data-article-fade
                  className="mt-5 text-pretty font-sans text-body-lg leading-[1.75] text-neutral-600"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* key takeaways — glass panel */}
          {article.takeaways.length > 0 && (
            <aside
              data-article-fade
              className="mt-16 rounded-xl border border-white/70 bg-white/60 p-8 shadow-glass backdrop-blur-xl backdrop-saturate-150 md:p-10"
            >
              <h2 className="mb-6 font-sans text-caption uppercase tracking-[0.28em] text-primary-700">
                Key Takeaways
              </h2>
              <ul className="space-y-4">
                {article.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                    />
                    <span className="font-sans text-body-lg leading-[1.6] text-neutral-700">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* back to library */}
          <div data-article-fade className="mt-16 border-t border-neutral-200 pt-10">
            <a
              href="/blog"
              className="group inline-flex items-center gap-3 font-sans text-body font-medium text-primary-700 outline-none focus-visible:text-primary-800"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-200 ease-brand-out group-hover:-translate-x-1"
              >
                &larr;
              </span>
              Back to the Knowledge Library
            </a>
          </div>
        </div>
      </div>

      {/* ── CONTINUE READING ─────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="relative overflow-hidden bg-base"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(66% 44% at 22% 4%, rgba(219,239,231,0.3) 0%, rgba(255,255,255,0) 58%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-container px-6 py-[14vh] md:px-12 xl:px-20">
            <header className="mb-[7vh] flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span
                id="related-heading"
                className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500"
              >
                Continue Reading
              </span>
            </header>

            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <BlogCard key={post.slug} post={post} variant="secondary" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
