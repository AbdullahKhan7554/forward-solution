import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product-detail/ProductPage";
import { findProduct, getSectionProducts, productMetadata } from "@/lib/catalog";

type Params = { params: { category: string; product: string } };

export async function generateStaticParams() {
  return (await getSectionProducts("ruminants")).map((p) => {
    const [category, product] = p.href.split("/").slice(3);
    return { category, product };
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await findProduct(`/products/ruminants/${params.category}/${params.product}`);
  return product ? productMetadata(product) : {};
}

/** Ruminant product page — same ProductCompact template as poultry products. */
export default async function RuminantProductPage({ params }: Params) {
  const product = await findProduct(`/products/ruminants/${params.category}/${params.product}`);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
