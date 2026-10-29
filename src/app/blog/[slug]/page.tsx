import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { Preloader } from "@/components/scenes/SceneThreshold/Preloader";
import { Navbar } from "@/components/navbar/Navbar";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { Footer } from "@/components/layout/Footer";
import { ArticleView } from "@/components/blog/ArticleView";
import { blogPostingJsonLd, getArticle, getArticles } from "@/lib/blog";
import type { Article } from "@/components/info-center/types";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
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
function relatedFor(article: Article, articles: Article[]): Article[] {
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
export default async function ArticlePage({ params }: { params: Params }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <IntroProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(article)).replace(/</g, "\\u003c") }}
      />
      <Preloader caption="N°01 — The Knowledge" ariaLabel={`Reading — ${article.title}`} />
      <Navbar />
      <main>
        <ArticleView article={article} related={relatedFor(article, await getArticles())} />
        <NewsletterCTA />
      </main>
      <Footer />
    </IntroProvider>
  );
}
