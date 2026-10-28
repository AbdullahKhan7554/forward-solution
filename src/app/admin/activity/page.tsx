import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import type { ActivityAction } from "@/lib/admin/team";
import { LiveRefresh } from "@/components/admin/Activity";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { ACTION_LABEL, toEntry } from "@/lib/admin/activity";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const TZ_OFFSET = "+05:00"; // Asia/Karachi, no DST
const ACTIONS = Object.keys(ACTION_LABEL) as ActivityAction[];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const control =
  "rounded-lg border border-[#D5DAE6] bg-white px-3 py-[9px] text-[14px] text-[#1B1F3B] [font-family:inherit]";
const labelCls = "flex w-[calc(50%-7px)] flex-col gap-[6px] text-[12px] font-semibold text-[#5B6178] md:w-auto";
const pagerBtn =
  "admin-tap rounded-md border border-[#D5DAE6] bg-white px-3 py-[7px] text-[13px] text-[#1B1F3B] no-underline hover:border-[#B8C0D4] hover:bg-[#F8F9FC] hover:text-[#1B1F3B]";

type SearchParams = { user?: string; action?: string; from?: string; to?: string; page?: string };

const actionTitle = (a: ActivityAction) => (a === "logged_in" ? "Logged in" : a[0].toUpperCase() + a.slice(1));

export default async function AdminActivityPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { supabase } = session;

  const user = searchParams.user ?? "";
  const action = ACTIONS.includes(searchParams.action as ActivityAction) ? (searchParams.action as ActivityAction) : "";
  const from = DATE.test(searchParams.from ?? "") ? searchParams.from! : "";
  const to = DATE.test(searchParams.to ?? "") ? searchParams.to! : "";
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);
  const start = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("activity_log")
    .select("id, user_id, action, entity_type, entity_id, entity_name, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, start + PAGE_SIZE - 1);
  if (user) query = query.eq("user_id", user);
  if (action) query = query.eq("action", action);
  if (from) query = query.gte("created_at", `${from}T00:00:00${TZ_OFFSET}`);
  if (to) query = query.lte("created_at", `${to}T23:59:59.999${TZ_OFFSET}`);

  const [logRes, profilesRes] = await Promise.all([
    query,
    supabase.from("profiles").select("id, full_name, email").order("full_name"),
  ]);
  const error = logRes.error?.code === "PGRST103" ? null : (logRes.error ?? profilesRes.error);

  const names: Record<string, string> = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.id, p.full_name || p.email?.split("@")[0] || "User"]),
  );
  const entries = (logRes.data ?? []).map(toEntry);
  const total = logRes.count ?? 0;
  const filtered = Boolean(user || action || from || to);
  const now = Date.now();

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (user) params.set("user", user);
    if (action) params.set("action", action);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return `/admin/activity${qs ? `?${qs}` : ""}`;
  };
  const first = total ? start + 1 : 0;
  const last = Math.min(start + PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-5">
      <LiveRefresh />
      <div>
        <h1 className="m-0 text-[26px] font-bold">Activity</h1>
        <div className="mt-1 text-[13px] text-[#5B6178]">Everything the team has changed in the admin, newest first.</div>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-[14px] rounded-xl border border-[#E3E7EF] bg-white px-4 py-4 md:px-5">
        <label className={labelCls}>
          User
          <select name="user" defaultValue={user} className={control}>
            <option value="">Everyone</option>
            {Object.entries(names).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Action
          <select name="action" defaultValue={action} className={control}>
            <option value="">All actions</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {actionTitle(a)}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          From
          <input type="date" name="from" defaultValue={from} className={control} />
        </label>
        <label className={labelCls}>
          To
          <input type="date" name="to" defaultValue={to} className={control} />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg border-none bg-[#16194A] px-[18px] py-[10px] text-[14px] md:w-auto font-semibold text-white [font-family:inherit] hover:bg-[#232766]"
        >
          Apply
        </button>
        {filtered && (
          <Link href="/admin/activity" className="admin-tap py-[10px] text-[13px] font-semibold text-[#0D4FA0] hover:text-[#008848]">
            Clear filters
          </Link>
        )}
      </form>

      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load activity: {error.message}
        </p>
      ) : (
        <ActivityLog
          entries={entries}
          names={names}
          now={now}
          isAdmin={session.me.role === "admin"}
          emptyText={filtered ? "No activity matches these filters." : "No activity yet."}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF1F6] px-2 pb-1 pt-3 text-[13px] text-[#5B6178]">
            <span>
              Showing {first}–{last} of {total}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className={pagerBtn}>
                  Previous
                </Link>
              )}
              {last < total && (
                <Link href={pageHref(page + 1)} className={pagerBtn}>
                  Next
                </Link>
              )}
            </div>
          </div>
        </ActivityLog>
      )}
    </div>
  );
}
