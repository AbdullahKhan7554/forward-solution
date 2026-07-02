import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompanionHero } from "@/components/companion/CompanionHero";
import { CompanionProductSection } from "@/components/companion/CompanionProductSection";
import { CompanionCTA } from "@/components/companion/CompanionCTA";
import { COMPANION_CATEGORIES } from "@/components/companion/companionData";

export const metadata: Metadata = {
  title: "Companion Animal Solutions — Agriprom Pakistan | Dog & Cat Vaccines",
  description:
    "Advanced vaccines and veterinary healthcare solutions from Agriprom Pakistan, designed to protect companion animals — dogs and cats — through modern science.",
  alternates: { canonical: "https://agriprompakistan.com/companion-animals" },
};

/**
 * COMPANION ANIMALS — a cinematic single-page story.
 *   01 Bright hero · 02 Dogs (Vencomax 12) · 03 Cats (Ronavac) · CTA · Footer
 */
export default function CompanionAnimalsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Companion Animals" ariaLabel="Entering Agriprom Pakistan — Companion Animals" />
      <Navbar />
      <main>
        <CompanionHero />
        {COMPANION_CATEGORIES.map((category, i) => (
          <CompanionProductSection key={category.id} category={category} sceneNumber={i + 2} />
        ))}
        <CompanionCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
