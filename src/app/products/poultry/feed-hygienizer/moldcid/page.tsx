import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail/ProductDetail";
import { PRODUCTS } from "@/components/product-detail/products";

const data = PRODUCTS["moldcid"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function MoldCidPage() {
  return <ProductDetail data={data} />;
}
