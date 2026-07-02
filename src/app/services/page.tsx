import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { ServicesProcess } from "@/components/services/ServicesProcess";
import { ServicesBenefits } from "@/components/services/ServicesBenefits";
import { ServicesCTA } from "@/components/services/ServicesCTA";

export const metadata: Metadata = {
  title: "Services — Agriprom Pakistan | Technical Support & Scientific Consultation",
  description:
    "Professional technical support, scientific consultation, product guidance and long-term partnership solutions from Agriprom Pakistan for veterinarians, distributors and livestock producers.",
  alternates: { canonical: "https://agriprompakistan.com/services" },
};

/**
 * SERVICES — another chapter of the same premium film. Built scene by scene on
 * the shared homepage shell: one IntroProvider clock, the "First Light"
 * Preloader re-captioned, the floating Navbar and the shared Footer. Each scene
 * owns the homepage's py-[16vh] breathing rhythm; backgrounds alternate
 * base → pure so every seam reads as one continuous experience.
 *
 *   01 — Hero   02 — Core Services   03 — How We Work   04 — Why Agriprom   07 — CTA
 */
export default function ServicesPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Expertise" ariaLabel="Entering Agriprom Pakistan — Services" />
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesOverview />
        <ServicesProcess />
        <ServicesBenefits />
        <ServicesCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
