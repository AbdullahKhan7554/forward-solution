import { ProductForm } from "@/components/admin/ProductForm";
import { emptyForm } from "@/lib/admin/products";
import { loadCategories } from "../categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await loadCategories();
  return <ProductForm id={null} initial={emptyForm("poultry", categories.poultry[0] ?? "")} categories={categories} />;
}
