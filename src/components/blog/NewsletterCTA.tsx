"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RevealText } from "@/components/primitives/RevealText";
import { useCTAChoreography } from "@/components/scenes/SceneCTA/useCTAChoreography";

// Same ultra-light particle atmosphere the homepage/About CTAs use.
const ParticleField = dynamic(
  () => import("@/components/scenes/SceneInnovation/ParticleField"),
  { ssr: false }
);

/**
 * BLOG · SCENE 05 — THE NEWSLETTER (CTA).
 *
 * The closing invitation of the Knowledge Center: keep in touch with the
 * science. Reuses the shared closing-CTA grammar wholesale — the
 * useCTAChoreography reveal (data-cta-scale / data-cta-fade), the soft radial +
 * ParticleField atmosphere and the same centered composition — swapping the
 * button pair for a single glass email-capture form. Reduced motion safe.
 */
export function NewsletterCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  useCTAChoreography(rootRef);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden bg-pure"
    >
      {/* soft radial + ultra-light particle atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(219,239,231,0.35) 0%, rgba(255,255,255,0) 62%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
        <ParticleField scrollProgressRef={scrollProgress} color={[0.35, 0.55, 0.62]} />
      </div>

      <div className="relative mx-auto flex min-h-[76svh] w-full max-w-container flex-col items-center justify-center px-6 py-[16vh] text-center md:px-12">
        <div data-cta-scale className="flex w-full max-w-[720px] flex-col items-center">
          <div data-cta-fade className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Stay Informed
            </span>
          </div>

          <h2
            id="newsletter-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="The Science of Animal Health,"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] md:text-[4.6vw] xl:text-[58px]"
            />
            <RevealText
              text="Delivered to Your Inbox"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-center text-[8.5vw] text-primary-700 md:text-[4.6vw] xl:text-[58px]"
            />
          </h2>

          <p
            data-cta-fade
            className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Join our newsletter for the latest research, nutrition insights and practical
            guidance from the Agriprom team — a few emails a month, never more.
          </p>

          {submitted ? (
            <p
              data-cta-fade
              className="mt-12 font-sans text-body-lg font-medium text-primary-700"
              role="status"
            >
              Thank you — you&rsquo;re on the list. Watch your inbox.
            </p>
          ) : (
            <form
              data-cta-fade
              onSubmit={onSubmit}
              className="mt-12 flex w-full max-w-[520px] flex-col items-stretch gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full flex-1 rounded-sm border border-white/70 bg-white/60 px-6 py-4 font-sans text-body text-neutral-800 shadow-glass outline-none backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] duration-200 ease-brand-out placeholder:text-neutral-400 focus:border-accent-300 focus:shadow-soft focus-visible:ring-2 focus-visible:ring-accent-500"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Subscribe
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </button>
            </form>
          )}

          <p data-cta-fade className="mt-5 font-sans text-caption text-neutral-400">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
