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

const IMG_LAB = "/images/heroabout/h1.png"; // large — the environment
const IMG_TEAM = "/images/heroabout/ChatGPT Image Jul 2, 2026, 06_50_41 PM.png"; // overlapping — the care
const IMG_SCIENCE = "/images/heroabout/h4.png"; // floating — the science

/** One collage image — parallax wrapper › reveal target › hover surface. */
function CollageImage({
  src,
  speed,
  className,
  sizes,
  priority,
}: {
  src: string;
  speed: number;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div data-parallax data-speed={speed} className={className}>
      <div data-about-img className="h-full w-full">
        <div className="group h-full w-full overflow-hidden rounded-xl shadow-soft transition-[transform,box-shadow] duration-[250ms] ease-brand-out will-change-transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-medium">
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
      gsap.set("[data-about-img]", { autoAlpha: 0, y: 50, scale: 1.08 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 0.8 },
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      tl.to("[data-about-text]", { autoAlpha: 1, y: 0, stagger: 0.15 }, 0.1);
      tl.to("[data-about-img]", { autoAlpha: 1, y: 0, scale: 1, stagger: 0.15 }, 0.35);

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const sp = Number(el.dataset.speed || 30);
        gsap.to(el, {
          y: -sp,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
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

      <div className="relative mx-auto w-full max-w-container px-6 py-[18vh] md:px-12 xl:px-20">
        {/* slate caption — chapter continuity */}
        <div data-about-text className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(02)</span>
          <span className="h-px w-10 bg-neutral-300" />
          <span className="font-serif text-small italic text-neutral-400">The Unfolding</span>
        </div>

        {/* editorial two-column: story left, collage right */}
        <div className="grid grid-cols-1 items-center gap-x-12 gap-y-14 lg:grid-cols-2">
          {/* LEFT — text + CTA */}
          <div className="max-w-xl">
            <div data-about-text className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-accent-500" />
              <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
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

            <p data-about-text className="mt-8 text-pretty font-sans text-body-lg text-neutral-700">
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

          {/* RIGHT — luxury floating image collage */}
          <div className="relative flex flex-col gap-6 md:block md:min-h-[560px] xl:min-h-[640px]">
            {/* large — the environment */}
            <CollageImage
              src={IMG_LAB}
              speed={35}
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="relative aspect-[4/3] w-full md:absolute md:right-0 md:top-[4%] md:z-10 md:aspect-[4/3] md:w-[76%]"
            />
            {/* overlapping — caring for animals */}
            <CollageImage
              src={IMG_TEAM}
              speed={60}
              sizes="(max-width: 768px) 100vw, 28vw"
              className="relative aspect-[4/5] w-full md:absolute md:bottom-0 md:left-0 md:z-20 md:aspect-[4/5] md:w-[52%]"
            />
            {/* floating — the science */}
            <CollageImage
              src={IMG_SCIENCE}
              speed={20}
              sizes="(max-width: 768px) 100vw, 18vw"
              className="relative aspect-square w-2/3 md:absolute md:left-[8%] md:top-0 md:z-30 md:aspect-square md:w-[30%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
