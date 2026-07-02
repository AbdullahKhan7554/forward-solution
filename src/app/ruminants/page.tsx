import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RuminantHero } from "@/components/ruminants/RuminantHero";
import { RuminantIntro } from "@/components/ruminants/RuminantIntro";
import { RuminantSolutions } from "@/components/ruminants/RuminantSolutions";
import { RuminantAminoAcids } from "@/components/ruminants/RuminantAminoAcids";
import { RuminantToxinBinders } from "@/components/ruminants/RuminantToxinBinders";
import { RuminantOrganicMinerals } from "@/components/ruminants/RuminantOrganicMinerals";
import { RuminantVaccines } from "@/components/ruminants/RuminantVaccines";
import { RuminantBiosecurity } from "@/components/ruminants/RuminantBiosecurity";
import { RuminantComfort } from "@/components/ruminants/RuminantComfort";
import { RuminantCTA } from "@/components/ruminants/RuminantCTA";

export const metadata: Metadata = {
  title: "Ruminant Solutions — Agriprom Pakistan | Dairy & Beef Cattle Nutrition",
  description:
    "Science-driven ruminant nutrition, health and comfort for dairy and beef cattle — rumen-protected amino acids, toxin binders, organic minerals, vaccines, biosecurity and comfort solutions.",
  alternates: { canonical: "https://agriprompakistan.com/ruminants" },
};

/**
 * RUMINANTS — a cinematic single-page experience, in the same film.
 * Shell: IntroProvider + Preloader + Navbar + Footer.
 *   01 Hero · 02 Introduction · 03 Solutions Overview · 04 Category sections · 05 CTA
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
        <RuminantAminoAcids />
        <RuminantToxinBinders />
        <RuminantOrganicMinerals />
        <RuminantVaccines />
        <RuminantBiosecurity />
        <RuminantComfort />
        <RuminantCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
