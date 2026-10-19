import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Bile Acids — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry bile acid range for improved fat emulsification, lipid digestion, liver health and feed efficiency.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "bilepro", href: "/products/poultry/bile-acids/bilepro" },
];

export default function PoultryBileAcidsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Bile Acids" ariaLabel="Entering Agriprom Pakistan — Poultry Bile Acids" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Bile Acids"
          titleTop="Bile"
          titleBottom="Acids"
          intro="Bile acid technologies that improve fat emulsification, lipid digestion, liver health and energy utilization."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
