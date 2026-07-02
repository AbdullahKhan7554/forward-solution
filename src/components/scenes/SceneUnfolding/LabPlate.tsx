import Image from "next/image";

/**
 * LabPlate - the laboratory visual for Scene 02.
 *
 * Accepts real photography via `src` (lazy-loaded, graded); until that art is
 * dropped in, it renders a handcrafted procedural plate: a luminous clean-room
 * of cool white light, a soft streak of glass light, faint architectural shelf
 * lines and a whisper of emerald atmosphere. Designed to read as premium
 * science photography, not a placeholder.
 *
 * The unified cool grade + grain overlay sit on top of BOTH modes so real and
 * procedural imagery share one tonal world (Visual Moodboard §17).
 */
export function LabPlate({
  src,
  alt = "",
  fit = "cover",
}: {
  src?: string;
  alt?: string;
  /** "cover" fills+crops the frame; "contain" shows the whole image (letterboxed). */
  fit?: "cover" | "contain";
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-100">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={fit === "contain" ? "object-contain" : "object-cover"}
          loading="lazy"
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0">
          {/* base luminous field */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, #EDF2F5 0%, #FFFFFF 52%, #F1F5F7 100%)",
            }}
          />
          {/* soft streak of glass light */}
          <div
            className="absolute -inset-x-10 top-[-20%] h-[80%] rotate-[14deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              filter: "blur(26px)",
            }}
          />
          {/* faint architectural shelf lines */}
          <div className="absolute inset-0">
            {[26, 44, 62, 80].map((top) => (
              <span
                key={top}
                className="absolute left-0 right-0 h-px bg-neutral-200/70"
                style={{ top: `${top}%` }}
              />
            ))}
          </div>
          {/* whisper of vitality atmosphere, lower-left */}
          <div
            className="absolute bottom-[-15%] left-[-10%] h-[55%] w-[60%] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,138,75,0.10), rgba(0,138,75,0))",
              filter: "blur(30px)",
            }}
          />
          {/* soft depth bokeh, upper-right */}
          <div
            className="absolute right-[8%] top-[12%] h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,100,193,0.10), rgba(0,100,193,0))",
              filter: "blur(20px)",
            }}
          />
        </div>
      )}

      {/* unified grade + grain (both modes) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,35,44,0.04) 0%, rgba(20,35,44,0) 30%, rgba(20,35,44,0.06) 100%)",
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply"
      >
        <filter id="labplate-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#labplate-grain)" />
      </svg>
    </div>
  );
}
