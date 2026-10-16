import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Phytogenic Anticoccidials — Agriprom Pakistan",
  description: "Plant-powered protection against coccidiosis.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "coxield", href: "/products/poultry/phytogenic-anticoccidials/coxield" },
];

export default function PoultryPhytogenicAnticoccidialsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Phytogenic Anticoccidials" ariaLabel="Entering Agriprom Pakistan — Poultry Phytogenic Anticoccidials" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Phytogenic Anticoccidials"
          titleTop="Phytogenic"
          titleBottom="Anticoccidials"
          intro="Plant-powered protection against coccidiosis."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
