/**
 * Admin blog form ↔ blogs row mapping. The editor's HTML goes in blogs.content;
 * blogs.data keeps the remaining Article fields (intro, sections, date, …),
 * derived from the editor document, so the public blog page can render the
 * row unchanged. Fields the form doesn't edit (author, takeaways) are preserved.
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
};

export const FILTERS: FilterCategory[] = ["Poultry", "Ruminants", "Veterinary", "Nutrition", "Industry News"];

const DEFAULT_AUTHOR = "Agriprom Technical Team";
const WORDS_PER_MINUTE = 200;

export const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });

export function emptyBlogForm(category = ""): BlogFormValues {
  return { title: "", slug: "", content: "", doc: null, coverUrl: null, category, excerpt: "", publishDate: today() };
}

export function rowToBlogForm(row: BlogRow): BlogFormValues {
  return {
    title: row.title,
    slug: row.slug,
    content: row.content ?? "",
    doc: null,
    coverUrl: row.cover_url,
    category: row.category,
    excerpt: row.excerpt ?? "",
    publishDate: row.published_at ? row.published_at.slice(0, 10) : today(),
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

/** Merges the form into an existing blogs.data (or a fresh one for new posts). */
export function formToBlogData(
  form: BlogFormValues,
  slug: string,
  filter: FilterCategory,
  existing: Partial<BlogData> = {},
): BlogData {
  const derived = form.doc ? docToSections(form.doc) : null;
  return {
    author: DEFAULT_AUTHOR,
    takeaways: [],
    intro: "",
    sections: [],
    readingTime: "1 min read",
    ...existing,
    ...derived,
    filter,
    date: articleDate(form.publishDate),
    href: `/blog/${slug}`,
  };
}

export { slugify } from "@/lib/admin/products";
