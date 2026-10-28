// Server-only (uses cookies and the service-role client).
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRole, type ActivityAction, type AdminUser, type EntityType } from "@/lib/admin/team";

/** Session client + the signed-in user's profile, or null when signed out. Missing profile → editor. */
export async function getAdminSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email ?? user.email ?? "";
  const me: AdminUser = {
    id: user.id,
    name: profile?.full_name || email.split("@")[0] || "User",
    email,
    role: isRole(profile?.role) ? profile.role : "editor",
  };
  return { supabase, me };
}

/** Records an action in activity_log. Never fails the caller — logging is best-effort. */
export async function logActivity(
  userId: string,
  action: ActivityAction,
  entity?: { type?: EntityType; id?: string | null; name?: string | null },
) {
  try {
    const { error } = await createAdminClient()
      .from("activity_log")
      .insert({
        user_id: userId,
        action,
        entity_type: entity?.type ?? null,
        entity_id: entity?.id ?? null,
        entity_name: entity?.name ?? null,
      });
    if (error) console.error("activity_log insert failed:", error.message);
  } catch (e) {
    console.error("activity_log insert failed:", e);
  }
}
