import { BlogForm } from "@/components/admin/BlogForm";
import { emptyBlogForm } from "@/lib/admin/blogs";
import { loadBlogCategories } from "../categories";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const categories = await loadBlogCategories();
  return <BlogForm id={null} updatedAt={null} initial={emptyBlogForm(categories[0] ?? "")} categories={categories} />;
}
