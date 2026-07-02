import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { VisitOffice } from "@/components/contact/VisitOffice";
import { ContactMap } from "@/components/contact/ContactMap";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { FinalCTA } from "@/components/contact/FinalCTA";

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
 *   01 — Hero   02 — Contact Information   03 — Inquiry Form   04 — Visit Our Office
 *   05 — Google Map   06 — FAQ   07 — Final CTA   ·   Premium Footer (reused)
 */
export default function ContactPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°11 — The Open Door" ariaLabel="Entering Agriprom Pakistan — Contact" />
      <Navbar />
      <main>
        <ContactHero />
        <ContactInfo />
        <ContactForm />
        <VisitOffice />
        <ContactMap />
        <ContactFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
