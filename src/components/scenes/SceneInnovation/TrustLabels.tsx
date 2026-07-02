import { type ReactNode } from "react";

/**
 * TrustLabels - the row of scientific credentials with thin-line icons.
 * Each item carries data-innov-trust so the choreography can stagger them in.
 * Icons share one hairline (1.5) geometric language (Design System §12/§26).
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconResearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 L21 21" />
    </svg>
  );
}
function IconInnovation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconQuality() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7-7 9-4-2-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconGlobal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}
function IconScience() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      <path d="M9.5 3h5M10 3v6l-4.5 8a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

const ITEMS: { label: string; icon: ReactNode }[] = [
  { label: "Research", icon: <IconResearch /> },
  { label: "Innovation", icon: <IconInnovation /> },
  { label: "Quality", icon: <IconQuality /> },
  { label: "Global Standards", icon: <IconGlobal /> },
  { label: "Science", icon: <IconScience /> },
];

export function TrustLabels() {
  return (
    <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
      {ITEMS.map((item) => (
        <li
          key={item.label}
          data-innov-trust
          className="flex items-center gap-2.5 text-neutral-600 will-change-transform"
        >
          <span className="text-primary-600">{item.icon}</span>
          <span className="font-sans text-caption uppercase tracking-[0.18em]">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
