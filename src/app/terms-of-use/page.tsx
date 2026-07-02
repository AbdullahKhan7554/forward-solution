import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Agriprom Pakistan",
  description:
    "The terms governing the use of the Agriprom Pakistan website, its content and its products.",
  alternates: { canonical: "https://agriprompakistan.com/terms-of-use" },
};

const MailLink = () => (
  <a
    href="mailto:info@agriprompakistan.com"
    className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors duration-200 ease-brand-out hover:text-primary-800 hover:decoration-accent-400"
  >
    info@agriprompakistan.com
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    id: "general-terms",
    heading: "General Terms",
    paragraphs: [
      "These terms govern your use of the Agriprom Pakistan website and the information it contains. Please review them carefully before using our products or website.",
    ],
  },
  {
    id: "product-information",
    heading: "Product Information",
    paragraphs: [
      "The contents of the products shown on this website are only informative references, so they should not be considered prescriptions.",
    ],
  },
  {
    id: "usage-disclaimer",
    heading: "Usage Disclaimer",
    paragraphs: [
      "Before using any product, please read the label and accompanying insert and follow all directions provided.",
    ],
  },
  {
    id: "copyright",
    heading: "Copyright",
    paragraphs: ["All rights reserved."],
  },
  {
    id: "restrictions",
    heading: "Restrictions",
    paragraphs: [
      "The content of work and research, field assessments, technical specifications, sales brochures and all additional information shown on this website may not be reproduced, stored, copied, distributed or published in any form without prior written permission from Agriprom Pakistan (Pvt) Ltd.",
    ],
  },
  {
    id: "legal-rights",
    heading: "Legal Rights",
    paragraphs: ["The company reserves the right to take appropriate legal action."],
  },
  {
    id: "contact",
    heading: "Contact",
    paragraphs: [
      <>
        For any questions about these Terms &amp; Conditions, please contact us at{" "}
        <MailLink /> or call +92 300 0801213.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Terms" ariaLabel="Agriprom Pakistan — Terms & Conditions" />
      <Navbar />
      <main>
        <LegalPage
          eyebrow="Legal"
          title="Terms & Conditions"
          subheading="Please review these terms carefully before using our products or website."
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
