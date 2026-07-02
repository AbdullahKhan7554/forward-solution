"use client";

import { useRef } from "react";
import { RevealText } from "@/components/primitives/RevealText";
import { BlogCard } from "./BlogCard";
import { blogPosts } from "./blogs";
import { useInsightsChoreography } from "./useInsightsChoreography";

export function SceneInsights() {
  const rootRef = useRef<HTMLElement>(null);
  useInsightsChoreography(rootRef);

  const [featured, ...secondary] = blogPosts;

  return (
    <section
      ref={rootRef}
      aria-labelledby="insights-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* blueprint grid @ ~2% + soft luminous gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 78% 8%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 pb-[22vh] pt-[18vh] md:px-12 xl:px-20">
        {/* HEADER */}
        <header className="max-w-3xl">
          <div data-insights-fade className="mb-8 flex items-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(07)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Knowledge</span>
          </div>

          <div data-insights-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Insights &amp; Knowledge
            </span>
          </div>

          <h2
            id="insights-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Latest Articles &"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] md:text-[4.4vw] xl:text-[58px]"
            />
            <RevealText
              text="Industry Insights"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[8.5vw] text-primary-700 md:text-[4.4vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-insights-fade
            className="mt-8 max-w-[58ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Stay updated with expert perspectives, animal nutrition research, poultry
            management strategies and the latest developments shaping modern livestock
            health.
          </p>
        </header>

        {/* EDITORIAL CARDS - featured + two secondary */}
        <div className="mt-[12vh] grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <BlogCard post={featured} variant="featured" />
          </div>
          <div className="flex flex-col gap-14 md:col-span-5">
            {secondary.map((post) => (
              <BlogCard key={post.title} post={post} variant="secondary" />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div data-insights-fade className="mt-[16vh] flex flex-col items-center text-center">
          <span className="mb-14 block h-px w-full max-w-3xl bg-neutral-200" />
          <h3 className="font-display text-h3 font-light tracking-[-0.01em] text-neutral-900 md:text-[36px]">
            Want More Industry Insights?
          </h3>
          <p className="mt-4 max-w-[46ch] font-sans text-body-lg text-neutral-600">
            Explore our growing knowledge library.
          </p>
          <a
            href="/blog"
            className="group mt-9 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-colors duration-200 ease-brand-out hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            View All Articles
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
