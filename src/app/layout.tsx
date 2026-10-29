import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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
// Self-hosted latin variable files (src/fonts) so builds never fetch Google Fonts.
const manrope = localFont({
  src: "../fonts/manrope-latin-var.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "300 600",
});

const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "400 500",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/newsreader-latin-var.woff2", weight: "300 400", style: "normal" },
    { path: "../fonts/newsreader-italic-latin-var.woff2", weight: "300 400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  // serif is a surgical accent only; no fallback-metric override.
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
    images: [{ url: "/images/heroabout/h1.webp", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/heroabout/h1.webp"],
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
