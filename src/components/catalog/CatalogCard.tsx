import type { ReactNode } from "react";

/**
 * CatalogCard — the ONE shared card for poultry and ruminant catalogues.
 * Category cards: image, title, one line, "Explore →".
 * Product cards:  image, name, tagline, "Details →".
 * Clean white card, brand tokens only; hover is a small lift + slight image
 * zoom over 200ms.
 */
export function CatalogCard({
  href,
  title,
  line,
  image,
  action,
}: {
  href: string;
  title: string;
  line?: string;
  image: ReactNode;
  action: "Explore" | "Details";
}) {
  return (
    <a
      href={href}
      aria-label={`${title} — ${action.toLowerCase()}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-pure shadow-soft outline-none transition-[transform,box-shadow] duration-200 ease-brand-out hover:-translate-y-1 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <div className="h-[220px] w-full overflow-hidden bg-neutral-100 [&_img]:!object-contain">
        <div className="h-full w-full transition-transform duration-200 ease-brand-out group-hover:scale-[1.03]">
          {image}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[19px] font-medium leading-[1.15] tracking-[-0.01em] text-neutral-900">{title}</h3>
        {line && <p className="mt-1.5 text-pretty font-sans text-small text-neutral-900">{line}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-sans text-caption uppercase tracking-[0.2em] text-primary-700">
          {action}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1">&rarr;</span>
        </span>
      </div>
    </a>
  );
}
