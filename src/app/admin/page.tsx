import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { sectionLabel, updatedLabel } from "@/lib/admin/products";
import { isRole } from "@/lib/admin/team";
import { ActivityFeed, toEntry } from "@/components/admin/Activity";
import { OnlineNow, TeamCard, type TeamCardMember } from "@/components/admin/DashboardLive";

export const dynamic = "force-dynamic";

const card = "rounded-xl border border-[#E3E7EF] bg-white p-5";
const cardTitle = "text-[15px] font-semibold";
const link = "text-[13px] font-semibold text-[#0D4FA0] no-underline hover:text-[#008848] hover:underline";
const row = "flex items-center gap-[14px] border-b border-[#EEF1F6] py-[11px] last:border-b-0";
const btnBase =
  "inline-flex items-center rounded-lg px-[18px] py-[11px] text-[14px] font-semibold no-underline transition-colors duration-150";
const btnPrimary = `${btnBase} bg-[#008848] text-white hover:bg-[#007A40] hover:text-white active:bg-[#006A38]`;
const btnSecondary = `${btnBase} border border-[#D5DAE6] bg-white text-[#16194A] hover:border-[#B8C0D4] hover:bg-[#F8F9FC] hover:text-[#16194A] active:bg-[#EEF1F6]`;
const THUMBS = ["bg-[#DCE8F7]", "bg-[#DDF0E4]", "bg-[#F7EBD9]"];
const PILL = {
  published: "bg-[#E6F4EC] text-[#00733C]",
  draft: "bg-[#EEF1F6] text-[#3D4360]",
};
// categorical: poultry → blue, ruminants → green (validated pair)
const SECTION_COLOR: Record<string, string> = { poultry: "#0D4FA0", ruminants: "#008848" };
const ATTENTION_LIMIT = 8;

const blogDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const displayName = (p: { full_name: string | null; email: string | null }) =>
  p.full_name || p.email?.split("@")[0] || "User";

function CardHeader({ title, href, linkLabel = "View all →" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className={`m-0 ${cardTitle}`}>{title}</h2>
      {href && (
        <Link href={href} className={link}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { supabase, me } = session;

  const [productsRes, recentRes, blogsRes, latestRes, activityRes, profilesRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, section, category, is_live, image_url, hero:data->assets->>hero, intro:data->>intro")
      .order("name"),
    supabase
      .from("products")
      .select("id, name, section, category, image_url, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.from("blogs").select("id, title, status, updated_at").order("updated_at", { ascending: false }),
    supabase
      .from("blogs")
      .select("id, title, cover_url, status, published_at")
      .order("status", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: true })
      .limit(5),
    supabase
      .from("activity_log")
      .select("id, user_id, action, entity_type, entity_id, entity_name, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    supabase.from("profiles").select("id, full_name, email, role, last_seen_at").order("created_at"),
  ]);
  const error =
    productsRes.error ?? recentRes.error ?? blogsRes.error ?? latestRes.error ?? activityRes.error ?? profilesRes.error;

  const products = productsRes.data ?? [];
  const blogs = blogsRes.data ?? [];
  const profiles = profilesRes.data ?? [];
  const inSection = (s: string) => products.filter((p) => p.section === s);
  const categoryCount = (s: string) => new Set(inSection(s).map((p) => p.category)).size;
  const hidden = products.filter((p) => !p.is_live);
  const drafts = blogs.filter((b) => b.status === "draft");
  const published = blogs.length - drafts.length;

  const kpis = [
    {
      label: "Total products",
      value: products.length,
      sub: hidden.length ? `${products.length - hidden.length} live · ${hidden.length} hidden` : "All live on the website",
      href: "/admin/products",
    },
    {
      label: "Poultry",
      value: inSection("poultry").length,
      sub: count(categoryCount("poultry"), "category", "categories"),
      href: "/admin/products?section=poultry",
    },
    {
      label: "Ruminants",
      value: inSection("ruminants").length,
      sub: count(categoryCount("ruminants"), "category", "categories"),
      href: "/admin/products?section=ruminants",
    },
    {
      label: "Blogs",
      value: blogs.length,
      sub: `${published} published · ${count(drafts.length, "draft", "drafts")}`,
      href: "/admin/blogs",
    },
  ];

  // products by category, largest first
  const byCategory = Array.from(
    products
      .reduce((m, p) => {
        const key = `${p.section}|${p.category}`;
        m.set(key, { section: p.section as string, category: p.category as string, n: (m.get(key)?.n ?? 0) + 1 });
        return m;
      }, new Map<string, { section: string; category: string; n: number }>())
      .values(),
  ).sort((a, b) => b.n - a.n || a.category.localeCompare(b.category));
  const maxCat = Math.max(1, ...byCategory.map((c) => c.n));

  // needs attention: one row per item, listing every reason
  type Attention = { key: string; name: string; href: string; reasons: string[] };
  const attention: Attention[] = [
    ...products
      .map((p) => {
        const reasons = [
          !p.image_url && !p.hero && "No image",
          !(p.intro ?? "").trim() && "No description",
          !p.is_live && "Hidden",
        ].filter(Boolean) as string[];
        return { key: `p-${p.id}`, name: p.name as string, href: `/admin/products/${p.id}`, reasons };
      })
      .filter((a) => a.reasons.length),
    ...drafts.map((b) => ({ key: `b-${b.id}`, name: b.title as string, href: `/admin/blogs/${b.id}`, reasons: ["Draft blog"] })),
  ];

  const names: Record<string, string> = Object.fromEntries(profiles.map((p) => [p.id, displayName(p)]));
  const team: TeamCardMember[] = profiles.map((p) => ({
    id: p.id,
    name: displayName(p),
    role: isRole(p.role) ? p.role : "editor",
    lastSeen: p.last_seen_at,
  }));
  const firstName = me.name.trim().split(/\s+/)[0] || me.name;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Welcome back, {firstName}</h1>
          <div className="mt-1 text-[13px] text-[#5B6178]">
            Manage your products and blogs. Changes go live on agriprompakistan.com right away.
          </div>
        </div>
        <div className="flex shrink-0 gap-[10px]">
          <Link href="/admin/products/new" className={btnSecondary}>
            + Add product
          </Link>
          <Link href="/admin/blogs/new" className={btnPrimary}>
            + New blog
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            View website ↗
          </a>
        </div>
      </div>

      {error && (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load the dashboard: {error.message}
        </p>
      )}

      <div className="grid grid-cols-4 gap-[18px]">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className={`${card} group block text-[#1B1F3B] no-underline transition-[border-color,box-shadow] duration-150 hover:border-[#B8C0D4] hover:text-[#1B1F3B] hover:shadow-[0_4px_14px_rgba(22,25,74,0.08)]`}
          >
            <div className="flex items-center justify-between text-[13px] text-[#5B6178]">
              {k.label}
              <span aria-hidden="true" className="text-[#B8C0D4] transition-colors duration-150 group-hover:text-[#008848]">
                →
              </span>
            </div>
            <div className="mt-2 text-[32px] font-bold">{k.value}</div>
            <div className="mt-[6px] text-[12px] text-[#5B6178]">{k.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[18px]">
        <section className={`${card} col-span-2`}>
          <CardHeader title="Recent activity" href="/admin/activity" />
          <ActivityFeed initial={(activityRes.data ?? []).map(toEntry)} names={names} />
        </section>
        <div className="flex flex-col gap-[18px]">
          <section className={card}>
            <CardHeader title="Online now" />
            <OnlineNow />
          </section>
          <section className={`${card} grow`}>
            <CardHeader title="Team" href={me.role === "admin" ? "/admin/team" : undefined} linkLabel="Manage →" />
            <TeamCard members={team} />
          </section>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[18px]">
        <section className={card}>
          <CardHeader title="Products by category" href="/admin/products" />
          <div className="mb-3 flex gap-4 text-[12px] text-[#5B6178]">
            {Object.entries(SECTION_COLOR).map(([s, color]) => (
              <span key={s} className="inline-flex items-center gap-[6px]">
                <span className="h-[10px] w-[10px] rounded-[3px]" style={{ background: color }} />
                {sectionLabel(s)}
              </span>
            ))}
          </div>
          {byCategory.length === 0 ? (
            <div className="py-6 text-center text-[14px] text-[#5B6178]">No products yet.</div>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-[2px] p-0" aria-label="Products per category">
              {byCategory.map((c) => (
                <li key={`${c.section}|${c.category}`}>
                  <Link
                    href={`/admin/products?section=${c.section}&cat=${encodeURIComponent(c.category)}`}
                    title={`${sectionLabel(c.section)} › ${c.category}: ${count(c.n, "product", "products")}`}
                    className="grid grid-cols-[150px_1fr_28px] items-center gap-3 rounded-md px-1 py-[5px] text-[13px] text-[#1B1F3B] no-underline transition-colors duration-150 hover:bg-[#F8F9FC] hover:text-[#1B1F3B]"
                  >
                    <span className="truncate text-[#3D4360]">{c.category}</span>
                    <span className="h-[10px] rounded-r-[4px] bg-transparent">
                      <span
                        className="block h-full rounded-r-[4px]"
                        style={{ width: `${(c.n / maxCat) * 100}%`, background: SECTION_COLOR[c.section] ?? "#5B6178" }}
                      />
                    </span>
                    <span className="text-right font-semibold tabular-nums">{c.n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <CardHeader title="Needs attention" />
          {attention.length === 0 ? (
            <div className="py-6 text-center text-[14px] text-[#5B6178]">All good — nothing needs fixing.</div>
          ) : (
            <>
              {attention.slice(0, ATTENTION_LIMIT).map((a) => (
                <div key={a.key} className={row}>
                  <div className="min-w-0 grow">
                    <div className="truncate text-[14px] font-semibold">{a.name}</div>
                    <div className="mt-1 flex flex-wrap gap-[6px]">
                      {a.reasons.map((r) => (
                        <span key={r} className="rounded-md bg-[#FFF4E5] px-2 py-[2px] text-[12px] font-semibold text-[#8A5A00]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={a.href} className={link}>
                    Edit
                  </Link>
                </div>
              ))}
              {attention.length > ATTENTION_LIMIT && (
                <div className="pt-3 text-[12px] text-[#5B6178]">
                  + {attention.length - ATTENTION_LIMIT} more ·{" "}
                  <Link href="/admin/products" className={link}>
                    Products
                  </Link>{" "}
                  ·{" "}
                  <Link href="/admin/blogs" className={link}>
                    Blogs
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <div className="grid grid-cols-2 gap-[18px]">
        <section className={card}>
          <CardHeader title="Recently updated products" href="/admin/products" />
          {(recentRes.data ?? []).length === 0 && (
            <div className="py-6 text-center text-[14px] text-[#5B6178]">No products yet.</div>
          )}
          {(recentRes.data ?? []).map((p, i) => (
            <div key={p.id} className={row}>
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt="" className="h-11 w-11 shrink-0 rounded-lg bg-[#F4F6FA] object-contain" />
              ) : (
                <div className={`h-11 w-11 shrink-0 rounded-lg ${THUMBS[i % 3]}`} />
              )}
              <div className="min-w-0 grow">
                <div className="text-[14px] font-semibold">{p.name}</div>
                <div className="mt-[2px] text-[12px] text-[#5B6178]">
                  {sectionLabel(p.section)} › {p.category}
                </div>
              </div>
              <span className="text-[12px] text-[#5B6178]">{updatedLabel(p.updated_at)}</span>
              <Link href={`/admin/products/${p.id}`} className={link}>
                Edit
              </Link>
            </div>
          ))}
        </section>

        <section className={card}>
          <CardHeader title="Latest blogs" href="/admin/blogs" />
          {(latestRes.data ?? []).length === 0 && (
            <div className="py-6 text-center text-[14px] text-[#5B6178]">No blogs yet.</div>
          )}
          {(latestRes.data ?? []).map((b, i) => {
            const isPublished = b.status === "published";
            return (
              <div key={b.id} className={row}>
                {b.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.cover_url} alt="" className="h-11 w-16 shrink-0 rounded-lg bg-[#F4F6FA] object-cover" />
                ) : (
                  <div className={`h-11 w-16 shrink-0 rounded-lg ${THUMBS[i % 3]}`} />
                )}
                <div className="min-w-0 grow">
                  <div className="text-[14px] font-semibold">{b.title}</div>
                  <div className="mt-[2px] text-[12px] text-[#5B6178]">
                    {isPublished && b.published_at ? blogDate(b.published_at) : "Not published"}
                  </div>
                </div>
                <span className={`rounded-md px-2 py-[3px] text-[12px] font-semibold ${PILL[isPublished ? "published" : "draft"]}`}>
                  {isPublished ? "Published" : "Draft"}
                </span>
                <Link href={`/admin/blogs/${b.id}`} className={link}>
                  Edit
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}
