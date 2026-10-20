/**
 * PRODUCTS · CATEGORIES (minimal).
 *
 * Two cards side by side (stacked on mobile): a theme-colored line icon, the
 * category title, its one-line description and a link. Copy is from
 * ProductCategories.
 */

function HenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
      <path d="M8 3.5c.6-1 1.9-1 2.4 0 .6-.9 1.9-.6 2 .5" />
      <path d="M10 5.5c-2 0-3.5 1.6-3.5 3.6 0 .9.3 1.7.8 2.4L5 12.5c-.8 3.6 1.9 7 5.6 7h2.2c3.4 0 6.2-2.8 6.2-6.2V9.5l1.5-1.5-2.5-.5c-1.6 2-4 3.3-6.5 3.3" />
      <path d="M6.5 8.5 4.5 9l2 1" />
      <circle cx="9.3" cy="8" r=".5" fill="currentColor" />
      <path d="M10.5 19.5v2M14 19.5v2" />
    </svg>
  );
}

function CowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
      <path d="M6 5 4 3M18 5l2-2" />
      <path d="M6.5 7H3.5c0 1.4 1.1 2.5 2.5 2.5M17.5 7h3c0 1.4-1.1 2.5-2.5 2.5" />
      <path d="M6.5 6.5c0-.8.7-1.5 1.5-1.5h8c.8 0 1.5.7 1.5 1.5V12c0 1.2-.4 2.3-1 3.2" />
      <path d="M6.5 6.5V12c0 1.2.4 2.3 1 3.2" />
      <rect x="7" y="14.5" width="10" height="6" rx="3" />
      <circle cx="10" cy="17.5" r=".5" fill="currentColor" />
      <circle cx="14" cy="17.5" r=".5" fill="currentColor" />
      <circle cx="9.5" cy="10" r=".5" fill="currentColor" />
      <circle cx="14.5" cy="10" r=".5" fill="currentColor" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg width="26" height="11" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6h27M22 1l6 5-6 5" />
    </svg>
  );
}

const CATEGORIES = [
  {
    name: "Poultry",
    Icon: HenIcon,
    description:
      "Nutrition, gut health and performance solutions for every stage of poultry production.",
    href: "/products/poultry",
  },
  {
    name: "Ruminants",
    Icon: CowIcon,
    description: "Health, growth and productivity support for dairy and beef cattle.",
    href: "/products/ruminants",
  },
];

export function ProductCategoryCards() {
  return (
    <section aria-label="Product Categories" className="relative bg-pure">
      <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-6 px-6 py-16 md:grid-cols-2 md:gap-8 md:px-12 md:py-24 xl:px-20">
        {CATEGORIES.map(({ name, Icon, description, href }) => (
          <a
            key={name}
            href={href}
            aria-label={`${name} — explore`}
            className="group flex min-w-0 flex-col rounded-md border border-neutral-200 bg-pure p-8 shadow-soft transition-[transform,box-shadow] duration-200 ease-brand-out hover:-translate-y-1 hover:shadow-floating focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 md:p-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-700">
              <Icon />
            </div>
            <h2 className="mt-6 font-display text-h3 font-medium text-neutral-900">{name}</h2>
            <p className="mt-3 max-w-[38ch] text-pretty font-sans text-body text-neutral-900">
              {description}
            </p>
            <span className="mt-6 text-primary-600">
              <span className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1.5">
                <ArrowGlyph />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
