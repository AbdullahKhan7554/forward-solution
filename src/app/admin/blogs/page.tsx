import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BlogsTable, type BlogListItem } from "@/components/admin/BlogsTable";

export const dynamic = "force-dynamic";

const listDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default async function AdminBlogsPage() {
  const { data, error } = await createClient()
    .from("blogs")
    .select("id, title, category, cover_url, status, published_at")
    .order("status", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: true });

  const rows: BlogListItem[] = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    coverUrl: r.cover_url,
    published: r.status === "published",
    date: r.status === "published" && r.published_at ? listDate(r.published_at) : "—",
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Blogs</h1>
          <div className="mt-1 text-[13px] text-[#5B6178]">
            Write, edit and publish blog posts. Published posts go live on the website right away.
          </div>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-lg bg-[#008848] px-5 py-3 text-[14px] font-semibold text-white no-underline hover:bg-[#007A40] hover:text-white active:bg-[#006A38]"
        >
          + New blog
        </Link>
      </div>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load blogs: {error.message}
        </p>
      ) : (
        <BlogsTable rows={rows} />
      )}
    </div>
  );
}
