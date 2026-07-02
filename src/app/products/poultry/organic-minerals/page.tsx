import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Organic Minerals — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry organic mineral range — including Minlex Poultry biochelated trace minerals — for immunity, growth, skeletal development and feed efficiency.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "minlex-poultry", href: "/products/poultry/organic-minerals/minlex-poultry" },
];

export default function PoultryOrganicMineralsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Organic Minerals" ariaLabel="Entering Agriprom Pakistan — Poultry Organic Minerals" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Organic Minerals"
          titleTop="Organic"
          titleBottom="Minerals"
          intro="Amino-acid chelated (biochelated) trace minerals with high bioavailability — for better absorption, immunity and productivity."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
