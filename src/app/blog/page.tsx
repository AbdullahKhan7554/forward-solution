import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { ArticlesGrid } from "@/components/blog/ArticlesGrid";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Knowledge Center — Agriprom Pakistan | Animal Health Insights & Research",
  description:
    "Expert articles covering poultry, livestock, companion animals, veterinary medicine, nutrition and scientific innovations from the Agriprom Pakistan team.",
  alternates: { canonical: "https://agriprompakistan.com/blog" },
};

/**
 * BLOG LISTING (Knowledge Center) — the complete assembled page.
 *
 * One continuous film on the shared homepage shell: a single IntroProvider clock,
 * the "First Light" Preloader re-captioned, the floating Navbar and the shared
 * Footer. Each scene owns the homepage's py-[14vh]–[20vh] breathing rhythm; the
 * BlogFilters row lives inside ArticlesGrid, which owns the filter + Load More
 * state so filtering and pagination stay in one interactive boundary.
 *
 *   01 — Hero   02 — Featured Article   03/04 — Filters + All Articles   05 — Newsletter
 */
export default function BlogPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Knowledge" ariaLabel="Entering Agriprom Pakistan — Knowledge Center" />
      <Navbar />
      <main>
        <BlogHero />
        <FeaturedArticle />
        <ArticlesGrid />
        <NewsletterCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
