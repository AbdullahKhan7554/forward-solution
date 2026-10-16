import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail/ProductDetail";
import { PRODUCTS } from "@/components/product-detail/products";

const data = PRODUCTS["canthaxanthin-lutein"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function CanthaxanthinLuteinPage() {
  return <ProductDetail data={data} />;
}
