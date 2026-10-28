"use client";

import { useAdmin } from "@/components/admin/AdminShell";
import { useNow } from "@/components/admin/Activity";
import { initials, timeAgo, type Role } from "@/lib/admin/team";

export type TeamCardMember = { id: string; name: string; role: Role; lastSeen: string | null };

/** Avatars of everyone on the "admin-online" presence channel. */
export function OnlineNow() {
  const { online, me } = useAdmin();
  if (online.length === 0) return <div className="text-[13px] text-[#5B6178]">Nobody else is here right now.</div>;
  return (
    <ul className="m-0 flex list-none flex-wrap gap-[10px] p-0">
      {online.map((u) => (
        <li key={u.id} className="group relative">
          <span
            tabIndex={0}
            aria-label={`${u.name}${u.id === me?.id ? " (you)" : ""} — online`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE8F7] text-[13px] font-semibold text-[#16194A]"
          >
            {u.initials}
            <span className="absolute bottom-0 right-0 h-[11px] w-[11px] rounded-full border-2 border-white bg-[#22C55E]" />
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#16194A] px-2 py-1 text-[12px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {u.name}
            {u.id === me?.id && " (you)"}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Each team member with role and Online / last seen. */
export function TeamCard({ members }: { members: TeamCardMember[] }) {
  const { online, me } = useAdmin();
  const now = useNow();
  const onlineIds = new Set(online.map((u) => u.id));
  return (
    <div className="flex flex-col">
      {members.map((m) => {
        const isOnline = onlineIds.has(m.id);
        return (
          <div key={m.id} className="flex items-center gap-3 border-b border-[#EEF1F6] py-[9px] last:border-b-0">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DCE8F7] text-[12px] font-semibold text-[#16194A]">
              {initials(m.name)}
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-2 border-white bg-[#22C55E]" />
              )}
            </span>
            <div className="min-w-0 grow">
              <div className="truncate text-[14px] font-semibold">
                {m.name}
                {m.id === me?.id && <span className="ml-[6px] text-[12px] font-normal text-[#5B6178]">(you)</span>}
              </div>
              <div className="text-[12px] text-[#5B6178]">{m.role === "admin" ? "Admin" : "Editor"}</div>
            </div>
            {isOnline ? (
              <span className="text-[12px] font-semibold text-[#00733C]">Online</span>
            ) : (
              <span className="text-right text-[12px] text-[#5B6178]">
                {m.lastSeen ? `Seen ${timeAgo(m.lastSeen, now)}` : "Never signed in"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
