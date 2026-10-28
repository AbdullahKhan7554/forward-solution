/**
 * INFO CENTER — knowledge library types. Posts come from the Supabase blogs
 * table (see lib/blog.ts). `Article` is a structural superset of `BlogPost`,
 * so the existing BlogCard renders articles unchanged.
 */

export type BlogPost = {
  title: string;
  category: string;
  date: string;
  readingTime: string;
  excerpt: string;
  href: string;
  image?: string;
};

export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

/** Broad filter groups surfaced as pills on the listing page. */
export type FilterCategory =
  | "Poultry"
  | "Ruminants"
  | "Veterinary"
  | "Nutrition"
  | "Industry News";

/** Ordered filter set for the BlogFilters pills ("All" first). */
export const ARTICLE_FILTERS = [
  "All",
  "Poultry",
  "Ruminants",
  "Veterinary",
  "Nutrition",
  "Industry News",
] as const;

export type Article = BlogPost & {
  slug: string;
  filter: FilterCategory;
  author: string;
  intro: string;
  sections: ArticleSection[];
  takeaways: string[];
  /** Sanitized editor HTML — rendered as the body when `sections` is empty (posts written in the admin). */
  html?: string;
};
