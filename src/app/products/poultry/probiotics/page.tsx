import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Probiotics — Agriprom Pakistan",
  description: "Gut health that fuels performance.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "alterion-ne", href: "/products/poultry/probiotics/alterion-ne" },
];

export default function PoultryProbioticsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Probiotics" ariaLabel="Entering Agriprom Pakistan — Poultry Probiotics" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Probiotics"
          titleTop="Poultry"
          titleBottom="Probiotics"
          intro="Gut health that fuels performance."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
