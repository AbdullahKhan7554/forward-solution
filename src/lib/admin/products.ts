/**
 * Admin product form ↔ products row mapping. The form edits a subset of
 * ProductDetailData; everything else already in products.data is preserved
 * so the public product page can render the row unchanged.
 */
import type { ProductDetailData } from "@/components/product-detail/types";

export type Section = "poultry" | "ruminants";

export const SECTIONS: { value: Section; label: string }[] = [
  { value: "poultry", label: "Poultry" },
  { value: "ruminants", label: "Ruminants" },
];

export const sectionLabel = (s: string) => SECTIONS.find((x) => x.value === s)?.label ?? s;

/** products.data — ProductDetailData minus the fields kept in their own columns. */
export type ProductData = Omit<ProductDetailData, "slug" | "catalog" | "name" | "subtitle">;

export type ProductRow = {
  id: string;
  slug: string;
  section: Section;
  category: string;
  name: string;
  subtitle: string | null;
  image_url: string | null;
  is_live: boolean;
  sort_order: number;
  data: Partial<ProductData>;
  updated_at: string;
};

/** Final call-to-action copy (poultry pages only); blank fields fall back to the page defaults. */
export type CtaForm = {
  top: string;
  bottom: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
};
const CTA_KEYS = ["top", "bottom", "body", "primaryLabel", "secondaryLabel", "secondaryHref"] as const;

/** One field per thing the public product page renders (see ProductDetail / ProductCompact). */
export type ProductFormValues = {
  name: string;
  /** hero: small caps line under the name — products.subtitle */
  subtitle: string;
  /** hero: paragraph under the name — data.intro */
  description: string;
  specs: { label: string; value: string }[];
  /** "Key benefits" tick list — data.benefits, one line each */
  benefits: string[];
  applications: string[];
  imageUrl: string | null;
  /** hero image frame — data.media; the page treats a missing value as "plate" */
  media: "plate" | "placeholder";
  cta: CtaForm;
  metaTitle: string;
  metaDescription: string;
  section: Section;
  category: string;
  isLive: boolean;
};

const emptyCta = (): CtaForm => ({ top: "", bottom: "", body: "", primaryLabel: "", secondaryLabel: "", secondaryHref: "" });

export function emptyForm(section: Section = "poultry", category = ""): ProductFormValues {
  return {
    name: "",
    subtitle: "",
    description: "",
    specs: [{ label: "", value: "" }],
    benefits: [""],
    applications: [],
    imageUrl: null,
    media: "placeholder",
    cta: emptyCta(),
    metaTitle: "",
    metaDescription: "",
    section,
    category,
    isLive: true,
  };
}

export function rowToForm(row: ProductRow): ProductFormValues {
  const d = row.data ?? {};
  return {
    name: row.name,
    subtitle: row.subtitle ?? "",
    description: d.intro ?? "",
    specs: (d.specs ?? []).map((s) => ({ label: s.label, value: s.values.join(", ") })),
    benefits: [...(d.benefits ?? [])],
    applications: d.applications ?? [],
    imageUrl: row.image_url ?? d.assets?.hero ?? null,
    media: d.media ?? "plate",
    cta: { ...emptyCta(), ...d.cta },
    metaTitle: d.metaTitle ?? "",
    metaDescription: d.metaDescription ?? "",
    section: row.section,
    category: row.category,
    isLive: row.is_live,
  };
}

/**
 * Merges the form into an existing products.data (or a fresh one for new products).
 * Saving an untouched form must reproduce `existing` exactly (scripts/check-product-roundtrip.ts):
 * text is kept verbatim unless it changed, and optional keys are only written when they carry a value.
 * `prevImageUrl` is the row's image before editing, so an unchanged image leaves `assets` alone.
 */
export function formToData(
  form: ProductFormValues,
  existing: Partial<ProductData> = {},
  prevImageUrl: string | null = existing.assets?.hero ?? null,
): ProductData {
  const isNew = Object.keys(existing).length === 0;
  const name = form.name.trim();
  const category = form.category.trim();
  const section = sectionLabel(form.section);
  // keep the stored string when only surrounding whitespace differs
  const text = (value: string, prev: string | undefined) => (prev !== undefined && prev.trim() === value.trim() ? prev : value.trim());
  const intro = text(form.description, existing.intro);

  const specs = form.specs
    .filter((s) => s.label.trim() || s.value.trim())
    .map((s, i) => {
      // keep the original row (and its values array) when the edited text is unchanged
      const prev = existing.specs?.[i]?.label.trim() === s.label.trim() ? existing.specs[i] : existing.specs?.find((p) => p.label.trim() === s.label.trim());
      if (prev && prev.values.join(", ") === s.value.trim()) return prev;
      return { label: s.label.trim(), values: s.value.trim() ? [s.value.trim()] : [] };
    });

  const benefits = form.benefits
    .filter((b) => b.trim())
    .map((b, i) => text(b, existing.benefits?.[i]));

  const applications = form.applications.map((a) => a.trim()).filter(Boolean);

  let assets = existing.assets;
  if (form.imageUrl && form.imageUrl !== prevImageUrl) {
    const oldHero = existing.assets?.hero;
    assets = {
      ...existing.assets,
      hero: form.imageUrl,
      overview:
        !existing.assets?.overview || existing.assets.overview === oldHero ? form.imageUrl : existing.assets.overview,
    };
  }

  // cta: write a key when it has text, or when it was already stored (so clearing keeps the key as "")
  const cta: Partial<CtaForm> = {};
  for (const k of CTA_KEYS) {
    const prev = existing.cta?.[k];
    if (form.cta[k].trim() || prev !== undefined) cta[k] = text(form.cta[k], prev);
  }
  const hasCta = Object.keys(cta).length > 0;

  const metaTitle = text(form.metaTitle, existing.metaTitle) || `${name} — Agriprom Pakistan | ${section} ${category}`;
  const metaDescription =
    text(form.metaDescription, existing.metaDescription) ||
    (isNew ? (intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}…` : intro) : "");

  const rest = { ...existing };
  delete rest.cta;
  delete rest.media;
  return {
    overviewLead: "",
    overviewPoints: [],
    flow: [],
    ...rest,
    eyebrow: `${section} · ${category}`,
    intro,
    specs,
    benefits,
    applications,
    metaTitle,
    metaDescription,
    // a missing media already means "plate", so don't write the default onto old rows
    ...(existing.media !== undefined || form.media !== "plate" ? { media: form.media } : {}),
    ...(hasCta ? { cta: cta as ProductData["cta"] } : {}),
    ...(assets ? { assets } : {}),
  };
}

const TZ = "Asia/Karachi";
const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

/** "Today" / "Yesterday" / "26 Oct" — the admin lists' Updated column. */
export function updatedLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (dayKey(d) === dayKey(now)) return "Today";
  if (dayKey(d) === dayKey(new Date(now.getTime() - 86_400_000))) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: TZ });
}

export function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
