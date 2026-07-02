import { type ReactNode } from "react";

/** Minimal Lucide-style line icons (stroke 1.5) — no runtime dependency. */
export function Icon({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const Drop = () => (
  <Icon>
    <path d="M12 2s6 6.5 6 10.5A6 6 0 0 1 6 12.5C6 8.5 12 2 12 2z" />
  </Icon>
);
const Leaf = () => (
  <Icon>
    <path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16a4 4 0 0 1-4-4c0-3 3-6 8-7" />
  </Icon>
);
const Gauge = () => (
  <Icon>
    <path d="M12 14a2 2 0 1 0-2-2M12 14l4-4M4 20a10 10 0 1 1 16 0" />
  </Icon>
);
const Trend = () => (
  <Icon>
    <path d="M3 17l6-6 4 4 7-7M17 8h4v4" />
  </Icon>
);
const Shield = () => (
  <Icon>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);
const Sparkle = () => (
  <Icon>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </Icon>
);
const Scale = () => (
  <Icon>
    <path d="M12 3v18M7 21h10M5 7h14M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" />
  </Icon>
);
const Recycle = () => (
  <Icon>
    <path d="M7 19H4l2.5-4M17 5l2.5 4H16M9 5l3-3 3 3M5.5 11 4 9l1-4h4M18.5 13 20 15l-1 4h-4M15 19l-3 3-3-3" />
  </Icon>
);

/** Cycled set for benefit cards — premium, neutral, science-leaning. */
export const BENEFIT_ICONS = [Sparkle, Leaf, Gauge, Scale, Recycle, Trend, Shield, Drop];

/* Application icons, matched by label keyword. */
const Broiler = () => (
  <Icon>
    <path d="M16 6a3 3 0 0 0-6 0c0 1-1 2-2 2.5C6 9.5 5 11 5 13a5 5 0 0 0 5 5h3a6 6 0 0 0 6-6c0-3-1-4-3-6z" />
    <path d="M16 6l3-2M10 18l-1 3M13 18l1 3M8.5 9.5h.01" />
  </Icon>
);
const Egg = () => (
  <Icon>
    <path d="M12 3c3.5 0 6 5 6 9a6 6 0 0 1-12 0c0-4 2.5-9 6-9z" />
  </Icon>
);
const Breeder = () => (
  <Icon>
    <path d="M15 7a3 3 0 0 0-6 0c0 1-1 2-2 2.5C5 10.5 4 12 4 14a5 5 0 0 0 5 5h3a6 6 0 0 0 6-6c0-2.5-.8-3.8-2.4-5.4z" />
    <path d="M18 4v4M16 6h4M9 19l-1 2M12 19l1 2" />
  </Icon>
);
const Mill = () => (
  <Icon>
    <path d="M3 21V8l7-3v3l7-3v16M3 21h18M7 21v-4h3v4M14 21v-4h3v4" />
  </Icon>
);

export function applicationIcon(label: string): ReactNode {
  const l = label.toLowerCase();
  if (l.includes("broiler")) return <Broiler />;
  if (l.includes("layer")) return <Egg />;
  if (l.includes("breeder")) return <Breeder />;
  if (l.includes("mill") || l.includes("manufacturer")) return <Mill />;
  return <Leaf />;
}

/* Document icon for downloads. */
export const DocIcon = () => (
  <Icon>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" />
  </Icon>
);
