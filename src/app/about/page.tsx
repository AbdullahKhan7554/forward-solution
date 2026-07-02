import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutWhoWeAre } from "@/components/about/AboutWhoWeAre";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutMissionVision } from "@/components/about/AboutMissionVision";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutLeadership } from "@/components/about/AboutLeadership";
import { AboutGlobalPresence } from "@/components/about/AboutGlobalPresence";
import { AboutWhyChoose } from "@/components/about/AboutWhyChoose";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About — Agriprom Pakistan | Advancing Animal Health Through Science",
  description:
    "Agriprom Pakistan delivers globally trusted animal health and nutrition solutions that empower veterinarians, livestock producers and distributors across Pakistan through scientific excellence and long-term partnerships.",
};

/**
 * ABOUT US — Chapter Two of the same cinematic film.
 *
 * One shared shell (the homepage's): a single IntroProvider clock, the
 * "First Light" Preloader re-captioned for this chapter, the floating Navbar and
 * the shared Footer. Scenes flow in production order; each owns its own vertical
 * rhythm (the same py-[16vh]–[20vh] breathing cadence as the homepage) and the
 * backgrounds alternate base → pure so every seam reads as one continuous film.
 *
 *   01 — The Origin (Hero)      04 — Mission & Vision     07 — Global Presence
 *   02 — Who We Are             05 — Core Values          08 — Why Choose Agriprom
 *   03 — Our Story (Timeline)   06 — Leadership           09 — CTA · 10 — Footer
 */
export default function AboutPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Origin" ariaLabel="Entering Agriprom Pakistan — About" />
      <Navbar />
      <main>
        <AboutHero />
        <AboutWhoWeAre />
        <AboutTimeline />
        <AboutMissionVision />
        <AboutValues />
        <AboutLeadership />
        <AboutGlobalPresence />
        <AboutWhyChoose />
        <AboutTeam />
        <AboutCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
