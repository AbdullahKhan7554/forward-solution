/**
 * Seeds Supabase with the products and blogs currently hard-coded in
 * src/components/product-detail/products.ts and src/components/info-center/articles.ts.
 *
 * Uploads every local image they reference (from /public) to the "media" bucket
 * and rewrites those paths to public bucket URLs. Upserts by slug, so it is safe to re-run.
 *
 * Usage: npx tsx scripts/seed.ts
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/components/product-detail/products";
import { articles } from "../src/components/info-center/articles";

try {
  process.loadEnvFile(".env.local");
} catch {
  // fall back to the existing environment
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "media";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_RE = /\.(webp|png|jpe?g|gif|svg|avif)$/i;
const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/** local "/path.webp" → public bucket URL (uploads once per path). */
const uploaded = new Map<string, Promise<string>>();

function upload(localPath: string): Promise<string> {
  let pending = uploaded.get(localPath);
  if (!pending) {
    pending = (async () => {
      const key = localPath.replace(/^\/+/, "");
      const body = await readFile(path.join(PUBLIC_DIR, key));
      const contentType =
        CONTENT_TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream";
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(key, body, { contentType, upsert: true });
      if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);
      return supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
    })();
    uploaded.set(localPath, pending);
  }
  return pending;
}

/** Deep-copies a value, uploading and replacing every local image path string. */
async function rewriteImages<T>(value: T): Promise<T> {
  if (typeof value === "string") {
    return (value.startsWith("/") && IMAGE_RE.test(value)
      ? await upload(value)
      : value) as T;
  }
  if (Array.isArray(value)) {
    return (await Promise.all(value.map(rewriteImages))) as T;
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([k, v]) => [k, await rewriteImages(v)] as const),
    );
    return Object.fromEntries(entries) as T;
  }
  return value;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function seedProducts() {
  // "elencofix-super" exists in both catalogues; suffix the later one with its section.
  const seen = new Set<string>();
  const rows = await Promise.all(
    Object.values(PRODUCTS).map(async (p, i) => {
      const section = p.catalog ?? "poultry";
      const uniqueSlug = seen.has(p.slug) ? `${p.slug}-${section}` : p.slug;
      seen.add(uniqueSlug);
      const { slug, catalog, name, subtitle, ...rest } = await rewriteImages(p);
      return {
        slug: uniqueSlug,
        section,
        category: rest.eyebrow.split("·").pop()!.trim(),
        name,
        subtitle: subtitle ?? null,
        image_url: rest.assets?.hero ?? rest.assets?.overview ?? null,
        is_live: true,
        sort_order: i,
        data: rest,
      };
    }),
  );
  const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`products upsert failed: ${error.message}`);
}

async function seedBlogs() {
  const rows = await Promise.all(
    articles.map(async (a) => {
      const { slug, title, category, excerpt, image, ...rest } = await rewriteImages(a);
      const content = [
        `<p>${escapeHtml(rest.intro)}</p>`,
        ...rest.sections.flatMap((s) => [
          ...(s.heading ? [`<h2>${escapeHtml(s.heading)}</h2>`] : []),
          ...s.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`),
        ]),
      ].join("\n");
      const published = new Date(`${rest.date} UTC`);
      return {
        slug,
        title,
        category,
        excerpt,
        cover_url: image ?? null,
        content,
        status: "published" as const,
        published_at: Number.isNaN(published.getTime()) ? null : published.toISOString(),
        data: rest,
      };
    }),
  );
  const { error } = await supabase.from("blogs").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`blogs upsert failed: ${error.message}`);
}

async function count(table: "products" | "blogs") {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return count;
}

async function main() {
  await seedProducts();
  await seedBlogs();
  console.log(`Uploaded images: ${uploaded.size}`);
  console.log(`products: ${await count("products")}`);
  console.log(`blogs: ${await count("blogs")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
