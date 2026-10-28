import type { ActivityAction, EntityType } from "@/lib/admin/team";

// Shared by server pages and client components — must stay free of "use client".

export type ActivityEntry = {
  id: string;
  userId: string | null;
  action: ActivityAction;
  entityType: EntityType | null;
  entityId: string | null;
  entityName: string | null;
  createdAt: string;
};

export type ActivityRow = {
  id: string;
  user_id: string | null;
  action: ActivityAction;
  entity_type: EntityType | null;
  entity_id: string | null;
  entity_name: string | null;
  created_at: string;
};

export const toEntry = (r: ActivityRow): ActivityEntry => ({
  id: r.id,
  userId: r.user_id,
  action: r.action,
  entityType: r.entity_type,
  entityId: r.entity_id,
  entityName: r.entity_name,
  createdAt: r.created_at,
});

export const ACTION_LABEL: Record<ActivityAction, string> = {
  created: "created",
  updated: "updated",
  deleted: "deleted",
  published: "published",
  hidden: "hid",
  logged_in: "logged in",
  cleared: "cleared the activity log",
};

/** Where an activity entry points; deleted items and logins have nowhere to go. */
export function entryHref(e: ActivityEntry) {
  if (e.action === "deleted" || !e.entityType) return null;
  if (e.entityType === "user") return "/admin/team";
  if (!e.entityId) return null;
  return e.entityType === "product" ? `/admin/products/${e.entityId}` : `/admin/blogs/${e.entityId}`;
}
