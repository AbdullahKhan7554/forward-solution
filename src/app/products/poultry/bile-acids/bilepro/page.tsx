import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail/ProductDetail";
import { PRODUCTS } from "@/components/product-detail/products";

const data = PRODUCTS["bilepro"];

const SITE = "https://agriprompakistan.com";
const PATH = "/products/poultry/bile-acids/bilepro";
const URL = `${SITE}${PATH}`;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: data.metaTitle,
    description: data.metaDescription,
    siteName: "Agriprom Pakistan",
  },
  twitter: { card: "summary_large_image", title: data.metaTitle, description: data.metaDescription },
};

const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: data.name,
  category: "Bile Acids",
  description: data.metaDescription,
  brand: { "@type": "Brand", name: "Agriprom Pakistan" },
  url: URL,
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name: "Products", item: `${SITE}/products` },
    { "@type": "ListItem", position: 3, name: "Poultry", item: `${SITE}/products/poultry` },
    { "@type": "ListItem", position: 4, name: "Bile Acids", item: `${SITE}/products/poultry` },
    { "@type": "ListItem", position: 5, name: data.name, item: URL },
  ],
};

export default function BileProPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProductDetail data={data} />
    </>
  );
}
