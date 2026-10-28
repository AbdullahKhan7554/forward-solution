/** Loading placeholders shaped like the admin's tables, cards and forms. */

const card = "rounded-xl border border-[#E3E7EF] bg-white p-5";

export function Bone({ className }: { className: string }) {
  return <div aria-hidden="true" className={`admin-skeleton ${className}`} />;
}

export function HeaderSkeleton({ button = true }: { button?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Bone className="h-7 w-48" />
        <Bone className="h-[14px] w-80" />
      </div>
      {button && <Bone className="h-11 w-36 rounded-lg" />}
    </div>
  );
}

export function TableSkeleton({ rows = 8, thumb = true }: { rows?: number; thumb?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E3E7EF] bg-white">
      <div className="border-b border-[#E3E7EF] bg-[#F8F9FC] px-5 py-[14px]">
        <Bone className="h-3 w-1/2" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-[#EEF1F6] px-5 py-3">
          {thumb && <Bone className="h-11 w-11 shrink-0 rounded-lg" />}
          <Bone className="h-[14px] w-[28%]" />
          <Bone className="h-3 w-[14%]" />
          <Bone className="h-3 w-[18%]" />
          <div className="grow" />
          <Bone className="h-5 w-14 rounded-md" />
          <Bone className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-[18px]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${card} flex flex-col gap-3`}>
          <Bone className="h-3 w-24" />
          <Bone className="h-8 w-16" />
          <Bone className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-24" />
          <Bone className="h-7 w-44" />
        </div>
        <div className="flex gap-[10px]">
          <Bone className="h-11 w-28 rounded-lg" />
          <Bone className="h-11 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-[18px]">
        <div className="flex grow flex-col gap-[14px]">
          {[3, 4, 3].map((fields, i) => (
            <div key={i} className={`${card} flex flex-col gap-3`}>
              <Bone className="h-4 w-32" />
              {Array.from({ length: fields }, (_, j) => (
                <Bone key={j} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex w-[320px] shrink-0 flex-col gap-[14px]">
          <div className={`${card} flex flex-col gap-3`}>
            <Bone className="h-4 w-28" />
            <Bone className="h-[160px] w-full rounded-lg" />
            <Bone className="h-9 w-full rounded-lg" />
          </div>
          <div className={`${card} flex flex-col gap-3`}>
            {Array.from({ length: 3 }, (_, j) => (
              <Bone key={j} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Page wrapper with an sr-only status so screen readers hear that something is loading. */
export function LoadingPage({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-5">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}
