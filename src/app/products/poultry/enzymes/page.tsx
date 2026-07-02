import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase, type ShowcaseItem } from "@/components/product-detail/CategoryShowcase";

export const metadata: Metadata = {
  title: "Poultry Enzymes — Agriprom Pakistan | Feed Enzyme Technologies",
  description:
    "Explore Agriprom Pakistan's poultry enzyme portfolio — Compound Enzyme (NSP), CorGest M (Mannanase), CJ Bio Xylanase and PhytinGest (Phytase) — for better digestibility, feed efficiency and performance.",
};

const ITEMS: ShowcaseItem[] = [
  { slug: "compound-enzyme-nsp", href: "/products/poultry/compound-enzyme-nsp" },
  { slug: "corgest-m", href: "/products/poultry/corgest-m" },
  { slug: "xylanase", href: "/products/poultry/xylanase" },
  { slug: "phytingest", href: "/products/poultry/phytingest" },
];

export default function PoultryEnzymesPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Poultry Enzymes" ariaLabel="Entering Agriprom Pakistan — Poultry Enzymes" />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow="Poultry · Enzymes"
          titleTop="Poultry"
          titleBottom="Enzymes"
          intro="Scientifically proven feed enzymes that unlock more nutrition from every gram of feed — improving digestibility, gut health and performance across the flock."
          items={ITEMS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
