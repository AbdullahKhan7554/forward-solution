import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FaqHero } from "@/components/faq/FaqHero";
import { FaqQuickNav } from "@/components/faq/FaqQuickNav";
import { FaqSection } from "@/components/faq/FaqSection";
import { FaqCTA } from "@/components/faq/FaqCTA";
import { FAQ_CATEGORIES } from "@/components/faq/faqData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Agriprom Pakistan",
  description:
    "Find answers to common questions about Agriprom Pakistan, our products, animal nutrition solutions, veterinary services, partnerships, orders, and customer support.",
  alternates: { canonical: "https://agriprompakistan.com/faq" },
};

/**
 * FAQ — "Scene 10 of the same film". Shares the homepage shell: one IntroProvider
 * clock, the "First Light" Preloader re-captioned, the floating Navbar and the
 * shared Footer. Each scene owns the homepage breathing rhythm.
 *
 *   01 Hero · 02 Quick Nav · 03–07 Category accordions · 08 Contact CTA
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((c) =>
    c.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <IntroProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Preloader caption="N°10 — The Answers" ariaLabel="Entering Agriprom Pakistan — FAQ" />
      <Navbar />
      <main>
        <FaqHero />
        <FaqQuickNav />
        {FAQ_CATEGORIES.map((category, i) => (
          <FaqSection
            key={category.id}
            category={category}
            index={i + 3}
            bg={i % 2 === 0 ? "base" : "pure"}
          />
        ))}
        <FaqCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
