/** Light admin loader — the site Preloader's wordmark with a thin sweeping bar (CSS only, no GSAP). */
export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-[60vh] grow flex-col items-center justify-center gap-5">
      <div className="text-center text-[22px] font-bold leading-[1.1] tracking-[0.5px] text-[#16194A]">
        AGRIPROM
        <br />
        <span className="text-[#008848]">PAKISTAN</span>
      </div>
      <div className="h-[2px] w-[140px] overflow-hidden rounded-full bg-[#E3E7EF]">
        <div className="admin-sweep h-full w-[40%] rounded-full bg-[#008848]" />
      </div>
    </div>
  );
}
