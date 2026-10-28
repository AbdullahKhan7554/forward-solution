"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteProduct } from "@/app/admin/products/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import type { Section } from "@/lib/admin/products";
import { Pending } from "@/components/admin/Spinner";

export type ProductListItem = {
  id: string;
  name: string;
  section: string;
  category: string;
  imageUrl: string | null;
  isLive: boolean;
  updated: string;
};

type Props = {
  rows: ProductListItem[];
  counts: { all: number; poultry: number; ruminants: number };
  categories: string[];
  filters: { section: Section | null; cat: string; q: string };
  page: number;
  pageSize: number;
  total: number;
};

// md+: the 7-column table (scrolls sideways on tablet). Phone: each row is a card — image left, details right, actions below.
const COLS = "md:grid-cols-[64px_2fr_1.1fr_1.4fr_0.7fr_0.7fr_0.9fr]";
const HEAD = `hidden ${COLS} gap-4 px-5 md:grid`;
const ROW = `grid grid-cols-[48px_1fr] gap-x-3 gap-y-1 px-4 py-4 ${COLS} md:gap-4 md:px-5 md:py-[10px]`;
const actBtn =
  "flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[#D5DAE6] bg-white md:block md:min-h-0 md:flex-none md:rounded-none md:border-0 md:bg-transparent";
const tab = "rounded-[20px] px-4 py-[9px] text-[14px] [font-family:inherit]";
const tabOn = `${tab} border-none bg-[#16194A] font-semibold text-white hover:bg-[#232766]`;
const tabOff = `${tab} border border-[#D5DAE6] bg-white text-[#1B1F3B] hover:border-[#B8C0D4] hover:bg-[#F8F9FC]`;
const control =
  "rounded-lg border border-[#D5DAE6] bg-white px-3 py-[9px] text-[14px] text-[#1B1F3B] [font-family:inherit]";
const pagerBtn =
  "rounded-md border border-[#D5DAE6] bg-white px-3 py-[7px] text-[13px] text-[#1B1F3B] [font-family:inherit] hover:border-[#B8C0D4] hover:bg-[#F8F9FC] disabled:opacity-50";
const THUMBS = ["bg-[#DCE8F7]", "bg-[#DDF0E4]", "bg-[#F7EBD9]"];

export function ProductsTable({ rows, counts, categories, filters, page, pageSize, total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const canDelete = useAdmin().me?.role === "admin";
  const [q, setQ] = useState(filters.q);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  function go(next: Partial<{ section: Section | null; cat: string; q: string; page: number }>) {
    const merged = { ...filters, page: 1, ...next };
    const params = new URLSearchParams();
    if (merged.section) params.set("section", merged.section);
    if (merged.cat) params.set("cat", merged.cat);
    if (merged.q) params.set("q", merged.q);
    if (merged.page > 1) params.set("page", String(merged.page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // debounce search typing into the URL
  useEffect(() => {
    if (q.trim() === filters.q) return;
    const t = setTimeout(() => go({ q: q.trim() }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function remove(id: string) {
    startDelete(async () => {
      const res = await deleteProduct(id);
      if (res.ok) {
        toast.success("Deleted");
        setConfirming(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, total);

  return (
    <>
      <div className="flex flex-wrap items-center gap-[10px]">
        <button type="button" onClick={() => go({ section: null, cat: "" })} className={filters.section ? tabOff : tabOn}>
          All ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => go({ section: "poultry", cat: "" })}
          className={filters.section === "poultry" ? tabOn : tabOff}
        >
          Poultry ({counts.poultry})
        </button>
        <button
          type="button"
          onClick={() => go({ section: "ruminants", cat: "" })}
          className={filters.section === "ruminants" ? tabOn : tabOff}
        >
          Ruminants ({counts.ruminants})
        </button>
        <div className="hidden grow md:block" />
        <div className="flex w-full items-center gap-[10px] md:w-auto">
        <label htmlFor="cat" className="text-[13px] text-[#5B6178]">
          Category
        </label>
        <select id="cat" value={filters.cat} onChange={(e) => go({ cat: e.target.value })} className={`${control} min-w-0 grow md:grow-0`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        </div>
        <div className="flex w-full items-center gap-[10px] md:w-auto">
        <label htmlFor="q" className="text-[13px] text-[#5B6178]">
          Search
        </label>
        <input
          id="q"
          type="search"
          placeholder="Product name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${control} min-w-0 grow md:w-[220px] md:grow-0`}
        />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E3E7EF] bg-white">
        <div className="overflow-x-auto">
        <div className="md:min-w-[860px] lg:min-w-0">
        <div
          className={`${HEAD} border-b border-[#E3E7EF] bg-[#F8F9FC] py-3 text-[12px] font-semibold tracking-[0.5px] text-[#5B6178]`}
        >
          <span>IMAGE</span>
          <span>PRODUCT</span>
          <span>SECTION</span>
          <span>CATEGORY</span>
          <span>STATUS</span>
          <span>UPDATED</span>
          <span>ACTIONS</span>
        </div>

        {rows.length === 0 && (
          <div className="border-b border-[#EEF1F6] px-5 py-8 text-center text-[14px] text-[#5B6178]">
            No products match these filters.
          </div>
        )}

        {rows.map((p, i) => (
          <div key={p.id} className={`${ROW} items-center border-b border-[#EEF1F6] py-[10px] text-[14px] transition-colors hover:bg-[#F8F9FC]`}>
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt="" className="row-span-3 h-12 w-12 self-start rounded-lg bg-[#F4F6FA] object-contain md:row-span-1 md:self-auto" />
            ) : (
              <div className={`row-span-3 h-12 w-12 self-start rounded-lg md:row-span-1 md:self-auto ${THUMBS[i % 3]}`} />
            )}
            <span className="font-semibold">{p.name}</span>
            <span className="hidden text-[#5B6178] md:block">{p.section}</span>
            <span className="text-[#5B6178]">{p.category}</span>
            <span
              className={`justify-self-start rounded-md px-2 py-[3px] text-[12px] font-semibold ${
                p.isLive ? "bg-[#E6F4EC] text-[#00733C]" : "bg-[#EEF1F6] text-[#3D4360]"
              }`}
            >
              {p.isLive ? "Live" : "Hidden"}
            </span>
            <span className="hidden text-[#5B6178] md:block">{p.updated}</span>
            {confirming === p.id ? (
              <div role="group" aria-label={`Delete ${p.name}?`} className="col-span-2 mt-2 flex items-center gap-[10px] text-[13px] font-semibold md:col-span-1 md:mt-0">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => remove(p.id)}
                  className={`${actBtn} text-[#B42318] disabled:opacity-60`}
                >
                  <Pending pending={deleting} label="Deleting…">Confirm</Pending>
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirming(null)}
                  className={`${actBtn} text-[#5B6178] hover:text-[#1B1F3B]`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="col-span-2 mt-2 flex gap-[10px] text-[13px] font-semibold md:col-span-1 md:mt-0 md:gap-[14px]">
                <Link href={`/admin/products/${p.id}`} className={`${actBtn} text-[#0D4FA0] hover:text-[#008848]`}>
                  Edit
                </Link>
                {canDelete && (
                  <button type="button" onClick={() => setConfirming(p.id)} className={`${actBtn} text-[#B42318] hover:text-[#8A1A12] hover:underline`}>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-5 text-[13px] text-[#5B6178]">
          <span>
            Showing {first}–{last} of {total}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => go({ page: page - 1 })} className={pagerBtn}>
              Previous
            </button>
            <button type="button" disabled={last >= total} onClick={() => go({ page: page + 1 })} className={pagerBtn}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
