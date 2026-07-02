import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductOverview } from "@/components/products/ProductOverview";
import { ProductCategories } from "@/components/products/ProductCategories";
import { FeaturedSolutions } from "@/components/products/FeaturedSolutions";
import { ProductApplications } from "@/components/products/ProductApplications";
import { ProductBrands } from "@/components/products/ProductBrands";
import { ProductQuality } from "@/components/products/ProductQuality";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Products — Agriprom Pakistan | Scientific Solutions for Animal Health",
  description:
    "Explore Agriprom Pakistan's complete portfolio of globally trusted animal nutrition, veterinary and livestock solutions — organised around every species and every stage of animal health.",
};

/**
 * PRODUCTS OVERVIEW — Chapter Three of the same cinematic film.
 *
 * One shared shell (the Homepage's): a single IntroProvider clock, the
 * "First Light" Preloader re-captioned for this chapter, the floating Navbar and
 * the shared Footer. Scenes flow in production order; each owns the same
 * py-[16vh]–[18vh] breathing cadence as the rest of the film and the backgrounds
 * alternate base → pure so every seam reads as one continuous experience.
 *
 *   01 — The Portfolio (Hero)        05 — Applications
 *   02 — The Ecosystem (Overview)    06 — International Brands
 *   03 — Categories                  07 — Quality Journey
 *   04 — Featured Solutions          08 — Footer (shared, reused)
 */
export default function ProductsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Portfolio" ariaLabel="Entering Agriprom Pakistan — Products" />
      <Navbar />
      <main>
        <ProductHero />
        <ProductOverview />
        <ProductCategories />
        <FeaturedSolutions />
        <ProductApplications />
        <ProductBrands />
        <ProductQuality />
      </main>
      <Footer />
    </IntroProvider>
  );
}
