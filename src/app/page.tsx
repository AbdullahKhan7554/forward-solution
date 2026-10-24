import dynamic from "next/dynamic";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { SceneThreshold } from "@/components/scenes/SceneThreshold";
import { Footer } from "@/components/layout/Footer";

// Below-the-fold scenes are split into their own chunks (still server-rendered,
// so the markup is identical) to keep the first-screen bundle lean.
const SceneUnfolding = dynamic(() => import("@/components/scenes/SceneUnfolding").then((m) => m.SceneUnfolding));
const SceneEcosystem = dynamic(() => import("@/components/scenes/SceneEcosystem").then((m) => m.SceneEcosystem));
const SceneJourney = dynamic(() => import("@/components/scenes/SceneJourney").then((m) => m.SceneJourney));
const ScenePartners = dynamic(() => import("@/components/scenes/ScenePartners").then((m) => m.ScenePartners));
const SceneInsights = dynamic(() => import("@/components/scenes/SceneInsights").then((m) => m.SceneInsights));
const SceneCTA = dynamic(() => import("@/components/scenes/SceneCTA").then((m) => m.SceneCTA));

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
