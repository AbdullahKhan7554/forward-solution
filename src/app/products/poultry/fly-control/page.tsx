import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Fly Control — Agriprom Pakistan",
  description: "Break the fly cycle at the source.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "antifly", href: "/products/poultry/fly-control/antifly" },
];

export default function PoultryFlyControlPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Fly Control" ariaLabel="Entering Agriprom Pakistan — Poultry Fly Control" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Fly Control"
          titleTop="Fly"
          titleBottom="Control"
          intro="Break the fly cycle at the source."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
