import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { AdminShell } from "@/components/admin/AdminShell";

// Admin type: Inter body + Manrope display, at the weights the admin design uses.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-admin-display",
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Admin — Agriprom Pakistan",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${manrope.variable} min-h-screen text-[#1B1F3B] [font-family:var(--font-admin-sans),sans-serif]`}
    >
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
