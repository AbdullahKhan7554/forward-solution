/**
 * Admin blog form ↔ blogs row mapping, one form field per thing the public post
 * page renders (see lib/blog.ts toArticle + ArticleView):
 *   title, category, excerpt, cover_url  → own columns
 *   body      → blogs.content (editor HTML). The page shows data.sections instead when
 *               they exist, so once the body is edited here sections are cleared and
 *               the page renders exactly the editor HTML (links, lists, images).
 *   author, takeaways, filter (listing group), date, readingTime → blogs.data
 * Saving an untouched form must reproduce the row exactly (scripts/check-blog-roundtrip.mts).
 */
import type { JSONContent } from "@tiptap/react";
import type { Article, FilterCategory } from "@/components/info-center/types";

export type BlogStatus = "draft" | "published";

/** blogs.data — Article minus the fields kept in their own columns. */
export type BlogData = Omit<Article, "slug" | "title" | "category" | "excerpt" | "image">;

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string | null;
  status: BlogStatus;
  published_at: string | null;
  data: Partial<BlogData>;
  updated_at: string;
};

export type BlogFormValues = {
  title: string;
  slug: string;
  /** Editor HTML (blogs.content). */
  content: string;
  /** Editor document, used to derive intro/sections. Null until the editor changes. */
  doc: JSONContent | null;
  coverUrl: string | null;
  category: string;
  excerpt: string;
  /** YYYY-MM-DD */
  publishDate: string;
  /** byline — data.author */
  author: string;
  /** "Key takeaways" panel — data.takeaways */
  takeaways: string[];
  /** listing page filter pill — data.filter; "" = pick automatically (new posts) */
  filter: FilterCategory | "";
  /** byline reading time — data.readingTime; recalculated whenever the body changes */
  readingTime: string;
};

export const FILTERS: FilterCategory[] = ["Poultry", "Ruminants", "Veterinary", "Nutrition", "Industry News"];

const DEFAULT_AUTHOR = "Agriprom Technical Team";
const WORDS_PER_MINUTE = 200;

export const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });

export function emptyBlogForm(category = ""): BlogFormValues {
  return {
    title: "",
    slug: "",
    content: "",
    doc: null,
    coverUrl: null,
    category,
    excerpt: "",
    publishDate: today(),
    author: DEFAULT_AUTHOR,
    takeaways: [],
    filter: "",
    readingTime: "1 min read",
  };
}

export function rowToBlogForm(row: BlogRow): BlogFormValues {
  const d = row.data ?? {};
  return {
    title: row.title,
    slug: row.slug,
    content: row.content ?? "",
    doc: null,
    coverUrl: row.cover_url,
    category: row.category,
    excerpt: row.excerpt ?? "",
    publishDate: row.published_at ? row.published_at.slice(0, 10) : today(),
    author: d.author ?? DEFAULT_AUTHOR,
    takeaways: [...(d.takeaways ?? [])],
    filter: d.filter ?? "",
    readingTime: d.readingTime ?? "1 min read",
  };
}

/** "2025-05-25" → "May 25, 2025", the format the public blog uses. */
export function articleDate(isoDay: string) {
  return new Date(`${isoDay}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function textOf(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return " ";
  return (node.content ?? []).map(textOf).join("");
}

/** Splits the editor document into the Article intro + sections (images are skipped). */
export function docToSections(doc: JSONContent) {
  const intro: string[] = [];
  const sections: BlogData["sections"] = [];
  const push = (text: string) => {
    const t = text.replace(/\s+/g, " ").trim();
    if (!t) return;
    if (sections.length) sections[sections.length - 1].paragraphs.push(t);
    else intro.push(t);
  };

  for (const node of doc.content ?? []) {
    if (node.type === "heading") {
      sections.push({ heading: textOf(node).trim() || undefined, paragraphs: [] });
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      (node.content ?? []).forEach((item) => push(textOf(item)));
    } else if (node.type !== "image") {
      push(textOf(node));
    }
  }

  const words = [...intro, ...sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs])]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    intro: intro.join(" "),
    sections,
    readingTime: `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`,
  };
}

/** The row a save writes, minus slug/status/data. `existing` keeps untouched values byte-identical. */
export function formToBlogColumns(form: BlogFormValues, existing?: Pick<BlogRow, "excerpt" | "published_at"> | null) {
  const excerpt = form.excerpt.trim();
  return {
    title: form.title.trim(),
    category: form.category.trim(),
    excerpt: existing?.excerpt != null && existing.excerpt.trim() === excerpt ? existing.excerpt : excerpt || null,
    cover_url: form.coverUrl,
    content: form.content,
    // keep the stored timestamp when the day didn't change
    published_at:
      existing?.published_at && existing.published_at.slice(0, 10) === form.publishDate
        ? existing.published_at
        : `${form.publishDate}T00:00:00Z`,
  };
}

/** Merges the form into an existing blogs.data (or a fresh one for new posts). */
export function formToBlogData(
  form: BlogFormValues,
  slug: string,
  filter: FilterCategory,
  existing: Partial<BlogData> = {},
  prevPublishDay?: string | null,
): BlogData {
  const keep = (value: string, prev: string | undefined) => (prev !== undefined && prev.trim() === value.trim() ? prev : value.trim());
  // body edited → the page must show the editor HTML, so drop the old structured copy
  const body = form.doc ? { ...docToSections(form.doc), sections: [] } : null;
  const takeaways = form.takeaways.filter((t) => t.trim()).map((t, i) => keep(t, existing.takeaways?.[i]));
  return {
    intro: "",
    sections: [],
    ...existing,
    ...body,
    author: keep(form.author, existing.author) || DEFAULT_AUTHOR,
    takeaways,
    readingTime: body?.readingTime ?? (keep(form.readingTime, existing.readingTime) || "1 min read"),
    filter,
    date: existing.date && prevPublishDay === form.publishDate ? existing.date : articleDate(form.publishDate),
    href: `/blog/${slug}`,
  };
}

export { slugify } from "@/lib/admin/products";
