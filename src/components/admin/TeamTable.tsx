"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { changeRole, inviteUser, removeUser } from "@/app/admin/team/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
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

const GRID = "grid grid-cols-[2fr_2fr_1fr_1.2fr_0.8fr_0.9fr] gap-4 px-5";
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
      <form onSubmit={sendInvite} className={`${card} flex items-end gap-[14px]`}>
        <div className="mr-2 self-center">
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
          className="rounded-lg border-none bg-[#008848] px-5 py-[11px] text-[14px] font-semibold text-white [font-family:inherit] disabled:opacity-60"
        >
          {inviting ? "Sending…" : "Send invite"}
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-[#E3E7EF] bg-white">
        <div
          className={`${GRID} border-b border-[#E3E7EF] bg-[#F8F9FC] py-3 text-[12px] font-semibold tracking-[0.5px] text-[#5B6178]`}
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
            <div key={m.id} className={`${GRID} items-center border-b border-[#EEF1F6] py-3 text-[14px]`}>
              <div className="flex min-w-0 items-center gap-[10px]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE8F7] text-[13px] font-semibold text-[#16194A]">
                  {initials(m.name)}
                </span>
                <span className="truncate font-semibold">
                  {m.name}
                  {isMe && <span className="ml-[6px] text-[12px] font-normal text-[#5B6178]">(you)</span>}
                </span>
              </div>
              <span className="truncate text-[#5B6178]">{m.email}</span>
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
              <span className="text-[#5B6178]">{m.changes}</span>
              {isMe ? (
                <span />
              ) : confirming === m.id ? (
                <div role="group" aria-label={`Remove ${m.name}?`} className="flex items-center gap-[10px] text-[13px] font-semibold">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(m.id, () => removeUser(m.id), `${m.name} removed`)}
                    className="text-[#B42318] disabled:opacity-60"
                  >
                    {busy ? "Removing…" : "Confirm"}
                  </button>
                  <button type="button" disabled={busy} onClick={() => setConfirming(null)} className="text-[#5B6178]">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(m.id)}
                  className="justify-self-start text-[13px] font-semibold text-[#B42318]"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
