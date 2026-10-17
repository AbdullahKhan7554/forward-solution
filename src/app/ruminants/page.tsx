import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RuminantHero } from "@/components/ruminants/RuminantHero";
import { RuminantIntro } from "@/components/ruminants/RuminantIntro";
import { RuminantSolutions } from "@/components/ruminants/RuminantSolutions";
import { RuminantCTA } from "@/components/ruminants/RuminantCTA";

export const metadata: Metadata = {
  title: "Ruminant Solutions — Agriprom Pakistan | Dairy & Beef Cattle Nutrition",
  description:
    "Science-driven ruminant nutrition, health and comfort for dairy and beef cattle — rumen-protected amino acids, toxin binders, organic minerals, biosecurity, comfort, energy boosters and yeast culture.",
  alternates: { canonical: "https://agriprompakistan.com/ruminants" },
};

/**
 * RUMINANTS — a cinematic single-page experience, in the same film.
 * Shell: IntroProvider + Preloader + Navbar + Footer.
 *   01 Hero · 02 Introduction · 03 Category grid (→ /products/ruminants/<category>) · 04 CTA
 */
export default function RuminantsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Ruminant Solutions" ariaLabel="Entering Agriprom Pakistan — Ruminants" />
      <Navbar />
      <main>
        <RuminantHero />
        <RuminantIntro />
        <RuminantSolutions />
        <RuminantCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
