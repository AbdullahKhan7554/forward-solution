"use client";

import { useRef } from "react";
import Image from "next/image";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";

/**
 * ABOUT · MEET OUR TEAM.
 *
 * A responsive premium team grid (4 / 2 / 1). Cards use the white glass-inspired
 * surface, lift on hover, and reveal on scroll with a luxury fade + rise stagger.
 *
 * PORTRAITS: each member has a `photo` field. It is intentionally left undefined
 * so a clearly-branded monogram placeholder renders (no broken images / CLS). To
 * drop in a real portrait later, set `photo: "/images/team/<slug>.jpg"`.
 */

type Member = {
  name: string;
  role: string;
  blurb: string;
  /** set to "/images/team/<slug>.jpg" to replace the monogram placeholder */
  photo?: string;
};

const TEAM: Member[] = [
  { name: "Dr. Ahmed Khan", role: "Managing Director", blurb: "Leading Agriprom's strategic vision and long-term growth." },
  { name: "Sana Malik", role: "Chief Operating Officer", blurb: "Orchestrating day-to-day operations with precision and care." },
  { name: "Bilal Raza", role: "Sales Director", blurb: "Building lasting partnerships across Pakistan's animal-health market." },
  { name: "Dr. Ayesha Siddiqui", role: "Veterinary Consultant", blurb: "Translating veterinary science into practical field guidance." },
  { name: "Usman Tariq", role: "Technical Manager", blurb: "Ensuring every solution performs reliably on the farm." },
  { name: "Fatima Noor", role: "Product Specialist", blurb: "Matching the right products to each production challenge." },
  { name: "Hamza Sheikh", role: "Marketing Manager", blurb: "Telling Agriprom's science-led story with clarity." },
  { name: "Zainab Ali", role: "Customer Success Executive", blurb: "Making sure every client feels supported, always." },
];

/** Initials from the name (drops the "Dr." honorific). */
function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TeamPortrait({ member }: { member: Member }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={`${member.name} — ${member.role}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
      />
    );
  }
  // Branded monogram placeholder — replace by setting `photo` on the member.
  return (
    <div
      aria-label={`Portrait placeholder for ${member.name}`}
      role="img"
      className="flex h-full w-full items-center justify-center"
      style={{
        background: "linear-gradient(155deg, #EDF2F5 0%, #FFFFFF 52%, #E7F1EC 100%)",
      }}
    >
      <span className="font-display text-[2.4rem] font-light tracking-[0.02em] text-primary-700/60">
        {initials(member.name)}
      </span>
    </div>
  );
}

function TeamCard({ member }: { member: Member }) {
  return (
    <article
      data-team-card
      className="group overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-200 ease-brand-out will-change-transform hover:-translate-y-1.5 hover:border-accent-300/45 hover:shadow-floating"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <TeamPortrait member={member} />
      </div>
      <div className="p-6">
        <h3 className="font-display text-h4 font-medium tracking-[-0.01em] text-neutral-900">
          {member.name}
        </h3>
        <p className="mt-1 font-sans text-caption uppercase tracking-[0.18em] text-primary-700">
          {member.role}
        </p>
        <p className="mt-3 text-pretty font-sans text-small leading-[1.6] text-neutral-600">
          {member.blurb}
        </p>
      </div>
    </article>
  );
}

export function AboutTeam() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-team-fade]", { autoAlpha: 0, y: 18 });
      gsap.to("[data-team-fade]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 76%", once: true },
      });

      gsap.set("[data-team-card]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-team-card]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
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
      aria-labelledby="team-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(64% 44% at 82% 6%, rgba(219,239,231,0.32) 0%, rgba(255,255,255,0) 58%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <header className="max-w-3xl">
          <div data-team-fade className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-accent-500" />
            <span className="font-sans text-caption uppercase tracking-[0.32em] text-neutral-500">
              Meet Our Team
            </span>
          </div>
          <h2
            id="team-heading"
            className="font-display font-light leading-[1.04] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="The People Behind Agriprom Pakistan"
              as="span"
              trigger="scroll"
              stagger={0.05}
              className="justify-start text-[8vw] md:text-[4.2vw] xl:text-[54px]"
            />
          </h2>
          <p
            data-team-fade
            className="mt-8 max-w-[64ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            A multidisciplinary team committed to advancing animal health, scientific
            innovation, customer success and sustainable livestock development across
            Pakistan.
          </p>
        </header>

        <div className="mt-[10vh] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
