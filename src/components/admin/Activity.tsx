"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo, type ActivityAction } from "@/lib/admin/team";
import { ACTION_LABEL, entryHref, toEntry, type ActivityEntry, type ActivityRow } from "@/lib/admin/activity";

const ICON: Record<ActivityAction, { tone: string; path: React.ReactNode }> = {
  created: { tone: "bg-[#E6F4EC] text-[#00733C]", path: <path d="M12 5v14M5 12h14" /> },
  updated: { tone: "bg-[#E7EFFA] text-[#0D4FA0]", path: <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" /> },
  deleted: { tone: "bg-[#FEF3F2] text-[#B42318]", path: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /> },
  published: { tone: "bg-[#E6F4EC] text-[#00733C]", path: <path d="M5 12l5 5L20 7" /> },
  hidden: {
    tone: "bg-[#EEF1F6] text-[#3D4360]",
    path: <path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-3 3.4M6.6 6.6C4.3 8.2 3 12 3 12s4 6 9 6c1.5 0 2.9-.4 4.1-1" />,
  },
  logged_in: { tone: "bg-[#ECEDF7] text-[#16194A]", path: <path d="M10 17l5-5-5-5M15 12H3M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" /> },
};

export function ActionIcon({ action }: { action: ActivityAction }) {
  const { tone, path } = ICON[action] ?? ICON.updated;
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {path}
      </svg>
    </span>
  );
}

/** Re-renders every minute so "5 min ago" stays true. */
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function ActivityLine({ entry, names, now }: { entry: ActivityEntry; names: Record<string, string>; now: number }) {
  const who = (entry.userId && names[entry.userId]) || "Someone";
  const href = entryHref(entry);
  const thing = entry.entityName ?? (entry.entityType ? `a ${entry.entityType}` : null);
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-[9px] transition-colors hover:bg-[#F8F9FC]">
      <ActionIcon action={entry.action} />
      <div className="min-w-0 grow text-[14px] leading-[1.4]">
        <span className="font-semibold">{who}</span> {ACTION_LABEL[entry.action] ?? entry.action}
        {entry.action !== "logged_in" && thing && (
          <>
            {" "}
            {href ? (
              <Link href={href} className="font-semibold text-[#0D4FA0] no-underline hover:text-[#008848] hover:underline">
                {thing}
              </Link>
            ) : (
              <span className="font-semibold">{thing}</span>
            )}
          </>
        )}
        <span className="text-[#5B6178]"> · {timeAgo(entry.createdAt, now)}</span>
      </div>
    </div>
  );
}

/** Dashboard feed: the latest entries, with new ones streamed in via Realtime. */
export function ActivityFeed({
  initial,
  names,
  limit = 15,
}: {
  initial: ActivityEntry[];
  names: Record<string, string>;
  limit?: number;
}) {
  const [entries, setEntries] = useState(initial);
  const now = useNow();

  useEffect(() => setEntries(initial), [initial]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-dashboard-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        const entry = toEntry(payload.new as ActivityRow);
        setEntries((list) => [entry, ...list.filter((x) => x.id !== entry.id)].slice(0, limit));
      })
      .subscribe();
    return () => void supabase.removeChannel(channel);
  }, [limit]);

  if (entries.length === 0) {
    return <div className="py-6 text-center text-[14px] text-[#5B6178]">No activity yet.</div>;
  }
  return (
    <div aria-live="polite" className="-mx-2 flex flex-col">
      {entries.map((e) => (
        <ActivityLine key={e.id} entry={e} names={names} now={now} />
      ))}
    </div>
  );
}

/** Refreshes a server-rendered page whenever new activity is logged. */
export function LiveRefresh() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-activity-log")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, () => router.refresh())
      .subscribe();
    return () => void supabase.removeChannel(channel);
  }, [router]);
  return null;
}
