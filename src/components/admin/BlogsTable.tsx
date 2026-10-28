"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteBlog } from "@/app/admin/blogs/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";

export type BlogListItem = {
  id: string;
  title: string;
  category: string;
  coverUrl: string | null;
  published: boolean;
  date: string;
};

const GRID = "grid grid-cols-[96px_2.4fr_1fr_0.8fr_0.8fr_0.9fr] gap-4 px-5";
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
      <div
        className={`${GRID} border-b border-[#E3E7EF] bg-[#F8F9FC] py-3 text-[12px] font-semibold tracking-[0.5px] text-[#5B6178]`}
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
        <div key={p.id} className={`${GRID} items-center border-b border-[#EEF1F6] py-3 text-[14px]`}>
          {p.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverUrl} alt="" className="h-14 w-24 rounded-md bg-[#F4F6FA] object-cover" />
          ) : (
            <div className={`h-14 w-24 rounded-md ${COVERS[i % 3]}`} />
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
          <span className="text-[#5B6178]">{p.date}</span>
          {confirming === p.id ? (
            <div role="group" aria-label={`Delete ${p.title}?`} className="flex items-center gap-[10px] text-[13px] font-semibold">
              <button
                type="button"
                disabled={deleting}
                onClick={() => remove(p.id)}
                className="text-[#B42318] disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
              <button type="button" disabled={deleting} onClick={() => setConfirming(null)} className="text-[#5B6178]">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-[14px] text-[13px] font-semibold">
              <Link href={`/admin/blogs/${p.id}`} className="text-[#0D4FA0] hover:text-[#008848]">
                Edit
              </Link>
              {canDelete && (
                <button type="button" onClick={() => setConfirming(p.id)} className="text-[#B42318]">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
