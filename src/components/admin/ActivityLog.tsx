"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { clearActivity, deleteActivity, type ClearScope } from "@/app/admin/activity/actions";
import { ActivityLine } from "@/components/admin/Activity";
import { Pending } from "@/components/admin/Spinner";
import { useToast } from "@/components/admin/Toast";
import type { ActivityEntry } from "@/lib/admin/activity";

const CLEAR_OPTIONS: { scope: ClearScope; label: string; confirm: string }[] = [
  { scope: "30", label: "Older than 30 days", confirm: "Delete all entries older than 30 days?" },
  { scope: "90", label: "Older than 90 days", confirm: "Delete all entries older than 90 days?" },
  { scope: "all", label: "Everything", confirm: "Delete the entire activity log?" },
];

const btn =
  "rounded-lg px-3 py-[7px] text-[13px] font-semibold [font-family:inherit] disabled:opacity-60";
const btnSecondary = `${btn} border border-[#D5DAE6] bg-white text-[#1B1F3B] hover:border-[#B8C0D4] hover:bg-[#F8F9FC]`;
const btnDanger = `${btn} border-none bg-[#B42318] text-white`;
const checkbox = "h-4 w-4 shrink-0 accent-[#16194A]";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  });

type Confirm = { kind: "selected" } | { kind: "clear"; scope: ClearScope };

/**
 * The /admin/activity list. Admins also get per-row delete, multi-select and "Clear log";
 * editors see the plain list. `children` is the footer (pager) inside the card.
 */
export function ActivityLog({
  entries,
  names,
  now,
  isAdmin,
  emptyText,
  children,
}: {
  entries: ActivityEntry[];
  names: Record<string, string>;
  now: number;
  isAdmin: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, startBusy] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // drop selections that left the page (deleted, or another page of results)
  useEffect(() => {
    setSelected((s) => new Set([...s].filter((id) => entries.some((e) => e.id === id))));
  }, [entries]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  const allSelected = entries.length > 0 && selected.size === entries.length;
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  function remove(ids: string[]) {
    startBusy(async () => {
      try {
        const res = await deleteActivity(ids);
        if (!res.ok) return toast.error(res.error);
        toast.success("Deleted");
        setSelected(new Set());
        setConfirm(null);
        router.refresh();
      } catch {
        toast.error("Couldn't delete. Please try again.");
      }
    });
  }

  function clear(scope: ClearScope) {
    startBusy(async () => {
      try {
        const res = await clearActivity(scope);
        if (!res.ok) return toast.error(res.error);
        toast.success(res.deleted ? `Deleted ${res.deleted} ${res.deleted === 1 ? "entry" : "entries"}` : "Nothing to clear");
        setSelected(new Set());
        setConfirm(null);
        router.refresh();
      } catch {
        toast.error("Couldn't clear the log. Please try again.");
      }
    });
  }

  const confirmText =
    confirm?.kind === "selected"
      ? `Delete ${selected.size} selected ${selected.size === 1 ? "entry" : "entries"}?`
      : confirm
        ? CLEAR_OPTIONS.find((o) => o.scope === confirm.scope)!.confirm
        : "";

  return (
    <div className="rounded-xl border border-[#E3E7EF] bg-white px-2 py-2 md:px-3">
      {isAdmin && (
        <div className="flex flex-wrap items-center gap-[10px] border-b border-[#EEF1F6] px-2 pb-3 pt-1">
          {confirm ? (
            <div role="group" aria-label="Confirm delete" className="flex w-full flex-wrap items-center gap-[10px]">
              <span className="text-[14px] font-semibold text-[#B42318]">{confirmText}</span>
              <span className="text-[13px] text-[#5B6178]">This can&apos;t be undone.</span>
              <div className="flex gap-2 md:ml-auto">
                <button type="button" disabled={busy} onClick={() => setConfirm(null)} className={btnSecondary}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => (confirm.kind === "selected" ? remove([...selected]) : clear(confirm.scope))}
                  className={btnDanger}
                >
                  <Pending pending={busy} label="Deleting…">
                    Yes, delete
                  </Pending>
                </button>
              </div>
            </div>
          ) : (
            <>
              <label className="admin-tap flex items-center gap-2 text-[13px] font-semibold text-[#1B1F3B]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={entries.length === 0}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(entries.map((e) => e.id)))}
                  className={checkbox}
                />
                Select all
              </label>
              <button
                type="button"
                disabled={selected.size === 0 || busy}
                onClick={() => setConfirm({ kind: "selected" })}
                className={`${btn} border border-[#F1C5C0] bg-white text-[#B42318] hover:bg-[#FEF3F2]`}
              >
                Delete selected ({selected.size})
              </button>
              <div ref={menuRef} className="relative ml-auto">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  disabled={busy}
                  onClick={() => setMenuOpen((o) => !o)}
                  className={btnSecondary}
                >
                  Clear log ▾
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+6px)] z-20 flex w-[200px] flex-col rounded-lg border border-[#E3E7EF] bg-white p-1 shadow-[0_8px_24px_rgba(22,25,74,0.14)]"
                  >
                    {CLEAR_OPTIONS.map((o) => (
                      <button
                        key={o.scope}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirm({ kind: "clear", scope: o.scope });
                        }}
                        className={`rounded-md px-3 py-2 text-left text-[13px] font-medium hover:bg-[#F8F9FC] ${
                          o.scope === "all" ? "text-[#B42318]" : "text-[#1B1F3B]"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="py-8 text-center text-[14px] text-[#5B6178]">{emptyText}</div>
      ) : (
        entries.map((e) => (
          <div
            key={e.id}
            className="group flex flex-col border-b border-[#EEF1F6] last:border-b-0 md:flex-row md:items-center md:gap-3"
          >
            <div className="flex min-w-0 grow items-center">
              {isAdmin && (
                <label className="flex h-11 w-9 shrink-0 cursor-pointer items-center justify-center md:h-auto md:w-8">
                  <input
                    type="checkbox"
                    aria-label="Select entry"
                    checked={selected.has(e.id)}
                    onChange={() => toggle(e.id)}
                    className={checkbox}
                  />
                </label>
              )}
              <div className="min-w-0 grow">
                <ActivityLine entry={e} names={names} now={now} />
              </div>
            </div>
            <div className={`flex items-center gap-1 pb-2 md:pb-0 ${isAdmin ? "pl-[88px] md:pl-0" : "pl-[52px] md:pl-0"}`}>
              <time dateTime={e.createdAt} className="shrink-0 pr-2 text-[12px] tabular-nums text-[#5B6178]">
                {when(e.createdAt)}
              </time>
              {isAdmin && (
                <button
                  type="button"
                  aria-label="Delete entry"
                  title="Delete"
                  disabled={busy}
                  onClick={() => remove([e.id])}
                  className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#8A90A6] hover:bg-[#FEF3F2] hover:text-[#B42318] focus-visible:opacity-100 md:ml-0 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))
      )}
      {children}
    </div>
  );
}
