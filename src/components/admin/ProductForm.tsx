"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { deleteProduct, saveProduct } from "@/app/admin/products/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { toWebp, uploadWebp } from "@/lib/admin/image";
import { SECTIONS, type ProductFormValues, type Section } from "@/lib/admin/products";

type Props = {
  id: string | null;
  initial: ProductFormValues;
  categories: Record<Section, string[]>;
};

const card = "rounded-xl border border-[#E3E7EF] bg-white px-5 py-[18px]";
const label = "flex flex-col gap-[6px] text-[13px] font-semibold";
const field =
  "rounded-lg border border-[#D5DAE6] px-3 py-[10px] text-[15px] font-normal text-[#1B1F3B] [font-family:inherit]";
const select =
  "rounded-lg border border-[#D5DAE6] bg-white p-[9px] text-[14px] font-normal text-[#1B1F3B] [font-family:inherit]";
const rowKey =
  "rounded-md border border-[#D5DAE6] px-[10px] py-2 text-[13px] font-semibold text-[#1B1F3B] [font-family:inherit]";
const rowVal =
  "rounded-md border border-[#D5DAE6] px-[10px] py-2 text-[13px] text-[#1B1F3B] [font-family:inherit]";
const rowGrid = "mb-2 grid grid-cols-[200px_1fr_32px] items-center gap-[10px]";
const removeBtn = "h-8 w-8 border-none bg-transparent text-[18px] text-[#8A90A6] hover:text-[#B42318]";
const addBtn =
  "rounded-md border border-[#D5DAE6] bg-white px-3 py-[6px] text-[13px] font-semibold text-[#0D4FA0] [font-family:inherit]";
const btn = "rounded-lg px-[18px] py-[11px] text-[14px] font-semibold [font-family:inherit] disabled:opacity-60";

export function ProductForm({ id, initial, categories }: Props) {
  const router = useRouter();
  const toast = useToast();
  const canDelete = useAdmin().me?.role === "admin";
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState<{ blob: Blob; preview: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [appDraft, setAppDraft] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.preview);
  }, [image]);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // categories already used in the chosen section, plus the current one if it's new
  const sectionCategories = categories[form.section];
  const categoryOptions =
    form.category && !sectionCategories.includes(form.category)
      ? [form.category, ...sectionCategories]
      : sectionCategories;

  function changeSection(section: Section) {
    setForm((f) => ({
      ...f,
      section,
      category: categories[section].includes(f.category) ? f.category : categories[section][0] ?? "",
    }));
  }

  async function pickImage(file: File | undefined) {
    if (!file) return;
    setConverting(true);
    try {
      const blob = await toWebp(file);
      setImage({ blob, preview: URL.createObjectURL(blob) });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't process that image.");
    } finally {
      setConverting(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function addApplication() {
    const value = (appDraft ?? "").trim();
    if (value && !form.applications.includes(value)) set("applications", [...form.applications, value]);
    setAppDraft(null);
  }

  function onAppKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addApplication();
    } else if (e.key === "Escape") {
      setAppDraft(null);
    }
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Product name is required.");
    if (!form.category.trim()) return toast.error("Choose a category.");
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;
      if (image) imageUrl = await uploadWebp(image.blob, "products");
      const res = await saveProduct(id, { ...form, imageUrl });
      if (!res.ok) return toast.error(res.error);
      setForm((f) => ({ ...f, imageUrl }));
      setImage(null);
      toast.success("Saved");
      if (!id) router.replace(`/admin/products/${res.id}`);
      else router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await deleteProduct(id);
      if (!res.ok) return toast.error(res.error);
      toast.success("Deleted");
      router.push("/admin/products");
    } catch {
      toast.error("Couldn't delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const busy = saving || deleting || converting;
  const preview = image?.preview ?? form.imageUrl;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="text-[13px] font-semibold text-[#0D4FA0] no-underline hover:text-[#008848]">
            ← All products
          </Link>
          <h1 className="mb-0 mt-[6px] text-[24px] font-bold">{id ? "Edit product" : "Add product"}</h1>
        </div>
        <div className="flex items-center gap-[10px]">
          {id && confirmDelete ? (
            <div role="group" aria-label="Confirm delete" className="flex items-center gap-[10px]">
              <span className="text-[14px] font-semibold text-[#B42318]">Delete this product?</span>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(false)}
                className={`${btn} border border-[#D5DAE6] bg-white text-[#1B1F3B]`}
              >
                Cancel
              </button>
              <button type="button" disabled={busy} onClick={remove} className={`${btn} border-none bg-[#B42318] text-white`}>
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          ) : (
            id &&
            canDelete && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
                className={`${btn} border border-[#F1C5C0] bg-white text-[#B42318]`}
              >
                Delete product
              </button>
            )
          )}
          <button type="button" disabled={busy} onClick={save} className={`${btn} border-none bg-[#008848] text-white`}>
            {saving ? "Saving…" : id ? "Save changes" : "Save product"}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 grow gap-[18px]">
        <div className="flex min-w-0 grow flex-col gap-[14px]">
          <div className={`${card} grid grid-cols-2 gap-[14px]`}>
            <label className={label}>
              Product name
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
            </label>
            <label className={label}>
              Subheading
              <input type="text" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={field} />
            </label>
            <label className={`${label} col-span-full`}>
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={`${field} resize-none text-[14px] leading-[1.5]`}
              />
            </label>
          </div>

          <div className={card}>
            <div className="mb-[10px] flex items-center justify-between">
              <div className="text-[15px] font-semibold">Specifications</div>
              <button
                type="button"
                onClick={() => set("specs", [...form.specs, { label: "", value: "" }])}
                className={addBtn}
              >
                + Add row
              </button>
            </div>
            {form.specs.map((s, i) => (
              <div key={i} className={rowGrid}>
                <input
                  type="text"
                  aria-label="Field"
                  value={s.label}
                  onChange={(e) => set("specs", form.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  className={`${rowKey} bg-[#F8F9FC]`}
                />
                <input
                  type="text"
                  aria-label="Details"
                  value={s.value}
                  onChange={(e) => set("specs", form.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  className={rowVal}
                />
                <button
                  type="button"
                  aria-label="Remove row"
                  onClick={() => set("specs", form.specs.filter((_, j) => j !== i))}
                  className={removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={card}>
            <div className="mb-[10px] flex items-center justify-between">
              <div className="text-[15px] font-semibold">Key benefits</div>
              <button
                type="button"
                onClick={() => set("benefits", [...form.benefits, { title: "", text: "" }])}
                className={addBtn}
              >
                + Add benefit
              </button>
            </div>
            {form.benefits.map((b, i) => (
              <div key={i} className={rowGrid}>
                <input
                  type="text"
                  aria-label="Benefit title"
                  value={b.title}
                  onChange={(e) =>
                    set("benefits", form.benefits.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                  className={rowKey}
                />
                <input
                  type="text"
                  aria-label="Benefit text"
                  value={b.text}
                  onChange={(e) =>
                    set("benefits", form.benefits.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                  }
                  className={rowVal}
                />
                <button
                  type="button"
                  aria-label="Remove benefit"
                  onClick={() => set("benefits", form.benefits.filter((_, j) => j !== i))}
                  className={removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-[320px] shrink-0 flex-col gap-[14px]">
          <div className={`${card} flex flex-col gap-[10px]`}>
            <div className="text-[15px] font-semibold">Product image</div>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Product" className="h-[170px] w-full rounded-lg bg-[#F7EBD9] object-contain" />
            ) : (
              <div className="flex h-[170px] items-center justify-center rounded-lg bg-[#F7EBD9] text-[13px] font-semibold text-[#8A5A00]">
                No image yet
              </div>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickImage(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="rounded-lg border border-dashed border-[#B8C0D4] bg-white p-[9px] text-[13px] font-semibold text-[#0D4FA0] [font-family:inherit] disabled:opacity-60"
            >
              {converting ? "Converting…" : preview ? "Change image" : "Upload image"}
            </button>
          </div>

          <div className={`${card} flex flex-col gap-3`}>
            <label className={label}>
              Section
              <select value={form.section} onChange={(e) => changeSection(e.target.value as Section)} className={select}>
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Category
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={select}>
                {!form.category && <option value="">Choose a category</option>}
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-2 text-[13px] font-semibold">
              Applications
              <div className="flex flex-wrap gap-[6px]">
                {form.applications.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-label={`Remove ${a}`}
                    onClick={() => set("applications", form.applications.filter((x) => x !== a))}
                    className="rounded-[14px] border-none bg-[#EEF1F6] px-[10px] py-[5px] text-[12px] font-medium text-[#1B1F3B] [font-family:inherit]"
                  >
                    {a} ×
                  </button>
                ))}
                {appDraft === null ? (
                  <button
                    type="button"
                    onClick={() => setAppDraft("")}
                    className="rounded-[14px] border border-dashed border-[#B8C0D4] bg-white px-[10px] py-[5px] text-[12px] font-semibold text-[#0D4FA0] [font-family:inherit]"
                  >
                    + Add
                  </button>
                ) : (
                  <input
                    autoFocus
                    type="text"
                    aria-label="New application"
                    placeholder="Type, press Enter"
                    value={appDraft}
                    onChange={(e) => setAppDraft(e.target.value)}
                    onKeyDown={onAppKey}
                    onBlur={addApplication}
                    className="w-[140px] rounded-[14px] border border-dashed border-[#B8C0D4] px-[10px] py-[5px] text-[12px] font-medium [font-family:inherit]"
                  />
                )}
              </div>
            </div>
            <label className="flex items-center justify-between pt-1 text-[13px] font-semibold">
              Show on website
              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) => set("isLive", e.target.checked)}
                className="h-5 w-5 accent-[#008848]"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
