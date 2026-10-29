/**
 * Public knowledge library — published rows from the Supabase blogs table,
 * newest first. Server-only.
 */
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { createPublicClient } from "@/lib/supabase/public";
import { SITE } from "@/lib/catalog";
import { articleDate, type BlogRow } from "@/lib/admin/blogs";
import type { Article } from "@/components/info-center/types";

type Row = Pick<BlogRow, "slug" | "title" | "category" | "excerpt" | "cover_url" | "content" | "published_at" | "data" | "updated_at">;

/** Editor HTML allow-list: the TipTap StarterKit + Image output, nothing executable. */
function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
      "a", "ul", "ol", "li", "blockquote", "code", "pre", "img",
    ],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

function toArticle(row: Row): Article {
  const d = row.data ?? {};
  const sections = d.sections ?? [];
  return {
    filter: "Industry News",
    author: "Agriprom Technical Team",
    intro: "",
    takeaways: [],
    readingTime: "1 min read",
    ...d,
    sections,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt ?? d.intro ?? "",
    image: row.cover_url ?? undefined,
    href: `/blog/${row.slug}`,
    date: d.date ?? (row.published_at ? articleDate(row.published_at.slice(0, 10)) : ""),
    ...(sections.length === 0 && row.content ? { html: sanitize(row.content) } : {}),
  };
}

export type PublishedArticle = Article & { publishedAt: string | null; updatedAt: string };

/** Every published post, newest first. Deduped per render. */
export const getArticles = cache(async (): Promise<PublishedArticle[]> => {
  const { data, error } = await createPublicClient()
    .from("blogs")
    .select("slug, title, category, excerpt, cover_url, content, published_at, data, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .order("slug");
  if (error) throw new Error(`Couldn't load blogs: ${error.message}`);
  return (data as Row[]).map((r) => ({ ...toArticle(r), publishedAt: r.published_at, updatedAt: r.updated_at }));
});

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug);
}

/** BlogPosting structured data (JSON-LD). */
export function blogPostingJsonLd(a: PublishedArticle) {
  const url = `${SITE}/blog/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    ...(a.image ? { image: new URL(a.image, SITE).href } : {}),
    ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
    dateModified: a.updatedAt,
    author: { "@type": "Organization", name: a.author },
    publisher: { "@type": "Organization", name: "Agriprom Pakistan", logo: { "@type": "ImageObject", url: `${SITE}/logo.svg` } },
    mainEntityOfPage: url,
    url,
  };
}
