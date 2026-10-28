import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { TeamTable, type TeamMember } from "@/components/admin/TeamTable";
import { isRole } from "@/lib/admin/team";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.me.role !== "admin") redirect("/admin");

  const { supabase, me } = session;
  const [profilesRes, activityRes] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, role, last_seen_at, created_at").order("created_at"),
    supabase.from("activity_log").select("user_id").neq("action", "logged_in"),
  ]);
  const error = profilesRes.error ?? activityRes.error;

  const changes = new Map<string, number>();
  (activityRes.data ?? []).forEach((a) => a.user_id && changes.set(a.user_id, (changes.get(a.user_id) ?? 0) + 1));

  const members: TeamMember[] = (profilesRes.data ?? []).map((p) => ({
    id: p.id,
    name: p.full_name || p.email?.split("@")[0] || "User",
    email: p.email ?? "",
    role: isRole(p.role) ? p.role : "editor",
    lastSeen: p.last_seen_at,
    changes: changes.get(p.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="m-0 text-[26px] font-bold">Team</h1>
        <div className="mt-1 text-[13px] text-[#5B6178]">
          Invite people to the admin panel. Editors manage products and blogs; admins can also delete and manage the team.
        </div>
      </div>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load the team: {error.message}
        </p>
      ) : (
        <TeamTable members={members} meId={me.id} />
      )}
    </div>
  );
}
