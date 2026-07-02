import { MaskedReveal } from "@/components/primitives/MaskedReveal";
import { LabPlate } from "@/components/scenes/SceneUnfolding/LabPlate";
import { cn } from "@/lib/utils";
import type { BlogPost } from "./blogs";

/**
 * BlogCard - Apple News-style editorial card. Reuses MaskedReveal (image) and
 * the Design System glass tokens. Hover: image zooms 1.04, card lifts, shadow
 * deepens, the Read More arrow slides. Keyboard-accessible (real link).
 */
export function BlogCard({
  post,
  variant,
}: {
  post: BlogPost;
  variant: "featured" | "secondary";
}) {
  const isFeatured = variant === "featured";

  return (
    <article data-insight className="group h-full">
      <a
        href={post.href}
        aria-label={`Read: ${post.title}`}
        className="flex h-full flex-col rounded-lg outline-none transition-transform duration-150 ease-brand-out will-change-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <div className="relative">
          <MaskedReveal
            className={cn(
              "w-full rounded-lg shadow-soft transition-shadow duration-150 ease-brand-out group-hover:shadow-medium",
              isFeatured ? "aspect-[16/10]" : "aspect-[16/11]"
            )}
          >
            <div className="h-full w-full transition-transform duration-[600ms] ease-brand-out group-hover:scale-[1.04]">
              <LabPlate src={post.image} alt={post.title} />
            </div>
          </MaskedReveal>

          {/* glass metadata tag */}
          <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 font-sans text-caption uppercase tracking-[0.18em] text-primary-700 shadow-soft backdrop-blur-xl backdrop-saturate-150">
            {post.category}
          </span>
        </div>

        <div className={cn("flex flex-1 flex-col", isFeatured ? "mt-7" : "mt-6")}>
          <div className="mb-4 flex items-center gap-3 font-sans text-caption uppercase tracking-[0.16em] text-neutral-400">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{post.readingTime}</span>
          </div>

          <h3
            className={cn(
              "font-display font-light leading-[1.14] tracking-[-0.01em] text-neutral-900",
              isFeatured ? "text-h3 md:text-[34px]" : "text-h4"
            )}
          >
            {post.title}
          </h3>

          <p
            className={cn(
              "mt-4 max-w-[52ch] text-pretty font-sans text-neutral-600",
              isFeatured ? "text-body-lg" : "text-body"
            )}
          >
            {post.excerpt}
          </p>

          <span className="mt-auto inline-flex items-center gap-2.5 pt-7 font-sans text-small font-medium text-primary-700">
            Read More
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-150 ease-brand-out group-hover:translate-x-1.5"
            >
              <svg
                width="24"
                height="10"
                viewBox="0 0 24 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 5h21M17 1l5 4-5 4" />
              </svg>
            </span>
          </span>
        </div>
      </a>
    </article>
  );
}
