"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteBlog } from "@/app/admin/blogs/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { Pending } from "@/components/admin/Spinner";

export type BlogListItem = {
  id: string;
  title: string;
  category: string;
  coverUrl: string | null;
  published: boolean;
  date: string;
};

// md+: the 6-column table (scrolls sideways on tablet). Phone: each row is a card — cover left, details right, actions below.
const COLS = "md:grid-cols-[96px_2.4fr_1fr_0.8fr_0.8fr_0.9fr]";
const HEAD = `hidden ${COLS} gap-4 px-5 md:grid`;
const ROW = `grid grid-cols-[72px_1fr] gap-x-3 gap-y-1 px-4 py-4 ${COLS} md:gap-4 md:px-5 md:py-3`;
const actBtn =
  "flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[#D5DAE6] bg-white md:block md:min-h-0 md:flex-none md:rounded-none md:border-0 md:bg-transparent";
const COVERS = ["bg-[#C9DDF5]", "bg-[#CDEBD8]", "bg-[#F5E3C9]"];

export function BlogsTable({ rows }: { rows: BlogListItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const canDelete = useAdmin().me?.role === "admin";
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  function remove(id: string) {
    startDelete(async () => {
      const res = await deleteBlog(id);
      if (res.ok) {
        toast.success("Deleted");
        setConfirming(null);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E3E7EF] bg-white">
      <div className="overflow-x-auto">
      <div className="md:min-w-[820px] lg:min-w-0">
      <div
        className={`${HEAD} border-b border-[#E3E7EF] bg-[#F8F9FC] py-3 text-[12px] font-semibold tracking-[0.5px] text-[#5B6178]`}
      >
        <span>COVER</span>
        <span>TITLE</span>
        <span>CATEGORY</span>
        <span>STATUS</span>
        <span>DATE</span>
        <span>ACTIONS</span>
      </div>

      {rows.length === 0 && (
        <div className="border-b border-[#EEF1F6] px-5 py-8 text-center text-[14px] text-[#5B6178]">
          No blogs yet. Click &ldquo;+ New blog&rdquo; to write the first one.
        </div>
      )}

      {rows.map((p, i) => (
        <div key={p.id} className={`${ROW} items-center border-b border-[#EEF1F6] py-3 text-[14px] transition-colors hover:bg-[#F8F9FC]`}>
          {p.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverUrl} alt="" className="row-span-3 h-12 w-[72px] self-start rounded-md bg-[#F4F6FA] object-cover md:row-span-1 md:h-14 md:w-24 md:self-auto" />
          ) : (
            <div className={`row-span-3 h-12 w-[72px] self-start rounded-md md:row-span-1 md:h-14 md:w-24 md:self-auto ${COVERS[i % 3]}`} />
          )}
          <span className="font-semibold">{p.title}</span>
          <span className="text-[#5B6178]">{p.category}</span>
          <span
            className={`justify-self-start rounded-md px-2 py-[3px] text-[12px] font-semibold ${
              p.published ? "bg-[#E6F4EC] text-[#00733C]" : "bg-[#EEF1F6] text-[#3D4360]"
            }`}
          >
            {p.published ? "Published" : "Draft"}
          </span>
          <span className="hidden text-[#5B6178] md:block">{p.date}</span>
          {confirming === p.id ? (
            <div role="group" aria-label={`Delete ${p.title}?`} className="col-span-2 mt-2 flex items-center gap-[10px] text-[13px] font-semibold md:col-span-1 md:mt-0">
              <button
                type="button"
                disabled={deleting}
                onClick={() => remove(p.id)}
                className={`${actBtn} text-[#B42318] disabled:opacity-60`}
              >
                <Pending pending={deleting} label="Deleting…">Confirm</Pending>
              </button>
              <button type="button" disabled={deleting} onClick={() => setConfirming(null)} className={`${actBtn} text-[#5B6178] hover:text-[#1B1F3B]`}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="col-span-2 mt-2 flex gap-[10px] text-[13px] font-semibold md:col-span-1 md:mt-0 md:gap-[14px]">
              <Link href={`/admin/blogs/${p.id}`} className={`${actBtn} text-[#0D4FA0] hover:text-[#008848]`}>
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
    </div>
  );
}
