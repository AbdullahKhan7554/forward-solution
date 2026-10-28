import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product-detail/ProductPage";
import { findProduct, getSectionProducts, productMetadata } from "@/lib/catalog";

type Params = { params: { slug: string; product: string } };

export async function generateStaticParams() {
  const products = await getSectionProducts("poultry");
  return products
    .map((p) => p.href.split("/").slice(3))
    .filter((s) => s.length === 2)
    .map(([slug, product]) => ({ slug, product }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await findProduct(`/products/poultry/${params.slug}/${params.product}`);
  return product ? productMetadata(product) : {};
}

/** Poultry product nested under its category, e.g. /products/poultry/organic-acids-scfa/prophorce-sr130. */
export default async function PoultryProductPage({ params }: Params) {
  const product = await findProduct(`/products/poultry/${params.slug}/${params.product}`);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
