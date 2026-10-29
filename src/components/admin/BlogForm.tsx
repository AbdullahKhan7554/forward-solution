"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { saveBlog } from "@/app/admin/blogs/actions";
import { useToast } from "@/components/admin/Toast";
import { toWebp, uploadWebp } from "@/lib/admin/image";
import { Pending, ProgressBar, Spinner } from "@/components/admin/Spinner";
import { LIMITS } from "@/lib/admin/limits";
import { FILTERS, docToSections, slugify, type BlogFormValues, type BlogStatus } from "@/lib/admin/blogs";
import type { FilterCategory } from "@/components/info-center/types";

type Props = {
  id: string | null;
  /** the row's updated_at when loaded — sent with saves to catch someone else's edit */
  updatedAt: string | null;
  initial: BlogFormValues;
  categories: string[];
};

const MAX_IMAGE = 1600;

const card = "rounded-xl border border-[#E3E7EF] bg-white p-4 md:p-5";
const label = "flex flex-col gap-[6px] text-[13px] font-semibold";
const field =
  "rounded-lg border border-[#D5DAE6] bg-white p-[10px] text-[14px] font-normal text-[#1B1F3B] [font-family:inherit]";
const hint = "text-[12px] font-normal text-[#5B6178]";
const addBtn =
  "rounded-md border border-[#D5DAE6] bg-white px-3 py-[6px] text-[13px] font-semibold text-[#0D4FA0] [font-family:inherit] hover:border-[#B8C0D4] hover:bg-[#F8F9FC]";
const removeBtn = "h-11 w-11 shrink-0 border-none bg-transparent text-[18px] text-[#8A90A6] hover:text-[#B42318] md:h-8 md:w-8";
const btn = "rounded-lg px-[18px] py-[11px] text-[14px] font-semibold [font-family:inherit] disabled:opacity-60";
const tool =
  "h-9 min-w-[44px] rounded-md border-none px-[10px] lg:min-w-0 text-[13px] font-semibold text-[#1B1F3B] [font-family:inherit] hover:bg-[#EEF1F6] disabled:opacity-50";
const toolOn = "bg-[#E3E7EF]";
// content styling inside the editor (the admin has no typography plugin)
const prose =
  "h-full p-[18px] text-[15px] font-normal leading-[1.7] text-[#1B1F3B] outline-none [&_a]:text-[#0D4FA0] [&_a]:underline [&_h2]:mb-[10px] [&_h2]:mt-4 [&_h2]:text-[19px] [&_h2]:font-bold [&_h2:first-child]:mt-0 [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-lg [&_img.ProseMirror-selectednode]:outline [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-[#008848] [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_p]:mt-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6";

function Toolbar({ editor, onImage, uploading }: { editor: Editor | null; onImage: () => void; uploading: number | null }) {
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      h2: e?.isActive("heading", { level: 2 }) ?? false,
      list: e?.isActive("bulletList") ?? false,
      link: e?.isActive("link") ?? false,
    }),
  });

  function setLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt("Link address (leave empty to remove the link)", current ?? "https://");
    if (input === null) return;
    const href = input.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href || href === "https://") return chain.unsetLink().run();
    const url = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : `https://${href}`;
    if (editor.state.selection.empty && !active?.link) {
      editor.chain().focus().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href: url } }] }).run();
    } else {
      chain.setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-[#E3E7EF] bg-[#F8F9FC] p-2">
      <button
        type="button"
        aria-label="Bold"
        aria-pressed={active?.bold}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`${tool} w-9 px-0 text-[15px] font-bold ${active?.bold ? toolOn : "bg-transparent"}`}
      >
        B
      </button>
      <button
        type="button"
        aria-label="Italic"
        aria-pressed={active?.italic}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`${tool} w-9 px-0 text-[15px] font-normal italic ${active?.italic ? toolOn : "bg-transparent"}`}
      >
        I
      </button>
      <button
        type="button"
        aria-pressed={active?.h2}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${tool} ${active?.h2 ? toolOn : "bg-transparent"}`}
      >
        H2
      </button>
      <button
        type="button"
        aria-pressed={active?.list}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`${tool} ${active?.list ? toolOn : "bg-transparent"}`}
      >
        • List
      </button>
      <button
        type="button"
        aria-pressed={active?.link}
        onClick={setLink}
        className={`${tool} ${active?.link ? toolOn : "bg-transparent"}`}
      >
        Link
      </button>
      <button type="button" disabled={uploading !== null} onClick={onImage} className={`${tool} bg-transparent`}>
        <Pending pending={uploading !== null} label={`Uploading ${Math.round(uploading ?? 0)}%…`}>
          + Image
        </Pending>
      </button>
    </div>
  );
}

export function BlogForm({ id, updatedAt, initial, categories }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [cover, setCover] = useState<{ blob: Blob; preview: string } | null>(null);
  const [converting, setConverting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [coverProgress, setCoverProgress] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState<BlogStatus | null>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
    ],
    content: initial.content,
    editorProps: { attributes: { class: prose, "aria-label": "Content" } },
    onUpdate: ({ editor: e }) => setForm((f) => ({ ...f, content: e.isEmpty ? "" : e.getHTML(), doc: e.getJSON() })),
  });

  const isEmpty = useEditorState({ editor, selector: ({ editor: e }) => e?.isEmpty ?? true });

  useEffect(() => () => {
    if (cover) URL.revokeObjectURL(cover.preview);
  }, [cover]);

  const categoryOptions =
    form.category && !categories.includes(form.category) ? [form.category, ...categories] : categories;

  function changeTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  async function pickCover(file: File | undefined) {
    if (!file) return;
    setConverting(true);
    try {
      const blob = await toWebp(file, MAX_IMAGE);
      setCover({ blob, preview: URL.createObjectURL(blob) });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't process that image.");
    } finally {
      setConverting(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  }

  function dropCover(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    pickCover(e.dataTransfer.files?.[0]);
  }

  async function insertImage(file: File | undefined) {
    if (!file || !editor) return;
    setUploadingImage(0);
    try {
      const src = await uploadWebp(await toWebp(file, MAX_IMAGE), "blogs", setUploadingImage);
      editor.chain().focus().setImage({ src, alt: "" }).run();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't add that image.");
    } finally {
      setUploadingImage(null);
      if (imageInput.current) imageInput.current.value = "";
    }
  }

  async function save(status: BlogStatus) {
    if (!form.title.trim()) return toast.error("Title is required.");
    if (!slugify(form.slug || form.title)) return toast.error("The URL slug needs at least one letter or number.");
    if (!form.category.trim()) return toast.error("Choose a category.");
    if (!form.publishDate) return toast.error("Choose a publish date.");
    setSaving(status);
    try {
      let coverUrl = form.coverUrl;
      if (cover) {
        setCoverProgress(0);
        coverUrl = await uploadWebp(cover.blob, "blogs", setCoverProgress);
        setCoverProgress(null);
      }
      const res = await saveBlog(id, { ...form, coverUrl }, status, updatedAt);
      if (!res.ok) return toast.error(res.error);
      setForm((f) => ({ ...f, coverUrl, slug: res.slug }));
      setCover(null);
      toast.success(status === "published" ? "Published" : "Saved as draft");
      if (!id) router.replace(`/admin/blogs/${res.id}`);
      else router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save. Please try again.");
    } finally {
      setSaving(null);
      setCoverProgress(null);
    }
  }

  const busy = saving !== null || converting || uploadingImage !== null;
  const uploadLabel = coverProgress !== null ? `Uploading ${Math.round(coverProgress)}%…` : null;
  const preview = cover?.preview ?? form.coverUrl;

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="contents lg:flex lg:items-center lg:justify-between">
        <div>
          <Link href="/admin/blogs" className="text-[13px] font-semibold text-[#0D4FA0] no-underline hover:text-[#008848]">
            ← All blogs
          </Link>
          <h1 className="mb-0 mt-[6px] text-[26px] font-bold">{id ? "Edit blog" : "New blog"}</h1>
        </div>
        <div className="order-last flex flex-col gap-[10px] lg:order-none lg:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => save("draft")}
            className={`${btn} border border-[#D5DAE6] bg-white text-[#1B1F3B] hover:border-[#B8C0D4]`}
          >
            <Pending pending={saving === "draft"} label={uploadLabel ?? "Saving…"}>
              Save draft
            </Pending>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => save("published")}
            className={`${btn} border-none bg-[#008848] text-white`}
          >
            <Pending pending={saving === "published"} label={uploadLabel ?? "Publishing…"}>
              Publish
            </Pending>
          </button>
        </div>
      </div>

      <div className="flex grow flex-col gap-[18px] lg:flex-row">
        <div className="flex min-w-0 grow flex-col gap-4 rounded-xl border border-[#E3E7EF] bg-white p-4 md:p-6">
          <div className="flex flex-col gap-[6px]">
            <label className={label}>
              Title
              <input
                type="text"
                maxLength={LIMITS.blogTitle}
                value={form.title}
                onChange={(e) => changeTitle(e.target.value)}
                className="rounded-lg border border-[#D5DAE6] p-3 text-[20px] font-semibold text-[#1B1F3B] [font-family:inherit]"
              />
            </label>
            <label className="flex items-center gap-1 text-[12px] text-[#5B6178]">
              URL: /blog/
              <input
                type="text"
                aria-label="URL slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                onBlur={() => set("slug", slugify(form.slug || form.title))}
                className="min-w-0 grow rounded-md border border-transparent px-[6px] py-[3px] text-[12px] text-[#1B1F3B] [font-family:inherit] hover:border-[#D5DAE6] focus:border-[#D5DAE6]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-[6px] text-[13px] font-semibold">
            Content
            <div className="flex h-[520px] flex-col overflow-hidden rounded-lg border border-[#D5DAE6]">
              <Toolbar editor={editor} onImage={() => imageInput.current?.click()} uploading={uploadingImage} />
              <div className="relative min-h-0 grow cursor-text overflow-y-auto" onClick={() => editor?.commands.focus()}>
                {isEmpty && (
                  <p className="pointer-events-none absolute left-[18px] right-[18px] top-[18px] m-0 text-[15px] font-normal leading-[1.7] text-[#8A90A6]">
                    Write the blog here, just like in Word. Add headings, lists, links and pictures from the toolbar above.
                  </p>
                )}
                <EditorContent editor={editor} className="h-full" />
              </div>
            </div>
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => insertImage(e.target.files?.[0])}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold">Key takeaways</div>
              <button type="button" onClick={() => set("takeaways", [...form.takeaways, ""])} className={addBtn}>
                + Add takeaway
              </button>
            </div>
            <span className={hint}>The highlighted panel at the end of the post. Leave empty to hide it.</span>
            {form.takeaways.map((t, i) => (
              <div key={i} className="flex items-center gap-[10px]">
                <input
                  type="text"
                  aria-label={`Takeaway ${i + 1}`}
                  value={t}
                  onChange={(e) => set("takeaways", form.takeaways.map((x, j) => (j === i ? e.target.value : x)))}
                  className={`${field} min-w-0 grow`}
                />
                <button
                  type="button"
                  aria-label="Remove takeaway"
                  onClick={() => set("takeaways", form.takeaways.filter((_, j) => j !== i))}
                  className={removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-[18px] lg:w-[340px]">
          <div className={`${card} flex flex-col gap-3`}>
            <div className="text-[15px] font-semibold">Cover image</div>
            <div
              role="button"
              tabIndex={0}
              aria-label={preview ? "Change cover image" : "Upload cover image"}
              onClick={() => !busy && coverInput.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !busy) {
                  e.preventDefault();
                  coverInput.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={dropCover}
              className={`relative flex h-[150px] cursor-pointer flex-col items-center justify-center gap-[6px] overflow-hidden rounded-lg border-2 border-dashed text-[13px] text-[#5B6178] ${
                dragOver ? "border-[#008848] bg-[#E6F4EC]" : "border-[#B8C0D4] hover:border-[#0D4FA0] hover:bg-[#F8F9FC]"
              }`}
            >
              {preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[12px] font-semibold text-[#0D4FA0]">
                    <Pending pending={converting} label="Converting…">
                      Change
                    </Pending>
                  </span>
                </>
              ) : converting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Converting…
                </span>
              ) : (
                <>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5B6178"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 16V4" />
                    <path d="M7 9l5-5 5 5" />
                    <path d="M4 20h16" />
                  </svg>
                  <span>
                    Drag a picture here or <span className="font-semibold text-[#0D4FA0]">browse</span>
                  </span>
                </>
              )}
            </div>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickCover(e.target.files?.[0])}
            />
            {coverProgress !== null && <ProgressBar value={coverProgress} />}
          </div>

          <div className={`${card} flex flex-col gap-[14px]`}>
            <label className={label}>
              Category
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={field}>
                {!form.category && <option value="">Choose a category</option>}
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Short summary
              <textarea
                rows={3}
                placeholder="2 lines shown on the blog list"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className={`${field} resize-none`}
              />
            </label>
            <label className={label}>
              Publish date
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => set("publishDate", e.target.value)}
                className={field}
              />
            </label>
            <label className={label}>
              Author
              <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} className={field} />
              <span className={hint}>
                Shown under the title with the date and{" "}
                {form.doc ? docToSections(form.doc).readingTime : form.readingTime}.
              </span>
            </label>
            <label className={label}>
              Blog page filter
              <select
                value={form.filter}
                onChange={(e) => set("filter", e.target.value as FilterCategory | "")}
                className={field}
              >
                {!form.filter && <option value="">Automatic (from category)</option>}
                {FILTERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <span className={hint}>The filter button on the blog page that lists this post.</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
