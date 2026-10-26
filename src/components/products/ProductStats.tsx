import { GlassCard } from "@/components/scenes/SceneInnovation/GlassCard";

/**
 * PRODUCTS · STATS ROW.
 *
 * The statistics row from ProductOverview, rendered on its own. Same numbers and
 * labels, shown statically.
 */

const STATS = [
  { value: "5", suffix: "", label: "Product Categories" },
  { value: "15", suffix: "+", label: "Global Brands" },
  { value: "50", suffix: "+", label: "Solutions" },
  { value: "24/7", suffix: "", label: "Technical Support" },
] as const;

export function ProductStats() {
  return (
    <section aria-label="Agriprom in numbers" className="relative bg-base">
      <div className="mx-auto w-full max-w-container px-6 py-16 md:px-12 md:py-24 xl:px-20">
        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <GlassCard className="h-full">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-[9vw] font-light leading-none tracking-[-0.02em] text-primary-700 md:text-[3.4vw] xl:text-[52px]">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="font-display text-h3 font-light text-accent-500">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <span className="mt-4 block font-sans text-caption uppercase tracking-[0.24em] text-neutral-900">
                  {stat.label}
                </span>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
