"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminSession, logActivity } from "@/lib/admin/session";

/** Called by the login page right after a successful sign-in. */
export async function logLogin() {
  const session = await getAdminSession();
  if (!session) return;
  await logActivity(session.me.id, "logged_in");
}

/** Heartbeat from the admin chrome — keeps profiles.last_seen_at current while the admin is open. */
export async function touchLastSeen() {
  const session = await getAdminSession();
  if (!session) return;
  await createAdminClient()
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", session.me.id);
}
