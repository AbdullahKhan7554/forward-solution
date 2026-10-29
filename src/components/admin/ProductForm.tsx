"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { deleteProduct, saveProduct } from "@/app/admin/products/actions";
import { useAdmin } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import { toWebp, uploadWebp } from "@/lib/admin/image";
import { Pending, ProgressBar } from "@/components/admin/Spinner";
import { LIMITS } from "@/lib/admin/limits";
import { SECTIONS, type CtaForm, type ProductFormValues, type Section } from "@/lib/admin/products";

type Props = {
  id: string | null;
  /** the row's updated_at when loaded — sent with saves to catch someone else's edit */
  updatedAt: string | null;
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
// phone: field on top, details below, remove on the right; md+: one line
const rowGrid = "mb-3 grid grid-cols-[1fr_44px] items-center gap-x-[10px] gap-y-2 md:mb-2 md:grid-cols-[200px_1fr_32px] md:gap-y-[10px]";
const rowValCell = "col-start-1 row-start-2 md:col-auto md:row-auto";
const removeCell = "col-start-2 row-span-2 row-start-1 md:col-auto md:row-auto md:row-span-1";
const removeBtn = "h-11 w-11 border-none md:h-8 md:w-8 bg-transparent text-[18px] text-[#8A90A6] hover:text-[#B42318]";
const addBtn =
  "rounded-md border border-[#D5DAE6] bg-white px-3 py-[6px] text-[13px] font-semibold text-[#0D4FA0] [font-family:inherit] hover:border-[#B8C0D4] hover:bg-[#F8F9FC]";
const hint = "text-[12px] font-normal text-[#5B6178]";
const benefitGrid = "mb-3 grid grid-cols-[1fr_44px] items-center gap-[10px] md:mb-2 md:grid-cols-[1fr_32px]";
// what the public page shows when a CTA field is left blank (ProductDetail)
const CTA_FIELDS: { key: keyof CtaForm; label: string; placeholder: string; wide?: boolean; long?: boolean }[] = [
  { key: "top", label: "Heading — first part", placeholder: "Talk To Our" },
  { key: "bottom", label: "Heading — second part", placeholder: "Experts" },
  { key: "body", label: "Text", placeholder: "Get tailored recommendations for this product…", wide: true, long: true },
  { key: "primaryLabel", label: "Main button", placeholder: "Talk To Our Experts" },
  { key: "secondaryLabel", label: "Second button (optional)", placeholder: "None" },
  { key: "secondaryHref", label: "Second button link", placeholder: "/products/poultry", wide: true },
];
const btn = "rounded-lg px-[18px] py-[11px] text-[14px] font-semibold [font-family:inherit] disabled:opacity-60";

export function ProductForm({ id, updatedAt, initial, categories }: Props) {
  const router = useRouter();
  const toast = useToast();
  const canDelete = useAdmin().me?.role === "admin";
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState<{ blob: Blob; preview: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
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
      if (image) {
        setProgress(0);
        imageUrl = await uploadWebp(image.blob, "products", setProgress);
        setProgress(null);
      }
      const res = await saveProduct(id, { ...form, imageUrl }, updatedAt);
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
      setProgress(null);
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
      <div className="contents lg:flex lg:items-center lg:justify-between">
        <div>
          <Link href="/admin/products" className="text-[13px] font-semibold text-[#0D4FA0] no-underline hover:text-[#008848]">
            ← All products
          </Link>
          <h1 className="mb-0 mt-[6px] text-[24px] font-bold">{id ? "Edit product" : "Add product"}</h1>
        </div>
        <div className="order-last flex flex-col gap-[10px] lg:order-none lg:flex-row lg:items-center">
          {id && confirmDelete ? (
            <div role="group" aria-label="Confirm delete" className="flex flex-col gap-[10px] lg:flex-row lg:items-center">
              <span className="text-center text-[14px] font-semibold text-[#B42318] lg:text-left">Delete this product?</span>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(false)}
                className={`${btn} border border-[#D5DAE6] bg-white text-[#1B1F3B] hover:border-[#B8C0D4]`}
              >
                Cancel
              </button>
              <button type="button" disabled={busy} onClick={remove} className={`${btn} border-none bg-[#B42318] text-white`}>
                <Pending pending={deleting} label="Deleting…">Yes, delete</Pending>
              </button>
            </div>
          ) : (
            id &&
            canDelete && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
                className={`${btn} border border-[#F1C5C0] bg-white text-[#B42318] hover:bg-[#FEF3F2]`}
              >
                Delete product
              </button>
            )
          )}
          <button type="button" disabled={busy} onClick={save} className={`${btn} border-none bg-[#008848] text-white`}>
            <Pending pending={saving} label={progress !== null ? `Uploading ${Math.round(progress)}%…` : "Saving…"}>
              {id ? "Save changes" : "Save product"}
            </Pending>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 grow flex-col gap-[18px] lg:flex-row">
        <div className="flex min-w-0 grow flex-col gap-[14px]">
          <div className={`${card} grid grid-cols-1 gap-[14px] md:grid-cols-2`}>
            <label className={label}>
              Product name
              <input type="text" maxLength={LIMITS.productName} value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
            </label>
            <label className={label}>
              Subtitle
              <input type="text" maxLength={LIMITS.subtitle} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={field} />
              <span className={hint}>Small line under the name. Leave empty to hide.</span>
            </label>
            <label className={`${label} col-span-full`}>
              Intro
              <span className={hint}>The paragraph under the product name at the top of the page.</span>
              <textarea
                rows={4}
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
                  className={`${rowVal} ${rowValCell}`}
                />
                <button
                  type="button"
                  aria-label="Remove row"
                  onClick={() => set("specs", form.specs.filter((_, j) => j !== i))}
                  className={`${removeBtn} ${removeCell}`}
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
                onClick={() => set("benefits", [...form.benefits, ""])}
                className={addBtn}
              >
                + Add benefit
              </button>
            </div>
            {form.benefits.map((b, i) => (
              <div key={i} className={benefitGrid}>
                <input
                  type="text"
                  aria-label={`Benefit ${i + 1}`}
                  value={b}
                  onChange={(e) => set("benefits", form.benefits.map((x, j) => (j === i ? e.target.value : x)))}
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

          {form.section === "poultry" && (
            <div className={card}>
              <div className="text-[15px] font-semibold">Call to action</div>
              <p className={`${hint} mb-3 mt-1`}>The closing block at the bottom of the page. Empty fields use the text shown in grey.</p>
              <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
                {CTA_FIELDS.map((f) => (
                  <label key={f.key} className={`${label} ${f.wide ? "col-span-full" : ""}`}>
                    {f.label}
                    {f.long ? (
                      <textarea
                        rows={2}
                        placeholder={f.placeholder}
                        value={form.cta[f.key]}
                        onChange={(e) => set("cta", { ...form.cta, [f.key]: e.target.value })}
                        className={`${field} resize-none text-[14px] leading-[1.5]`}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={form.cta[f.key]}
                        onChange={(e) => set("cta", { ...form.cta, [f.key]: e.target.value })}
                        className={field}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={card}>
            <div className="text-[15px] font-semibold">Search engines (SEO)</div>
            <p className={`${hint} mb-3 mt-1`}>The title and description Google shows for this page.</p>
            <div className="flex flex-col gap-[14px]">
              <label className={label}>
                Meta title
                <input type="text" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={field} />
              </label>
              <label className={label}>
                Meta description
                <textarea
                  rows={3}
                  maxLength={LIMITS.metaDescription}
                  value={form.metaDescription}
                  onChange={(e) => set("metaDescription", e.target.value)}
                  className={`${field} resize-none text-[14px] leading-[1.5]`}
                />
                <span className={hint}>{form.metaDescription.trim().length} characters · about 150–160 is ideal</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-[14px] lg:w-[320px]">
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
              className="rounded-lg border border-dashed border-[#B8C0D4] bg-white p-[9px] text-[13px] font-semibold text-[#0D4FA0] [font-family:inherit] hover:border-[#0D4FA0] hover:bg-[#F8F9FC] disabled:opacity-60"
            >
              <Pending pending={converting} label="Converting…">
                {preview ? "Change image" : "Upload image"}
              </Pending>
            </button>
            {progress !== null && <ProgressBar value={progress} />}
            <label className={label}>
              Image style
              <select value={form.media} onChange={(e) => set("media", e.target.value as ProductFormValues["media"])} className={select}>
                <option value="placeholder">Plain photo</option>
                <option value="plate">Lab plate frame</option>
              </select>
            </label>
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
