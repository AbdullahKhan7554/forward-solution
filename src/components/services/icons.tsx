/**
 * Lucide-style line icons for the Services page, inlined as SVG to match the
 * project convention (no new dependency). 24×24, currentColor, 1.5 weight,
 * round caps — the brand's thin-line grammar.
 */

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
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

/* ── Core services ─────────────────────────────────────────── */

export function ConsultationIcon() {
  return (
    <Svg>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      <path d="M8 9h8M8 13h5" />
    </Svg>
  );
}

export function VetIcon() {
  return (
    <Svg>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3 5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      <path d="M3.5 12h3l1.5-3 2.5 6 1.5-3h3" />
    </Svg>
  );
}

export function FlaskIcon() {
  return (
    <Svg>
      <path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3" />
      <path d="M7 14h10" />
    </Svg>
  );
}

export function LeafIcon() {
  return (
    <Svg>
      <path d="M11 20A7 7 0 0 1 4 13C4 7 12 4 20 4c0 8-3 16-9 16Z" />
      <path d="M8 17c1.5-4 4.5-7 8.5-8.5" />
    </Svg>
  );
}

export function ShieldIcon() {
  return (
    <Svg>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function TruckIcon() {
  return (
    <Svg>
      <path d="M10 17h4V5H2v12h3" />
      <path d="M14 8h4l3 3v6h-3" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </Svg>
  );
}

/* ── Why-choose benefits ───────────────────────────────────── */

export function MicroscopeIcon() {
  return (
    <Svg>
      <path d="M6 18h8M3 22h18M14 22a7 7 0 0 0 0-14" />
      <path d="M9 14h2a4 4 0 0 0 0-8H9v8Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9" />
    </Svg>
  );
}

export function GlobeIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </Svg>
  );
}

export function LifebuoyIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M9.17 14.83l-4.24 4.24" />
    </Svg>
  );
}

export function AwardIcon() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
    </Svg>
  );
}

export function PeopleIcon() {
  return (
    <Svg>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87" />
    </Svg>
  );
}

export function ZapIcon() {
  return (
    <Svg>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </Svg>
  );
}
