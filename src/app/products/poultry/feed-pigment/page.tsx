import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Feed Pigment — Agriprom Pakistan",
  description: "Consistent color without compromise",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "canthaxanthin-lutein", href: "/products/poultry/feed-pigment/canthaxanthin-lutein" },
];

export default function PoultryFeedPigmentPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Feed Pigment" ariaLabel="Entering Agriprom Pakistan — Poultry Feed Pigment" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Feed Pigment"
          titleTop="Feed"
          titleBottom="Pigment"
          intro="Consistent color without compromise"
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
