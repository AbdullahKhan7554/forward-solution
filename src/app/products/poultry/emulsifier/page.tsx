import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Emulsifiers — Agriprom Pakistan",
  description:
    "Agriprom Pakistan's poultry emulsifier range — including LysoLip lysophospholipid emulsifier — for better fat digestion, gut health and feed efficiency.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "lysolip", href: "/products/poultry/emulsifier/lysolip" },
];

export default function PoultryEmulsifierPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Emulsifiers" ariaLabel="Entering Agriprom Pakistan — Poultry Emulsifiers" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Emulsifier"
          titleTop="Feed"
          titleBottom="Emulsifiers"
          intro="Emulsifier technologies that improve fat emulsification, lipid digestion and energy utilization for stronger performance."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
