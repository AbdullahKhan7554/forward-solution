import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar/Navbar";
import { SceneThreshold } from "@/components/scenes/SceneThreshold";
import { Footer } from "@/components/layout/Footer";
import { getArticles } from "@/lib/blog";

// Below-the-fold scenes are split into their own chunks (still server-rendered,
// so the markup is identical) to keep the first-screen bundle lean.
const SceneUnfolding = dynamic(() => import("@/components/scenes/SceneUnfolding").then((m) => m.SceneUnfolding));
const SceneEcosystem = dynamic(() => import("@/components/scenes/SceneEcosystem").then((m) => m.SceneEcosystem));
const SceneJourney = dynamic(() => import("@/components/scenes/SceneJourney").then((m) => m.SceneJourney));
const ScenePartners = dynamic(() => import("@/components/scenes/ScenePartners").then((m) => m.ScenePartners));
const SceneInsights = dynamic(() => import("@/components/scenes/SceneInsights").then((m) => m.SceneInsights));
const SceneCTA = dynamic(() => import("@/components/scenes/SceneCTA").then((m) => m.SceneCTA));

export const metadata: Metadata = {
  alternates: { canonical: "https://agriprompakistan.com/" },
};

/**
 * Scene 01 - The Threshold. Perfected in isolation.
 * No preloader or IntroProvider here: the hero paints immediately and Navbar /
 * hero choreography start on mount (useIntro falls back to "revealing").
 */
export default async function HomePage() {
  const latest = (await getArticles())
    .slice(0, 3)
    .map(({ title, category, date, readingTime, excerpt, href, image }) => ({ title, category, date, readingTime, excerpt, href, image }));
  return (
    <>
      <Navbar />
      <main>
        <SceneThreshold />
        <SceneUnfolding />
        <SceneEcosystem />
        <SceneJourney />
        <ScenePartners />
        <SceneInsights blogPosts={latest} />
        <SceneCTA />
      </main>
      <Footer />
    </>
  );
}
