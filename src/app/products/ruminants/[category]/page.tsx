import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase } from "@/components/product-detail/CategoryShowcase";
import { RUMINANT_CATEGORIES, ruminantProductKey } from "@/components/ruminants/categories";

type Params = { params: { category: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return RUMINANT_CATEGORIES.map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const c = RUMINANT_CATEGORIES.find((x) => x.id === params.category);
  if (!c) return {};
  return {
    title: `Ruminant ${c.name} — Agriprom Pakistan`,
    description: c.description,
  };
}

/** Ruminant category page — same template as the poultry category pages. */
export default function RuminantCategoryPage({ params }: Params) {
  const c = RUMINANT_CATEGORIES.find((x) => x.id === params.category);
  if (!c) notFound();

  return (
    <IntroProvider>
      <Preloader caption={`N°01 — Ruminant ${c.name}`} ariaLabel={`Entering Agriprom Pakistan — Ruminant ${c.name}`} />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow={`Ruminants · ${c.name}`}
          titleTop="Ruminant"
          titleBottom={c.name}
          intro={c.description}
          backHref="/products/ruminants"
          items={c.products.map((slug) => ({
            slug: ruminantProductKey(c.id, slug),
            href: `/products/ruminants/${c.id}/${slug}`,
          }))}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
