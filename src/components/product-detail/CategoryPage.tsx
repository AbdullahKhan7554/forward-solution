import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryShowcase } from "./CategoryShowcase";
import type { CategoryPage as CategoryPageData } from "@/lib/catalog";

/** A category page (poultry or ruminant): shared shell around the CategoryShowcase grid. */
export function CategoryPage({ page, backHref }: { page: CategoryPageData; backHref?: string }) {
  return (
    <IntroProvider>
      <Preloader caption={`N°01 — ${page.label}`} ariaLabel={`Entering Agriprom Pakistan — ${page.label}`} />
      <Navbar />
      <main>
        <CategoryShowcase
          eyebrow={page.eyebrow}
          titleTop={page.titleTop}
          titleBottom={page.titleBottom}
          intro={page.intro}
          backHref={backHref}
          items={page.products.map((p) => ({ href: p.href, data: p.data }))}
        />
      </main>
      <Footer />
    </IntroProvider>
  );
}
