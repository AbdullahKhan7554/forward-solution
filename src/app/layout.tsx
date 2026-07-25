import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Newsreader } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import "./globals.css";

/**
 * Type system (Design System v1.0 §2).
 * Licensed Söhne/Neue Haas are swapped for their closest open equivalents:
 * - display: Manrope   (geometric-humanist grotesque)
 * - body:    Inter     (quiet humanist sans)
 * - serif:   Newsreader (surgical editorial accent only)
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["italic", "normal"],
  weight: ["300", "400"],
  // serif is a surgical accent only; skip the auto fallback-metric override
  // (its values aren't published, which emits a harmless build warning).
  adjustFontFallback: false,
});

const SITE_URL = "https://agriprompakistan.com";
const SITE_NAME = "Agriprom Pakistan";
const SITE_TITLE = "Agriprom Pakistan — Advancing Animal Health Through Science";
const SITE_DESCRIPTION =
  "A science-driven animal health company delivering globally-qualified vaccines, biosecurity, nutraceuticals and nutrition across poultry, ruminant, aquaculture, equine and pet health.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/images/heroabout/h1.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/heroabout/h1.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Never disable zoom (Design System §15/§16).
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFBFC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
