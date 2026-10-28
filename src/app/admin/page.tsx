import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { sectionLabel, updatedLabel } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

const card = "rounded-xl border border-[#E3E7EF] bg-white p-5";
const link = "text-[13px] font-semibold text-[#0D4FA0] hover:text-[#008848]";
const row = "flex items-center gap-[14px] border-b border-[#EEF1F6] py-[11px]";
const THUMBS = ["bg-[#DCE8F7]", "bg-[#DDF0E4]", "bg-[#F7EBD9]"];
const PILL = {
  published: "bg-[#E6F4EC] text-[#00733C]",
  draft: "bg-[#EEF1F6] text-[#3D4360]",
};

const blogDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const [productsRes, recentRes, blogsRes, latestRes] = await Promise.all([
    supabase.from("products").select("section, category, is_live"),
    supabase
      .from("products")
      .select("id, name, section, category, image_url, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase.from("blogs").select("status"),
    supabase
      .from("blogs")
      .select("id, title, cover_url, status, published_at")
      .order("status", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: true })
      .limit(5),
  ]);
  const error = productsRes.error ?? recentRes.error ?? blogsRes.error ?? latestRes.error;

  const products = productsRes.data ?? [];
  const blogs = blogsRes.data ?? [];
  const inSection = (s: string) => products.filter((p) => p.section === s);
  const categoryCount = (s: string) => new Set(inSection(s).map((p) => p.category)).size;
  const hidden = products.filter((p) => !p.is_live).length;
  const drafts = blogs.filter((b) => b.status === "draft").length;

  const kpis = [
    {
      label: "Total products",
      value: products.length,
      sub: hidden ? `${products.length - hidden} live · ${hidden} hidden` : "Live on the website",
    },
    { label: "Poultry products", value: inSection("poultry").length, sub: count(categoryCount("poultry"), "category", "categories") },
    { label: "Ruminant products", value: inSection("ruminants").length, sub: count(categoryCount("ruminants"), "category", "categories") },
    { label: "Blogs", value: blogs.length, sub: count(drafts, "draft", "drafts") },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Welcome back</h1>
          <div className="mt-1 text-[13px] text-[#5B6178]">
            Manage your products and blogs. Changes go live on agriprompakistan.com right away.
          </div>
        </div>
        <div className="flex gap-[10px]">
          <Link
            href="/admin/products/new"
            className="rounded-lg border border-[#D5DAE6] bg-white px-[18px] py-[11px] text-[14px] font-semibold text-[#16194A] no-underline hover:text-[#16194A]"
          >
            + Add product
          </Link>
          <Link
            href="/admin/blogs/new"
            className="rounded-lg bg-[#008848] px-[18px] py-3 text-[14px] font-semibold text-white no-underline hover:text-white"
          >
            + New blog
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load the dashboard: {error.message}
        </p>
      )}

      <div className="grid grid-cols-4 gap-[18px]">
        {kpis.map((k) => (
          <div key={k.label} className={card}>
            <div className="text-[13px] text-[#5B6178]">{k.label}</div>
            <div className="mt-2 text-[32px] font-bold">{k.value}</div>
            <div className="mt-[6px] text-[12px] text-[#5B6178]">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grow grid-cols-2 gap-[18px]">
        <div className={card}>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Recently updated products</div>
            <Link href="/admin/products" className={link}>
              View all →
            </Link>
          </div>
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
        </div>

        <div className={card}>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Latest blogs</div>
            <Link href="/admin/blogs" className={link}>
              View all →
            </Link>
          </div>
          {(latestRes.data ?? []).length === 0 && (
            <div className="py-6 text-center text-[14px] text-[#5B6178]">No blogs yet.</div>
          )}
          {(latestRes.data ?? []).map((b, i) => {
            const published = b.status === "published";
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
                    {published && b.published_at ? blogDate(b.published_at) : "Not published"}
                  </div>
                </div>
                <span className={`rounded-md px-2 py-[3px] text-[12px] font-semibold ${PILL[published ? "published" : "draft"]}`}>
                  {published ? "Published" : "Draft"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
