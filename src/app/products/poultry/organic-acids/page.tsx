import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Organic Acids (SCFA) — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry organic acid (SCFA) range — including ProPhorce SR 130 esterified butyric acid — for gut integrity, immunity and feed efficiency.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "prophorce-sr130", href: "/products/poultry/organic-acids-scfa/prophorce-sr130" },
];

export default function PoultryOrganicAcidsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Organic Acids" ariaLabel="Entering Agriprom Pakistan — Poultry Organic Acids" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Organic Acids (SCFA)"
          titleTop="Organic"
          titleBottom="Acids"
          intro="Short-chain fatty acid technologies that lower gut pH, strengthen intestinal integrity and improve feed efficiency across the flock."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
