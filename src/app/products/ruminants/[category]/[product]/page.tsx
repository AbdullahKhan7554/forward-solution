import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail/ProductDetail";
import { PRODUCTS } from "@/components/product-detail/products";
import { RUMINANT_CATEGORIES, ruminantProductKey } from "@/components/ruminants/categories";

type Params = { params: { category: string; product: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return RUMINANT_CATEGORIES.flatMap((c) => c.products.map((product) => ({ category: c.id, product })));
}

export function generateMetadata({ params }: Params): Metadata {
  const data = PRODUCTS[ruminantProductKey(params.category, params.product)];
  if (!data) return {};
  return { title: data.metaTitle, description: data.metaDescription };
}

/** Ruminant product page — same ProductCompact template as poultry products. */
export default function RuminantProductPage({ params }: Params) {
  const data = PRODUCTS[ruminantProductKey(params.category, params.product)];
  if (!data) notFound();
  return <ProductDetail data={data} />;
}
