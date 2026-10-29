import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/product-detail/CategoryPage";
import { ProductPage } from "@/components/product-detail/ProductPage";
import { SITE, findProduct, getCategoryPage, getCategoryPages, getSectionProducts, productMetadata } from "@/lib/catalog";

type Params = { params: { slug: string } };

/** /products/poultry/<slug> is either a category page or a top-level product (Enzymes, Toxin Binders, Organic Acids). */
async function resolve(slug: string) {
  const category = await getCategoryPage("poultry", slug);
  if (category) return { category };
  const product = await findProduct(`/products/poultry/${slug}`);
  return product ? { product } : null;
}

export async function generateStaticParams() {
  const [pages, products] = await Promise.all([getCategoryPages("poultry"), getSectionProducts("poultry")]);
  const flat = products.map((p) => p.href.split("/").slice(3)).filter((s) => s.length === 1);
  return [...pages.map((c) => ({ slug: c.id })), ...flat.map(([slug]) => ({ slug }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await resolve(params.slug);
  if (!page) return {};
  if (page.product) return productMetadata(page.product);
  return {
    title: page.category.title,
    description: page.category.description,
    alternates: { canonical: `${SITE}/products/poultry/${page.category.id}` },
  };
}

export default async function PoultrySlugPage({ params }: Params) {
  const page = await resolve(params.slug);
  if (!page) notFound();
  return page.product ? <ProductPage product={page.product} /> : <CategoryPage page={page.category} />;
}
