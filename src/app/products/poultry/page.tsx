import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { PoultryHero } from "@/components/poultry/PoultryHero";
import { PoultryScience } from "@/components/poultry/PoultryScience";
import { PoultryProducts } from "@/components/poultry/PoultryProducts";
import { PoultryWhy } from "@/components/poultry/PoultryWhy";
import { PoultryCTA } from "@/components/poultry/PoultryCTA";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Poultry Solutions — Agriprom Pakistan | Scientific Feed Technologies",
  description:
    "Agriprom Pakistan delivers scientifically proven nutritional technologies — enzymes, organic acids, toxin binders and more — that improve bird health, feed efficiency and farm profitability.",
};

/**
 * POULTRY CATEGORY LANDING — a chapter within Products, in the same film.
 *
 * Shares the established shell (IntroProvider clock, re-captioned Preloader,
 * floating Navbar, shared Footer) and reuses every primitive: RevealText,
 * MaskedReveal, LabPlate, GlassCard grammar, the CTA choreography, GSAP tokens.
 *
 *   01 — Hero            03 — Product Categories   05 — CTA
 *   02 — Scientific      04 — Why Choose Agriprom   ·  Footer (shared)
 */
export default function PoultryPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Solutions" ariaLabel="Entering Agriprom Pakistan — Poultry" />
      <Navbar />
      <main>
        <PoultryHero />
        <PoultryScience />
        <PoultryProducts />
        <PoultryWhy />
        <PoultryCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
