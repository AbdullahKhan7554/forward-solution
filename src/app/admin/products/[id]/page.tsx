import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { rowToForm, type ProductRow } from "@/lib/admin/products";
import { loadCategories } from "../categories";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) notFound();

  const [{ data, error }, categories] = await Promise.all([
    createClient().from("products").select("*").eq("id", params.id).maybeSingle(),
    loadCategories(),
  ]);
  if (error) throw new Error(`Couldn't load the product: ${error.message}`);
  if (!data) notFound();

  return <ProductForm key={data.updated_at} id={data.id} initial={rowToForm(data as ProductRow)} categories={categories} />;
}
