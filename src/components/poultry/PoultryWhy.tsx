"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * POULTRY · SECTION 04 — WHY CHOOSE AGRIPROM.
 *
 * A large editorial band: an oversized statement left, four hairline statistics
 * right that count into place. Large typography, generous air. Reuses RevealText
 * and the GSAP/ScrollTrigger clock. Tokens throughout.
 *
 * Global Partners (9) and Areas of Innovation (8, the product families) are real
 * counts; Scientific Support is shown as 24/7 and the technical team as 100%
 * qualified — swap official figures in one place.
 */

const STATS = [
  { target: 9, suffix: "", label: "Global Partners" },
  { target: 8, suffix: "", label: "Areas of Innovation" },
  { text: "24/7", label: "Scientific Support" },
  { target: 100, suffix: "%", label: "Qualified Technical Team" },
] as const;

export function PoultryWhy() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-pw-fade]", { autoAlpha: 0, y: 22 });
      gsap.to("[data-pw-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 68%", once: true },
      });

      gsap.set("[data-pw-stat]", { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch("[data-pw-stat]", {
        start: "top 90%",
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

      gsap.utils.toArray<HTMLElement>("[data-stat-num]").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(proxy.v).toString();
          },
        });
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
      aria-labelledby="poultry-why-heading"
      className="relative overflow-hidden bg-pure"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 18% 10%, rgba(219,239,231,0.4) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-container grid-cols-1 items-center gap-x-16 gap-y-14 px-6 py-[20vh] md:grid-cols-12 md:px-12 xl:px-20">
        {/* statement — left */}
        <div className="md:col-span-6">
          <div data-pw-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.3em] text-neutral-500">
              Why Choose Agriprom
            </span>
          </div>
          <h2
            id="poultry-why-heading"
            className="font-display font-light leading-[1.03] tracking-[-0.02em] text-neutral-900"
          >
            <RevealText
              text="Science You Can"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[10vw] md:text-[5vw] xl:text-[68px]"
            />
            <RevealText
              text="Trust on the Farm"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-start text-[10vw] text-primary-700 md:text-[5vw] xl:text-[68px]"
            />
          </h2>
          <p data-pw-fade className="mt-8 max-w-[46ch] text-pretty font-sans text-body-lg text-neutral-600">
            Globally-qualified partners, research-led innovation and a technical team that stays
            beside you — from placement to processing.
          </p>
        </div>

        {/* statistics — right */}
        <div className="md:col-span-5 md:col-start-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {STATS.map((stat) => (
              <div key={stat.label} data-pw-stat className="border-t border-neutral-200 pt-5">
                <div className="flex items-baseline gap-0.5">
                  {"target" in stat ? (
                    <>
                      <span
                        data-stat-num
                        data-target={stat.target}
                        className="font-display text-[14vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[4.2vw] xl:text-[60px]"
                      >
                        {stat.target}
                      </span>
                      {stat.suffix && (
                        <span className="font-display text-h3 font-light text-accent-500">
                          {stat.suffix}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="font-display text-[11vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[4.2vw] xl:text-[60px]">
                      {stat.text}
                    </span>
                  )}
                </div>
                <span className="mt-4 block font-sans text-caption uppercase tracking-[0.22em] text-neutral-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
