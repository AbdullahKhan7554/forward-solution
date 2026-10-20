"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * SCENE 02 — THE UNFOLDING (homepage "About Agriprom Pakistan" section).
 *
 * The elegant storytelling beat after the hero — matched to the About page's
 * editorial composition: text + CTA on the left, a luxury floating image collage
 * on the right (large / overlapping / floating, different elevations, generous
 * negative space). On enter the heading, paragraph and button reveal, then the
 * images stagger in (fade + rise + subtle scale-down); afterward each image
 * drifts independently on scroll. Content verbatim from the client homepage.
 * transform/opacity only. Reduced motion: static.
 */

const IMG_LAB = "/images/home/home-caring.webp"; // large — the environment

/** One collage image — reveal target › hover surface. */
function CollageImage({
  src,
  className,
  sizes,
  priority,
}: {
  src: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={className}>
      <div data-about-img className="h-full w-full">
        <div className="group h-full w-full overflow-hidden rounded-xl shadow-soft transition-[box-shadow] duration-[250ms] ease-brand-out hover:shadow-medium">
          <div className="relative h-full w-full">
            <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SceneUnfolding() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-about-text]", { autoAlpha: 0, y: 50 });
      gsap.set("[data-about-img]", { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 0.8 },
        scrollTrigger: { trigger: root, start: "top 70%", toggleActions: "play none none none" },
      });
      tl.to("[data-about-text]", { autoAlpha: 1, y: 0, stagger: 0.15 }, 0.1);
      tl.to("[data-about-img]", { autoAlpha: 1 }, 0.35);
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="unfolding-heading" className="relative overflow-hidden bg-pure">
      {/* soft daylight bloom + faint technical grid — the recurring scientific motif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 78% 12%, rgba(219,239,231,0.28) 0%, rgba(255,255,255,0) 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,35,44,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,44,0.02) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:py-24 md:px-12 xl:px-20">
        {/* editorial two-column: story left, collage right */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* LEFT — text + CTA */}
          <div className="min-w-0 max-w-xl">
            <div data-about-text className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-900">
                About Agriprom Pakistan
              </span>
            </div>

            <h2
              id="unfolding-heading"
              className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
            >
              <RevealText
                text="Caring for animals,"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="justify-start text-[9vw] md:text-[4.6vw] xl:text-[60px]"
              />
              <RevealText
                text="caring for you"
                as="span"
                trigger="scroll"
                stagger={0.06}
                className="mt-1 justify-start text-[9vw] text-primary-700 md:text-[4.6vw] xl:text-[60px]"
              />
            </h2>

            <p data-about-text className="mt-8 text-pretty font-sans text-body-lg text-neutral-900">
              With over a decade of experience in the Poultry and Dairy sectors, AGRIPROM
              PAKISTAN addresses emerging challenges at the grassroots level in Pakistan. Our
              innovative solutions are designed to meet the evolving needs of the poultry and
              livestock industries.
            </p>

            <a
              data-about-text
              href="/about"
              className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft transition-colors duration-200 ease-brand-out hover:bg-primary-700"
            >
              More about us
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          </div>

          {/* RIGHT — single image, in normal flow */}
          <div className="flex justify-end">
            {/* the environment */}
            <CollageImage
              src={IMG_LAB}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="relative aspect-[4/3] w-full max-w-[560px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
