import { ProductDetail } from "./ProductDetail";
import { productJsonLd, type CatalogProduct } from "@/lib/catalog";

/** A product page: Product + Breadcrumb JSON-LD, then the shared ProductDetail template. */
export function ProductPage({ product }: { product: CatalogProduct }) {
  return (
    <>
      {productJsonLd(product).map((ld) => (
        <script key={ld["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <ProductDetail data={product.data} />
    </>
  );
}
