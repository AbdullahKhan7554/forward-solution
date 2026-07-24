import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { ContactFAQ } from "@/components/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact — Agriprom Pakistan | Talk To Our Animal Health Experts",
  description:
    "Reach the Agriprom Pakistan team for animal health, veterinary pharmaceuticals, feed additives and animal nutrition. Based in Lahore — open 24 hours.",
  alternates: { canonical: "https://agriprompakistan.com/contact-us" },
};

/**
 * CONTACT — "Scene 11 of the same film". Built scene by scene on the shared
 * homepage shell: one IntroProvider clock, the "First Light" Preloader
 * re-captioned, the floating Navbar and the shared Footer. Each scene owns the
 * homepage's breathing rhythm; backgrounds alternate base → pure as one film.
 *
 *   01 — Hero   02 — Reach Us & Find Us (details + map)   03 — FAQ
 *   ·   Premium Footer (reused)
 */
export default function ContactPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°11 — The Open Door" ariaLabel="Entering Agriprom Pakistan — Contact" />
      <Navbar />
      <main>
        <ContactHero />
        <ContactLocation />
        <ContactFAQ />
      </main>
      <Footer />
    </IntroProvider>
  );
}
