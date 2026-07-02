import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Toxin Binders — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry toxin binder range — Elenco Fix Super (algae-based) and Probond (clay-based) — for broad-spectrum mycotoxin management and feed safety.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "elencofix-super", href: "/products/poultry/elencofix-super" },
  { slug: "probond", href: "/products/poultry/probond" },
];

export default function PoultryToxinBindersPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Toxin Binders" ariaLabel="Entering Agriprom Pakistan — Poultry Toxin Binders" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Toxin Binders"
          titleTop="Toxin"
          titleBottom="Binders"
          intro="Broad-spectrum mycotoxin management that protects feed quality, liver health and flock performance."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
