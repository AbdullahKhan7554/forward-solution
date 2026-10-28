"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Blogs", href: "/admin/blogs" },
];

/** Admin chrome: sidebar + main column. The login page renders bare. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <nav
        aria-label="Admin menu"
        className="sticky top-0 box-border flex h-screen w-[240px] shrink-0 flex-col gap-[6px] bg-[#16194A] px-4 py-7 text-white"
      >
        <div className="px-3 pb-7 text-[18px] font-bold leading-[1.1] tracking-[0.5px]">
          AGRIPROM
          <br />
          <span className="text-[#4ADE80]">PAKISTAN</span>
          <div className="mt-[6px] text-[11px] font-medium tracking-[1px] text-[#C7CBE6]">
            ADMIN PANEL
          </div>
        </div>
        {NAV.map((item) =>
          isActive(item.href) ? (
            <Link
              key={item.href}
              href={item.href}
              aria-current="page"
              className="rounded-lg bg-[#008848] p-3 text-[14px] font-semibold text-white no-underline"
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg p-3 text-[14px] text-[#E4E7F5] no-underline"
            >
              {item.label}
            </Link>
          ),
        )}
        <div className="grow" />
        <button
          type="button"
          onClick={logOut}
          className="p-3 text-left text-[14px] text-[#E4E7F5]"
        >
          Log out
        </button>
      </nav>
      <main className="box-border flex min-w-0 grow flex-col gap-[22px] px-9 py-7">{children}</main>
    </div>
  );
}
