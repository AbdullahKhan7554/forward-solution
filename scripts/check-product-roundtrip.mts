/**
 * Read-only check: every product, loaded into the admin form and saved back (in memory,
 * with no edits), must come out identical to the stored row. Run: npm run check:products
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. Never writes.
 */
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { formToData, rowToForm, type ProductRow } from "../src/lib/admin/products.ts";

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

// key-order-insensitive, like jsonb
const canon = (v: unknown): string =>
  JSON.stringify(v, (_k, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b)))
      : x,
  );

const { data: rows, error } = await supabase.from("products").select("*").order("section").order("name");
if (error) throw new Error(error.message);

let failed = 0;
for (const row of rows as ProductRow[]) {
  const form = rowToForm(row);
  // the same column/data writes saveProduct() makes
  const saved = {
    section: form.section,
    category: form.category.trim(),
    name: form.name.trim(),
    subtitle: form.subtitle.trim() || null,
    image_url: form.imageUrl,
    is_live: form.isLive,
    data: formToData(form, row.data ?? {}, row.image_url ?? row.data?.assets?.hero ?? null),
  };
  const diffs: string[] = [];
  for (const [k, v] of Object.entries(saved)) {
    if (k === "data") continue;
    if (canon(row[k as keyof ProductRow] ?? null) !== canon(v)) diffs.push(k);
  }
  const before = (row.data ?? {}) as Record<string, unknown>;
  const after = saved.data as Record<string, unknown>;
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (canon(before[k]) !== canon(after[k])) diffs.push(`data.${k}`);
  }
  if (diffs.length) failed++;
  console.log(`${diffs.length ? "FAIL" : "ok  "}  ${row.section.padEnd(9)} ${row.slug.padEnd(34)} ${diffs.join(", ")}`);
}

console.log(`\n${rows.length - failed}/${rows.length} products round-trip unchanged.`);
process.exit(failed ? 1 : 0);
