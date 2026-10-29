import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Guards /admin. Refreshes the Supabase session cookie, sends signed-out
 * visitors to /admin/login and signed-in ones away from it. On public blog and
 * product routes it only 301s old paths (supabase/redirects.sql) — the pages
 * themselves stay static.
 */
export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) return redirectOldPath(request);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLogin) {
    return redirectWithCookies(request, response, "/admin/login");
  }
  if (user && isLogin) {
    return redirectWithCookies(request, response, "/admin");
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function redirectWithCookies(request: NextRequest, from: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
  return redirect;
}

/** old_path → new_path, refetched at most once a minute per instance. */
let redirects: { map: Map<string, string>; at: number } | null = null;
const REDIRECTS_TTL_MS = 60_000;

async function loadRedirects() {
  if (redirects && Date.now() - redirects.at < REDIRECTS_TTL_MS) return redirects.map;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/redirects?select=old_path,new_path`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: { old_path: string; new_path: string }[] = await res.json();
    redirects = { map: new Map(rows.map((r) => [r.old_path, r.new_path])), at: Date.now() };
  } catch (error) {
    console.error("Couldn't load redirects:", error);
    // keep serving the last good table; retry on the next window
    redirects = { map: redirects?.map ?? new Map(), at: Date.now() };
  }
  return redirects.map;
}

async function redirectOldPath(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "") || "/";
  const target = (await loadRedirects()).get(path);
  if (!target) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/blog/:path+", "/products/:path+"],
};
