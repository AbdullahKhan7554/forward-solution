import type { Metadata } from "next";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Agriprom Pakistan",
  description:
    "How Agriprom Pakistan collects, uses and protects your personal information — with transparency and responsibility.",
  alternates: { canonical: "https://agriprompakistan.com/privacy-policy" },
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
    id: "introduction",
    heading: "Introduction",
    paragraphs: [
      "Personal data is the data that can be used to identify or contact a person.",
      "The personal data you provide us through our forms or by any other means may be shared only within our organization and used by this Privacy Policy. We could also combine them with other data to provide and improve our products, services, content, and advertising.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "What Personal Information Do We Collect?",
    paragraphs: [
      "When you send an email, contact us through our electronic forms, check-in any product or application, request commercial credit, purchase a product, download an update from one of our applications, attend one of our technical or commercial events, or participate in online surveys, we may collect information such as your name, mailing address, telephone number, email address or contact preferences.",
    ],
  },
  {
    id: "purpose",
    heading: "Purpose of Treatment of Personal Data",
    paragraphs: [
      "The personal data we collect allows us to keep you informed about our products and updates on our applications. They also help us improve our services, content, and advertising.",
      "We also use personal data to help develop, deliver and improve our products, services, content, news, invitations, and advertisements.",
    ],
  },
  {
    id: "important-communications",
    heading: "Important Communications",
    paragraphs: [
      "We occasionally use personal information to send important notices regarding purchases and policy updates.",
    ],
  },
  {
    id: "marketing-preferences",
    heading: "Marketing Preferences",
    paragraphs: [
      <>
        If you do not wish to join our mailing list, you can exclude yourself anytime by
        sending an email to: <MailLink />.
      </>,
    ],
  },
  {
    id: "internal-research",
    heading: "Internal Research",
    paragraphs: [
      "We may also use your information for internal auditing, research, analytics and product improvements.",
    ],
  },
  {
    id: "promotional-campaigns",
    heading: "Promotional Campaigns",
    paragraphs: [
      "If you participate in promotions or surveys, your information may be used to manage these programs.",
    ],
  },
  {
    id: "contact-information",
    heading: "Contact Information",
    paragraphs: [
      <>
        For any questions about this Privacy Policy or the personal data we hold, please
        contact us at <MailLink /> or call +92 300 0801213.
      </>,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <IntroProvider>
      <Preloader caption="N°01 — Privacy" ariaLabel="Agriprom Pakistan — Privacy Policy" />
      <Navbar />
      <main>
        <LegalPage
          eyebrow="Legal"
          title="Privacy Policy"
          subheading="Your trust matters. We are committed to protecting your personal information with transparency and responsibility."
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
