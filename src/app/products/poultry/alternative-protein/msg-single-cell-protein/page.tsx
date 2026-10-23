import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail/ProductDetail";
import { PRODUCTS } from "@/components/product-detail/products";

const data = PRODUCTS["msg-single-cell-protein"];

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
};

export default function MsgSingleCellProteinPage() {
  return <ProductDetail data={data} />;
}
