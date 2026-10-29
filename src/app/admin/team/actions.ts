"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminSession, logActivity } from "@/lib/admin/session";
import { isRole, type AdminUser, type Role } from "@/lib/admin/team";

type Result = { ok: true } | { ok: false; error: string };

const SIGNED_OUT = "Your session has expired. Please log in again.";
const ADMINS_ONLY = "Only admins can manage the team.";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function adminSession(): Promise<{ error: string } | { me: AdminUser }> {
  const session = await getAdminSession();
  if (!session) return { error: SIGNED_OUT };
  if (session.me.role !== "admin") return { error: ADMINS_ONLY };
  return { me: session.me };
}

/** Where invite links land: NEXT_PUBLIC_SITE_URL, else the Vercel deployment's URL, else local dev. */
function siteOrigin() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (site) return site;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

export async function inviteUser(form: { name: string; email: string; role: Role }): Promise<Result> {
  const auth = await adminSession();
  if ("error" in auth) return { ok: false, error: auth.error };

  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  if (!name) return { ok: false, error: "Name is required." };
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (!isRole(form.role)) return { ok: false, error: "Choose a role." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name },
    redirectTo: `${siteOrigin()}/admin/login`,
  });
  if (error) return { ok: false, error: `Couldn't send the invite: ${error.message}` };

  // the signup trigger creates an editor profile; set the chosen role and name
  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: data.user.id, full_name: name, email, role: form.role });
  if (profileError) return { ok: false, error: `Invite sent, but couldn't set the role: ${profileError.message}` };

  await logActivity(auth.me.id, "created", { type: "user", id: data.user.id, name });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function changeRole(userId: string, role: Role): Promise<Result> {
  const auth = await adminSession();
  if ("error" in auth) return { ok: false, error: auth.error };
  if (!isRole(role)) return { ok: false, error: "Choose a role." };
  if (userId === auth.me.id) return { ok: false, error: "You can't change your own role." };

  const { data, error } = await createAdminClient()
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select("full_name, email");
  if (error) return { ok: false, error: `Couldn't change the role: ${error.message}` };
  if (!data?.length) return { ok: false, error: "This user no longer exists." };

  await logActivity(auth.me.id, "updated", { type: "user", id: userId, name: data[0].full_name || data[0].email });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function removeUser(userId: string): Promise<Result> {
  const auth = await adminSession();
  if ("error" in auth) return { ok: false, error: auth.error };
  if (userId === auth.me.id) return { ok: false, error: "You can't remove yourself." };

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("full_name, email").eq("id", userId).maybeSingle();

  // deleting the auth user cascades to the profile; their activity rows stay, unattributed
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: `Couldn't remove the user: ${error.message}` };

  await logActivity(auth.me.id, "deleted", { type: "user", id: userId, name: profile?.full_name || profile?.email });
  revalidatePath("/admin/team");
  return { ok: true };
}
