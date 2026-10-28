"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { changeRole, inviteUser, removeUser } from "@/app/admin/team/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Pending } from "@/components/admin/Spinner";
import { createClient } from "@/lib/supabase/client";
import { ROLES, initials, timeAgo, type Role } from "@/lib/admin/team";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastSeen: string | null;
  changes: number;
};

// md+: the 6-column table (scrolls sideways on tablet). Phone: each member is a card.
const COLS = "md:grid-cols-[2fr_2fr_1fr_1.2fr_0.8fr_0.9fr]";
const HEAD = `hidden ${COLS} gap-4 px-5 md:grid`;
const ROW = `grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-4 ${COLS} md:gap-4 md:px-5 md:py-3`;
const actBtn =
  "flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[#D5DAE6] bg-white md:block md:min-h-0 md:flex-none md:rounded-none md:border-0 md:bg-transparent";
const card = "rounded-xl border border-[#E3E7EF] bg-white px-5 py-[18px]";
const label = "flex flex-col gap-[6px] text-[13px] font-semibold";
const field =
  "rounded-lg border border-[#D5DAE6] bg-white px-3 py-[10px] text-[14px] font-normal text-[#1B1F3B] [font-family:inherit]";
const control =
  "rounded-lg border border-[#D5DAE6] bg-white px-2 py-[7px] text-[13px] text-[#1B1F3B] [font-family:inherit] disabled:opacity-60";

export function TeamTable({ members, meId }: { members: TeamMember[]; meId: string }) {
  const router = useRouter();
  const toast = useToast();
  const { online } = useAdmin();
  const onlineIds = new Set(online.map((u) => u.id));
  const [invite, setInvite] = useState({ name: "", email: "", role: "editor" as Role });
  const [inviting, startInvite] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // keep "5 min ago" fresh, and pick up new activity (change counts) as it happens
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    const supabase = createClient();
    const channel = supabase
      .channel("admin-team-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, () => router.refresh())
      .subscribe();
    return () => {
      clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  function sendInvite(e: FormEvent) {
    e.preventDefault();
    startInvite(async () => {
      const res = await inviteUser(invite);
      if (res.ok) {
        toast.success(`Invite sent to ${invite.email.trim()}`);
        setInvite({ name: "", email: "", role: "editor" });
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  async function run(id: string, action: () => Promise<{ ok: true } | { ok: false; error: string }>, done: string) {
    setBusyId(id);
    try {
      const res = await action();
      if (!res.ok) return toast.error(res.error);
      toast.success(done);
      setConfirming(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <form onSubmit={sendInvite} className={`${card} flex flex-col items-stretch gap-[14px] md:flex-row md:flex-wrap md:items-end lg:flex-nowrap`}>
        <div className="md:mr-2 md:basis-full md:self-center lg:basis-auto">
          <div className="text-[15px] font-semibold">Invite user</div>
          <div className="mt-[2px] text-[12px] text-[#5B6178]">They&apos;ll get an email to set a password.</div>
        </div>
        <label className={`${label} grow`}>
          Name
          <input
            required
            value={invite.name}
            onChange={(e) => setInvite((f) => ({ ...f, name: e.target.value }))}
            className={field}
          />
        </label>
        <label className={`${label} grow`}>
          Email
          <input
            type="email"
            required
            value={invite.email}
            onChange={(e) => setInvite((f) => ({ ...f, email: e.target.value }))}
            className={field}
          />
        </label>
        <label className={label}>
          Role
          <select
            value={invite.role}
            onChange={(e) => setInvite((f) => ({ ...f, role: e.target.value as Role }))}
            className={field}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={inviting}
          className="rounded-lg border-none bg-[#008848] px-5 py-[11px] text-[14px] font-semibold text-white [font-family:inherit] hover:bg-[#007A40] disabled:opacity-60"
        >
          <Pending pending={inviting} label="Sending…">Send invite</Pending>
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-[#E3E7EF] bg-white">
        <div className="overflow-x-auto">
        <div className="md:min-w-[860px] lg:min-w-0">
        <div
          className={`${HEAD} border-b border-[#E3E7EF] bg-[#F8F9FC] py-3 text-[12px] font-semibold tracking-[0.5px] text-[#5B6178]`}
        >
          <span>NAME</span>
          <span>EMAIL</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span>CHANGES</span>
          <span>ACTIONS</span>
        </div>

        {members.length === 0 && (
          <div className="border-b border-[#EEF1F6] px-5 py-8 text-center text-[14px] text-[#5B6178]">
            No users yet.
          </div>
        )}

        {members.map((m) => {
          const isMe = m.id === meId;
          const isOnline = onlineIds.has(m.id);
          const busy = busyId === m.id;
          return (
            <div key={m.id} className={`${ROW} items-center border-b border-[#EEF1F6] py-3 text-[14px] transition-colors hover:bg-[#F8F9FC]`}>
              <div className="col-span-2 flex min-w-0 items-center gap-[10px] md:col-span-1">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE8F7] text-[13px] font-semibold text-[#16194A]">
                  {initials(m.name)}
                </span>
                <span className="truncate font-semibold">
                  {m.name}
                  {isMe && <span className="ml-[6px] text-[12px] font-normal text-[#5B6178]">(you)</span>}
                </span>
              </div>
              <span className="col-span-2 truncate text-[#5B6178] md:col-span-1">{m.email}</span>
              {isMe ? (
                <span className="text-[#5B6178]">{m.role === "admin" ? "Admin" : "Editor"}</span>
              ) : (
                <select
                  aria-label={`Role for ${m.name}`}
                  value={m.role}
                  disabled={busy}
                  onChange={(e) =>
                    run(m.id, () => changeRole(m.id, e.target.value as Role), `${m.name} is now ${e.target.value}`)
                  }
                  className={`${control} justify-self-start`}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              )}
              {isOnline ? (
                <span className="flex items-center gap-[6px] text-[13px] font-semibold text-[#00733C]">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  Online now
                </span>
              ) : (
                <span className="text-[13px] text-[#5B6178]">
                  {m.lastSeen ? `Last seen ${timeAgo(m.lastSeen, now)}` : "Never signed in"}
                </span>
              )}
              <span className="hidden text-[#5B6178] md:block">{m.changes}</span>
              {isMe ? (
                <span className="hidden md:block" />
              ) : confirming === m.id ? (
                <div role="group" aria-label={`Remove ${m.name}?`} className="col-span-2 flex items-center gap-[10px] text-[13px] font-semibold md:col-span-1">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(m.id, () => removeUser(m.id), `${m.name} removed`)}
                    className={`${actBtn} text-[#B42318] disabled:opacity-60`}
                  >
                    <Pending pending={busy} label="Removing…">Confirm</Pending>
                  </button>
                  <button type="button" disabled={busy} onClick={() => setConfirming(null)} className={`${actBtn} text-[#5B6178] hover:text-[#1B1F3B]`}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(m.id)}
                  className={`${actBtn} col-span-2 text-[13px] font-semibold text-[#B42318] hover:text-[#8A1A12] hover:underline md:col-span-1 md:justify-self-start`}
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
        </div>
        </div>
      </div>
    </>
  );
}
