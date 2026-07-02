import { redirect } from "next/navigation";

// The Companion Animals experience lives at /companion-animals; keep the
// /products/ namespace consistent for the nav dropdown by redirecting here.
export default function ProductsCompanionAnimals() {
  redirect("/companion-animals");
}
