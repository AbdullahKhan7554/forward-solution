import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { Footer } from "@/components/layout/Footer";
import { ArticleView } from "@/components/blog/ArticleView";
import { articles, getArticle, type Article } from "@/components/info-center/articles";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Article Not Found — Agriprom Pakistan" };
  return {
    title: `${article.title} — Agriprom Pakistan`,
    description: article.excerpt,
    alternates: { canonical: `https://agriprompakistan.com/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

/** Up to three related articles: same category first, then the newest others. */
function relatedFor(article: Article): Article[] {
  const others = articles.filter((a) => a.slug !== article.slug);
  const sameCategory = others.filter((a) => a.filter === article.filter);
  const rest = others.filter((a) => a.filter !== article.filter);
  return [...sameCategory, ...rest].slice(0, 3);
}

/**
 * BLOG · ARTICLE DETAIL PAGE.
 *
 * Shares the homepage shell — one IntroProvider clock, the re-captioned "First
 * Light" Preloader, the floating Navbar and the shared Footer — and closes on
 * the Newsletter CTA, exactly like the listing page.
 */
export default function ArticlePage({ params }: { params: Params }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <IntroProvider>
      <Preloader caption="N°01 — The Knowledge" ariaLabel={`Reading — ${article.title}`} />
      <Navbar />
      <main>
        <ArticleView article={article} related={relatedFor(article)} />
        <NewsletterCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
