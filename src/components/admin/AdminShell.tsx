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
      <Suspense fallback={null}>
        <RouteProgress />
      </Suspense>
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
        {NAV.filter((item) => !item.adminOnly || me?.role === "admin").map((item) =>
          isActive(item.href) ? (
            <Link
              key={item.href}
              href={item.href}
              aria-current="page"
              className="rounded-lg bg-[#008848] p-3 text-[14px] font-semibold text-white no-underline hover:bg-[#007A40] hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
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
      <main className="box-border flex min-w-0 grow flex-col gap-[22px] px-9 py-7">
        <AdminContext.Provider value={{ me, online }}>{children}</AdminContext.Provider>
      </main>
    </div>
  );
}
