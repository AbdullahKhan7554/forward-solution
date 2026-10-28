import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsTable, type ProductListItem } from "@/components/admin/ProductsTable";
import { sectionLabel, type Section } from "@/lib/admin/products";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type SearchParams = { section?: string; cat?: string; q?: string; page?: string };

const TZ = "Asia/Karachi";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

function updatedLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (dayKey(d) === dayKey(now)) return "Today";
  if (dayKey(d) === dayKey(new Date(now.getTime() - 86_400_000))) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: TZ });
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient();
  const section: Section | null =
    searchParams.section === "poultry" || searchParams.section === "ruminants" ? searchParams.section : null;
  const cat = searchParams.cat ?? "";
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let rowsQuery = supabase
    .from("products")
    .select("id, name, section, category, image_url, is_live, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (section) rowsQuery = rowsQuery.eq("section", section);
  if (cat) rowsQuery = rowsQuery.eq("category", cat);
  if (q) rowsQuery = rowsQuery.ilike("name", `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);

  const [rowsRes, allRes] = await Promise.all([
    rowsQuery,
    supabase.from("products").select("section, category"),
  ]);

  // page past the end (e.g. after deleting the last row on it) — go back to the first page
  if (rowsRes.error?.code === "PGRST103") {
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (cat) params.set("cat", cat);
    if (q) params.set("q", q);
    const qs = params.toString();
    redirect(`/admin/products${qs ? `?${qs}` : ""}`);
  }

  const error = rowsRes.error ?? allRes.error;
  const all = allRes.data ?? [];
  const categories = Array.from(
    new Set(all.filter((r) => !section || r.section === section).map((r) => r.category)),
  ).sort((a, b) => a.localeCompare(b));

  const rows: ProductListItem[] = (rowsRes.data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    section: sectionLabel(r.section),
    category: r.category,
    imageUrl: r.image_url,
    isLive: r.is_live,
    updated: updatedLabel(r.updated_at),
  }));

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="m-0 text-[26px] font-bold">Products</h1>
          <div className="mt-1 text-[13px] text-[#5B6178]">
            Add, edit or remove products. Hidden products stay saved but don&apos;t show on the website.
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-[#008848] px-5 py-3 text-[14px] font-semibold text-white no-underline hover:text-white"
        >
          + Add product
        </Link>
      </div>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#B42318]">
          Couldn&apos;t load products: {error.message}
        </p>
      ) : (
        <ProductsTable
          rows={rows}
          counts={{
            all: all.length,
            poultry: all.filter((r) => r.section === "poultry").length,
            ruminants: all.filter((r) => r.section === "ruminants").length,
          }}
          categories={categories}
          filters={{ section, cat, q }}
          page={page}
          pageSize={PAGE_SIZE}
          total={rowsRes.count ?? 0}
        />
      )}
    </div>
  );
}
