import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { SceneThreshold } from "@/components/scenes/SceneThreshold";
import { SceneUnfolding } from "@/components/scenes/SceneUnfolding";
import { SceneInnovation } from "@/components/scenes/SceneInnovation";
import { SceneVision } from "@/components/scenes/SceneVision";
import { SceneEcosystem } from "@/components/scenes/SceneEcosystem";
import { SceneJourney } from "@/components/scenes/SceneJourney";
import { ScenePartners } from "@/components/scenes/ScenePartners";
import { SceneInsights } from "@/components/scenes/SceneInsights";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { Footer } from "@/components/layout/Footer";

/**
 * Scene 01 - The Threshold. Perfected in isolation.
 * IntroProvider is the shared clock; Preloader gates the reveal; Navbar and the
 * hero scene key their choreography off the same phase.
 */
export default function HomePage() {
  return (
    <IntroProvider>
      <Preloader />
      <Navbar />
      <main>
        <SceneThreshold />
        <SceneUnfolding />
        <SceneInnovation />
        <SceneVision />
        <SceneEcosystem />
        <SceneJourney />
        <ScenePartners />
        <SceneInsights />
        <SceneCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
