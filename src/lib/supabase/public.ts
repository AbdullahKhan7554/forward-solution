import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon client for public pages — subject to RLS (live products and
 * published blogs only). Reads go through Next's data cache so pages stay
 * static; the admin actions' revalidatePath calls refresh them on save.
 */
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "force-cache" }) },
  });
}
