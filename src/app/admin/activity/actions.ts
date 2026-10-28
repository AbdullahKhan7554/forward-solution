"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession, logActivity } from "@/lib/admin/session";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export type ClearScope = "30" | "90" | "all";

const SIGNED_OUT = "Your session has expired. Please log in again.";
const ADMINS_ONLY = "Only admins can delete activity.";
// RLS silently skips rows it may not delete, so 0 deleted with rows present means the policy is missing
const NO_POLICY = "Nothing was deleted. The activity_log delete policy isn't set up yet.";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function adminSession() {
  const session = await getAdminSession();
  if (!session) return { error: SIGNED_OUT } as const;
  if (session.me.role !== "admin") return { error: ADMINS_ONLY } as const;
  return session;
}

function revalidate() {
  revalidatePath("/admin/activity");
  revalidatePath("/admin");
}

/** Deletes the given entries (a row's trash icon, or "Delete selected"). */
export async function deleteActivity(ids: string[]): Promise<Result<{ deleted: number }>> {
  const session = await adminSession();
  if ("error" in session) return { ok: false, error: session.error as string };
  const valid = [...new Set(ids)].filter((id) => UUID.test(id));
  if (valid.length === 0) return { ok: false, error: "Nothing selected." };

  const { error, count } = await session.supabase.from("activity_log").delete({ count: "exact" }).in("id", valid);
  if (error) return { ok: false, error: `Couldn't delete: ${error.message}` };
  if (!count) return { ok: false, error: NO_POLICY };

  revalidate();
  return { ok: true, deleted: count };
}

/** "Clear log": removes entries older than 30/90 days, or all of them, then records that it happened. */
export async function clearActivity(scope: ClearScope): Promise<Result<{ deleted: number }>> {
  const session = await adminSession();
  if ("error" in session) return { ok: false, error: session.error as string };
  if (!["30", "90", "all"].includes(scope)) return { ok: false, error: "Choose what to clear." };
  const { supabase, me } = session;

  const cutoff = scope === "all" ? null : new Date(Date.now() - Number(scope) * 86_400_000).toISOString();
  const scoped = <Q extends { lt: (c: string, v: string) => Q; not: (c: string, op: string, v: null) => Q }>(q: Q) =>
    cutoff ? q.lt("created_at", cutoff) : q.not("id", "is", null);

  const { count: matching, error: countError } = await scoped(
    supabase.from("activity_log").select("id", { count: "exact", head: true }),
  );
  if (countError) return { ok: false, error: `Couldn't clear the log: ${countError.message}` };
  if (!matching) return { ok: true, deleted: 0 };

  const { error, count } = await scoped(supabase.from("activity_log").delete({ count: "exact" }));
  if (error) return { ok: false, error: `Couldn't clear the log: ${error.message}` };
  if (!count) return { ok: false, error: NO_POLICY };

  // the log is never wiped silently
  await logActivity(me.id, "cleared", { name: `${count} ${count === 1 ? "entry" : "entries"}` });
  revalidate();
  return { ok: true, deleted: count };
}
