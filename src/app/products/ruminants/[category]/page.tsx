import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/product-detail/CategoryPage";
import { getCategoryPage, getCategoryPages } from "@/lib/catalog";

type Params = { params: { category: string } };

export async function generateStaticParams() {
  return (await getCategoryPages("ruminants")).map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = await getCategoryPage("ruminants", params.category);
  return c ? { title: c.title, description: c.description } : {};
}

/** Ruminant category page — same template as the poultry category pages. */
export default async function RuminantCategoryPage({ params }: Params) {
  const c = await getCategoryPage("ruminants", params.category);
  if (!c) notFound();
  return <CategoryPage page={c} backHref="/products/ruminants" />;
}
