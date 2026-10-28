/**
 * Read-only check: every blog post, loaded into the admin form and saved back (in memory,
 * with no edits, same status), must come out identical to the stored row.
 * Run: npm run check:blogs. Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import fs from "node:fs";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

// lib/admin/blogs.ts re-exports from "@/lib/admin/products": map the tsconfig alias for plain Node
const src = pathToFileURL(`${process.cwd()}/src/`).href;
register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(spec, ctx, next) {
      if (spec.startsWith("@/")) return next(${JSON.stringify(src)} + spec.slice(2) + ".ts", ctx);
      return next(spec, ctx);
    }`)}`,
);
const { FILTERS, formToBlogColumns, formToBlogData, rowToBlogForm, slugify } = await import("../src/lib/admin/blogs.ts");

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]),
);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// key-order-insensitive, like jsonb; timestamps compared as instants
const canon = (v: unknown): string =>
  JSON.stringify(v, (_k, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b)))
      : x,
  );
const same = (k: string, a: unknown, b: unknown) =>
  k === "published_at" && a && b ? Date.parse(a as string) === Date.parse(b as string) : canon(a ?? null) === canon(b ?? null);

const { data: rows, error } = await supabase.from("blogs").select("*").order("published_at");
if (error) throw new Error(error.message);

let failed = 0;
for (const row of rows) {
  const form = rowToBlogForm(row);
  // the same writes saveBlog() makes (filter: the form's value is valid, so it wins)
  const slug = slugify(form.slug || form.title);
  const filter = FILTERS.includes(form.filter) ? form.filter : "Industry News";
  const saved = {
    ...formToBlogColumns(form, row),
    slug,
    status: row.status,
    data: formToBlogData(form, slug, filter, row.data ?? {}, row.published_at?.slice(0, 10)),
  };
  const diffs: string[] = [];
  for (const [k, v] of Object.entries(saved)) if (k !== "data" && !same(k, row[k], v)) diffs.push(k);
  const before = (row.data ?? {}) as Record<string, unknown>;
  const after = saved.data as Record<string, unknown>;
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (canon(before[k]) !== canon(after[k])) diffs.push(`data.${k}`);
  }
  if (diffs.length) failed++;
  console.log(`${diffs.length ? "FAIL" : "ok  "}  ${row.status.padEnd(9)} ${row.slug.padEnd(44)} ${diffs.join(", ")}`);
}

console.log(`\n${rows.length - failed}/${rows.length} blog posts round-trip unchanged.`);
process.exit(failed ? 1 : 0);
