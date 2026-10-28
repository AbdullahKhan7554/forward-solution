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

export type ProductFormValues = {
  name: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  benefits: { title: string; text: string }[];
  applications: string[];
  imageUrl: string | null;
  section: Section;
  category: string;
  isLive: boolean;
};

/** A benefit is one string on the site; the form splits "Title — text" into two inputs. */
const BENEFIT_SEP = " — ";

export function emptyForm(section: Section = "poultry", category = ""): ProductFormValues {
  return {
    name: "",
    subtitle: "",
    description: "",
    specs: [{ label: "", value: "" }],
    benefits: [{ title: "", text: "" }],
    applications: [],
    imageUrl: null,
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
    benefits: (d.benefits ?? []).map((b) => {
      const i = b.indexOf(BENEFIT_SEP);
      return i === -1
        ? { title: b, text: "" }
        : { title: b.slice(0, i), text: b.slice(i + BENEFIT_SEP.length) };
    }),
    applications: d.applications ?? [],
    imageUrl: row.image_url ?? d.assets?.hero ?? null,
    section: row.section,
    category: row.category,
    isLive: row.is_live,
  };
}

/** Merges the form into an existing products.data (or a fresh one for new products). */
export function formToData(form: ProductFormValues, existing: Partial<ProductData> = {}): ProductData {
  const name = form.name.trim();
  const category = form.category.trim();
  const section = sectionLabel(form.section);
  const intro = form.description.trim();

  const specs = form.specs
    .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
    .filter((s) => s.label || s.value)
    .map((s) => {
      // keep the original values array when the joined text is unchanged
      const prev = existing.specs?.find((p) => p.label === s.label);
      return prev && prev.values.join(", ") === s.value
        ? prev
        : { label: s.label, values: s.value ? [s.value] : [] };
    });

  const benefits = form.benefits
    .map((b) => ({ title: b.title.trim(), text: b.text.trim() }))
    .filter((b) => b.title || b.text)
    .map((b) => (b.title && b.text ? `${b.title}${BENEFIT_SEP}${b.text}` : b.title || b.text));

  const applications = form.applications.map((a) => a.trim()).filter(Boolean);

  const oldHero = existing.assets?.hero;
  const assets = form.imageUrl
    ? {
        ...existing.assets,
        hero: form.imageUrl,
        overview:
          !existing.assets?.overview || existing.assets.overview === oldHero
            ? form.imageUrl
            : existing.assets.overview,
      }
    : existing.assets;

  return {
    overviewLead: "",
    overviewPoints: [],
    flow: [],
    media: "placeholder",
    metaTitle: `${name} — Agriprom Pakistan | ${section} ${category}`,
    metaDescription: intro.length > 160 ? `${intro.slice(0, 157).trimEnd()}…` : intro,
    ...existing,
    eyebrow: `${section} · ${category}`,
    intro,
    specs,
    benefits,
    applications,
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
