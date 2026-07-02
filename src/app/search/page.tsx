import type { Metadata } from "next";
import { Suspense } from "react";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchResultsView } from "@/components/search/SearchResultsView";

export const metadata: Metadata = {
  title: "Search — Agriprom Pakistan",
  description:
    "Search Agriprom Pakistan — products, categories, services, pages and knowledge-center articles.",
  alternates: { canonical: "https://agriprompakistan.com/search" },
  robots: { index: false, follow: true },
};

/**
 * SEARCH — the dedicated results page, on the shared homepage shell (one
 * IntroProvider clock, the re-captioned Preloader, the floating Navbar and the
 * shared Footer). The interactive results view reads the ?q= param, so it sits
 * behind a Suspense boundary (Next requirement for useSearchParams).
 */
export default function SearchPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Search" ariaLabel="Agriprom Pakistan — Search" />
      <Navbar />
      <main>
        <Suspense fallback={null}>
          <SearchResultsView />
        </Suspense>
      </main>
      <Footer />
    </IntroProvider>
  );
}
