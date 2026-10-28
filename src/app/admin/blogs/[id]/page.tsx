import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "@/components/admin/BlogForm";
import { rowToBlogForm, type BlogRow } from "@/lib/admin/blogs";
import { loadBlogCategories } from "../categories";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  if (!UUID.test(params.id)) notFound();

  const [{ data, error }, categories] = await Promise.all([
    createClient().from("blogs").select("*").eq("id", params.id).maybeSingle(),
    loadBlogCategories(),
  ]);
  if (error) throw new Error(`Couldn't load the blog: ${error.message}`);
  if (!data) notFound();

  return <BlogForm key={data.updated_at} id={data.id} initial={rowToBlogForm(data as BlogRow)} categories={categories} />;
}
