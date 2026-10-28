"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { touchLastSeen } from "@/app/admin/actions";
import { initials, type AdminUser } from "@/lib/admin/team";
import { RouteProgress } from "@/components/admin/RouteProgress";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Activity", href: "/admin/activity" },
  { label: "Team", href: "/admin/team", adminOnly: true },
];

export type OnlineUser = { id: string; name: string; initials: string };
type AdminContextValue = { me: AdminUser | null; online: OnlineUser[] };

const AdminContext = createContext<AdminContextValue>({ me: null, online: [] });

/** The signed-in user and who else is in the admin right now. */
export const useAdmin = () => useContext(AdminContext);

/** Joins the "admin-online" presence channel and pings last_seen_at every 60s. */
function usePresence(id: string | null, name: string) {
  const [online, setOnline] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!id) return setOnline([]);
    const supabase = createClient();
    const channel = supabase.channel("admin-online", { config: { presence: { key: id } } });
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<OnlineUser>();
        setOnline(Object.values(state).flatMap((metas) => metas.slice(0, 1)));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void channel.track({ id, name, initials: initials(name) });
      });

    const ping = () => void touchLastSeen().catch(() => {});
    ping();
    const timer = setInterval(ping, 60_000);
    return () => {
      clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [id, name]);

  return online;
}

/** Admin chrome: sidebar + main column. The login page renders bare. */
export function AdminShell({ me, children }: { me: AdminUser | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const online = usePresence(pathname === "/admin/login" ? null : (me?.id ?? null), me?.name ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  // Mobile drawer: close on navigation, Esc, or growing past lg; lock page scroll while open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logOut() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FA] lg:flex-row">
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#16194A] pl-4 pr-1 text-white lg:hidden">
        <div className="text-[15px] font-bold tracking-[0.5px]">
          AGRIPROM <span className="text-[#4ADE80]">PAKISTAN</span>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-[#232766]"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>
      {menuOpen && (
        <div aria-hidden="true" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-[#0B0D26]/60 lg:hidden" />
      )}
      <nav
        id="admin-menu"
        aria-label="Admin menu"
        className={`fixed left-0 top-0 z-50 box-border flex h-[100dvh] w-[260px] max-w-[85vw] shrink-0 flex-col gap-[6px] overflow-y-auto bg-[#16194A] px-4 py-7 text-white transition-transform duration-200 lg:sticky lg:z-auto lg:h-screen lg:w-[240px] lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:transition-none ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-3 pb-7 text-[18px] font-bold leading-[1.1] tracking-[0.5px]">
          AGRIPROM
          <br />
          <span className="text-[#4ADE80]">PAKISTAN</span>
          <div className="mt-[6px] text-[11px] font-medium tracking-[1px] text-[#C7CBE6]">
            ADMIN PANEL
          </div>
        </div>
        {NAV.filter((item) => !item.adminOnly || me?.role === "admin").map((item) =>
          isActive(item.href) ? (
            <Link
              key={item.href}
              href={item.href}
              aria-current="page"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-[#008848] p-3 text-[14px] font-semibold text-white no-underline hover:bg-[#007A40] hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg p-3 text-[14px] text-[#E4E7F5] no-underline hover:bg-[#232766] hover:text-white active:bg-[#2A2F6B]"
            >
              {item.label}
            </Link>
          ),
        )}
        <div className="grow" />
        {online.length > 0 && (
          <div className="px-3 pb-3">
            <div className="mb-2 text-[11px] font-medium tracking-[1px] text-[#C7CBE6]">ONLINE NOW</div>
            <div className="flex flex-wrap gap-[6px]">
              {online.map((u) => (
                <span
                  key={u.id}
                  title={u.name}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2F6B] text-[12px] font-semibold"
                >
                  {u.initials}
                  <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-2 border-[#16194A] bg-[#4ADE80]" />
                </span>
              ))}
            </div>
          </div>
        )}
        {me && (
          <div className="flex items-center gap-[10px] border-t border-[#2A2F6B] px-3 pt-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#008848] text-[12px] font-semibold">
              {initials(me.name)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{me.name}</div>
              <div className="text-[11px] text-[#C7CBE6]">{me.role === "admin" ? "Admin" : "Editor"}</div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={logOut}
          className="rounded-lg p-3 text-left text-[14px] text-[#E4E7F5] hover:bg-[#232766] hover:text-white"
        >
          Log out
        </button>
      </nav>
      <main className="box-border flex min-w-0 grow flex-col gap-[22px] px-4 py-5 md:px-6 lg:px-9 lg:py-7">
        <AdminContext.Provider value={{ me, online }}>{children}</AdminContext.Provider>
      </main>
    </div>
  );
}
