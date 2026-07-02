import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Antioxidants — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry antioxidant range — including Compound Antioxidant (EQ + BHT) — to protect fat-soluble vitamins, extend feed shelf life and preserve nutrients.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "compound-antioxidant", href: "/products/poultry/antioxidants/compound-antioxidant" },
];

export default function PoultryAntioxidantsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Antioxidants" ariaLabel="Entering Agriprom Pakistan — Poultry Antioxidants" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Antioxidants"
          titleTop="Feed"
          titleBottom="Antioxidants"
          intro="Antioxidant technologies that prevent oxidation, preserve nutrients and keep feed stable from mill to feeder."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
