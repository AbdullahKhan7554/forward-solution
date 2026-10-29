import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { ProductHero } from "@/components/products/ProductHero";
import { Footer } from "@/components/layout/Footer";

// Below-the-fold scenes are split into their own chunks (still server-rendered,
// so the markup is identical) to keep the first-screen bundle lean.
const ProductQuality = dynamic(() => import("@/components/products/ProductQuality").then((m) => m.ProductQuality));
const ProductStats = dynamic(() => import("@/components/products/ProductStats").then((m) => m.ProductStats));
const ProductCategoryCards = dynamic(() => import("@/components/products/ProductCategoryCards").then((m) => m.ProductCategoryCards));
const ProductApplications = dynamic(() => import("@/components/products/ProductApplications").then((m) => m.ProductApplications));
const SceneCTA = dynamic(() => import("@/components/scenes/SceneCTA").then((m) => m.SceneCTA));

export const metadata: Metadata = {
  title: "Products — Agriprom Pakistan | Scientific Solutions for Animal Health",
  description:
    "Explore Agriprom Pakistan's complete portfolio of globally trusted animal nutrition, veterinary and livestock solutions — organised around every species and every stage of animal health.",
  alternates: { canonical: "https://agriprompakistan.com/products" },
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
 *   01 — The Portfolio (Hero)        04 — Categories
 *   02 — Quality Journey             05 — Applications
 *   03 — Stats                       06 — CTA · 07 — Footer (shared)
 */
export default function ProductsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Portfolio" ariaLabel="Entering Agriprom Pakistan — Products" />
      <Navbar />
      <main>
        <ProductHero />
        <ProductQuality />
        <ProductStats />
        <ProductCategoryCards />
        <ProductApplications />
        <SceneCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
