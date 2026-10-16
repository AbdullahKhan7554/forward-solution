import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Feed Hygienizer — Agriprom Pakistan",
  description: "Fresher feed, fewer toxin risks",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "moldcid", href: "/products/poultry/feed-hygienizer/moldcid" },
];

export default function PoultryFeedHygienizerPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Feed Hygienizer" ariaLabel="Entering Agriprom Pakistan — Poultry Feed Hygienizer" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Feed Hygienizer"
          titleTop="Feed"
          titleBottom="Hygienizer"
          intro="Fresher feed, fewer toxin risks"
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
