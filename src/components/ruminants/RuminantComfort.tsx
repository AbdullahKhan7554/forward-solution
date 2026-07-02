"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { RuminantShowcase, type RuminantProduct } from "./RuminantShowcase";

/**
 * RUMINANTS · SCENE 04.06 — COMFORT, HOUSING & HANDLING.
 * Cinematic header + full premium RuminantShowcase presentations (alternating).
 */
const PRODUCTS: RuminantProduct[] = [
  {
    name: "Puzzle Comfort Mat",
    type: "Comfort Solution",
    image: "/images/products/ruminants/puzzle-comfort-mat.webp",
    description:
      "Puzzle Comfort Mat is a premium dairy flooring solution designed to provide superior comfort, reduce leg fatigue, improve cow welfare, and enhance overall productivity in modern dairy farms.",
    specs: [
      { label: "Category", value: "Comfort Solution" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Material", value: "High-Density Rubber" },
      { label: "Surface", value: "Anti-Slip" },
      { label: "Installation", value: "Interlocking Puzzle Design" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Reduces leg and hoof stress",
      "Improves cow comfort",
      "Minimizes slipping injuries",
      "Supports higher milk production",
      "Long-lasting heavy-duty construction",
    ],
    applications: ["Dairy Farms", "Milking Parlors", "Resting Areas", "Walking Alleys"],
  },
  {
    name: "Mammouth Mattress",
    type: "Comfort Solution",
    image: "/images/products/ruminants/mammouth-mattress.webp",
    description:
      "Mammouth Mattress delivers exceptional lying comfort for dairy cows by combining advanced cushioning technology with durable construction to improve animal welfare and productivity.",
    specs: [
      { label: "Category", value: "Comfort Solution" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Material", value: "Premium Foam & Rubber" },
      { label: "Surface", value: "Comfortable Soft Layer" },
      { label: "Installation", value: "Stall Mattress System" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Improves resting time",
      "Reduces lameness",
      "Better udder health",
      "Increased milk yield",
      "Long service life",
    ],
    applications: ["Dairy Barns", "Free Stall Systems", "Commercial Dairy Farms"],
  },
  {
    name: "EVA Horse Stable Mat",
    type: "Comfort Solution",
    image: "/images/products/ruminants/eva-horse-stable-mat.webp",
    description:
      "EVA Horse Stable Mat is designed to provide maximum comfort, shock absorption, and slip resistance for horses while creating a cleaner and safer stable environment.",
    specs: [
      { label: "Category", value: "Comfort Solution" },
      { label: "Species", value: "Horses" },
      { label: "Material", value: "EVA Foam" },
      { label: "Surface", value: "Anti-Slip" },
      { label: "Installation", value: "Stable Flooring" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Excellent shock absorption",
      "Improves horse comfort",
      "Easy cleaning",
      "Reduces fatigue",
      "Durable and lightweight",
    ],
    applications: ["Horse Stables", "Equestrian Centers", "Veterinary Facilities", "Training Farms"],
  },
  {
    name: "Standard Self Locks",
    type: "Livestock Management",
    image: "/images/products/ruminants/standard-self-locks.webp",
    description:
      "Standard Self Locks provide a safe, efficient, and reliable livestock handling solution, allowing easy animal management during feeding, treatment, and routine farm operations.",
    specs: [
      { label: "Category", value: "Livestock Management" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Material", value: "Galvanized Steel" },
      { label: "Finish", value: "Corrosion Resistant" },
      { label: "Installation", value: "Feeding System" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Safe animal handling",
      "Improves farm efficiency",
      "Reduces labor requirements",
      "Heavy-duty construction",
      "Long operational life",
    ],
    applications: ["Dairy Farms", "Feeding Stations", "Livestock Facilities", "Commercial Farms"],
  },
  {
    name: "Free Stall Systems",
    type: "Housing Solution",
    image: "/images/products/ruminants/free-stall-system.webp",
    description:
      "Free Stall Systems are engineered to maximize cow comfort, improve barn organization, enhance hygiene, and support higher productivity in modern dairy operations.",
    specs: [
      { label: "Category", value: "Housing Solution" },
      { label: "Species", value: "Dairy Cattle" },
      { label: "Material", value: "Galvanized Steel" },
      { label: "System", value: "Free Stall" },
      { label: "Installation", value: "Barn Infrastructure" },
      { label: "Manufacturer", value: "—" },
      { label: "Country of Origin", value: "—" },
    ],
    benefits: [
      "Enhances animal welfare",
      "Better space utilization",
      "Improves hygiene",
      "Supports higher milk production",
      "Long-lasting structural design",
    ],
    applications: ["Dairy Barns", "Commercial Dairy Farms", "Livestock Housing", "Modern Dairy Facilities"],
  },
];

export function RuminantComfort() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-cf-fade]", { autoAlpha: 0, y: 20 });
      gsap.to("[data-cf-fade]", {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="comfort" ref={rootRef} aria-labelledby="cf-heading" className="relative scroll-mt-24 overflow-hidden bg-pure">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(72% 55% at 78% 6%, rgba(219,239,231,0.42) 0%, rgba(255,255,255,0) 58%)" }} />
      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <div data-cf-fade className="mb-6 flex items-center gap-4">
          <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">06</span>
          <span className="h-px w-10 bg-accent-500" />
          <span className="font-sans text-caption uppercase tracking-[0.28em] text-neutral-500">Ruminants · Comfort &amp; Housing</span>
        </div>
        <h2 id="cf-heading" className="max-w-3xl font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900">
          <RevealText text="Comfort, Housing" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] md:text-[4.2vw] xl:text-[54px]" />
          <RevealText text="&amp; Handling" as="span" trigger="scroll" stagger={0.06} className="justify-start text-[9vw] text-primary-700 md:text-[4.2vw] xl:text-[54px]" />
        </h2>
        <p data-cf-fade className="mt-8 max-w-[56ch] text-pretty font-sans text-body-lg text-neutral-600">
          Comfortable, well-managed animals are productive animals. From flooring and mattresses to
          handling and housing — the infrastructure that protects welfare and longevity.
        </p>

        <div className="mt-[12vh] flex flex-col gap-[14vh]">
          {PRODUCTS.map((p, i) => (
            <RuminantShowcase key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
