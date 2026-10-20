/**
 * SCENE 03 - MISSION & VISION.
 *
 * One section, two columns side by side (stacked on mobile). Each column: a line
 * icon in a soft rounded box, the heading, then the statement. Statements are
 * verbatim from the About page (AboutMissionVision).
 */

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const ITEMS = [
  {
    id: "mission",
    title: "Our Mission",
    Icon: TargetIcon,
    text: "To advance animal health and productivity across Pakistan by delivering globally-qualified, science-driven solutions — with integrity, quality and unwavering support for the people who raise the nation’s livestock.",
  },
  {
    id: "vision",
    title: "Our Vision",
    Icon: EyeIcon,
    text: "To be Pakistan’s most trusted partner in animal health — connecting global scientific innovation with local expertise to build a healthier, more sustainable and more resilient food chain.",
  },
];

export function SceneInnovation() {
  return (
    <section aria-label="Our Mission and Vision" className="relative bg-pure">
      <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-14 px-6 py-16 md:grid-cols-2 md:gap-20 md:px-12 md:py-24 xl:px-20">
        {ITEMS.map(({ id, title, Icon, text }) => (
          <div key={id} className="min-w-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/10 text-primary-700">
              <Icon />
            </div>
            <h2 className="mt-6 font-display text-h3 font-medium text-neutral-900">{title}</h2>
            <p className="mt-4 max-w-[34ch] text-pretty font-display text-[22px] font-light leading-[1.4] text-neutral-900 md:text-[26px]">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
