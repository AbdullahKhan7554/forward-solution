import { redirect } from "next/navigation";

// The Ruminants experience lives at /ruminants; keep the /products/ namespace
// consistent for the nav dropdown by redirecting here.
export default function ProductsRuminants() {
  redirect("/ruminants");
}
