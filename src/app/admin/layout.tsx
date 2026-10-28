import type { Metadata } from "next";
import localFont from "next/font/local";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin/session";
import "./admin.css";

// Admin type: Inter body + Manrope display, at the weights the admin design uses.
const inter = localFont({
  src: "../../fonts/inter-latin-var.woff2",
  variable: "--font-admin-sans",
  display: "swap",
  weight: "400 700",
});

const manrope = localFont({
  src: "../../fonts/manrope-latin-var.woff2",
  variable: "--font-admin-display",
  display: "swap",
  weight: "700 800",
});

export const metadata: Metadata = {
  title: "Admin — Agriprom Pakistan",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  return (
    <div
      className={`admin-ui ${inter.variable} ${manrope.variable} min-h-screen text-[#1B1F3B] [font-family:var(--font-admin-sans),sans-serif]`}
    >
      <AdminShell me={session?.me ?? null}>{children}</AdminShell>
    </div>
  );
}
