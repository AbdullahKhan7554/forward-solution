import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Alternative Protein — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry alternative protein range — sustainable, highly digestible protein sources that reduce reliance on conventional feed proteins.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "msg-single-cell-protein", href: "/products/poultry/alternative-protein/msg-single-cell-protein" },
];

export default function PoultryAlternativeProteinPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Alternative Protein" ariaLabel="Entering Agriprom Pakistan — Alternative Protein" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Alternative Protein"
          titleTop="Alternative"
          titleBottom="Protein"
          intro="Sustainable, highly digestible protein sources that support growth performance and reduce reliance on conventional feed proteins."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
