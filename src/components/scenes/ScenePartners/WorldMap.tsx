/**
 * WorldMap - ultra-low-contrast global-network atmosphere behind the partner
 * panels. A faint dot graticule + a few glowing connection arcs with node
 * glows. Purely decorative (aria-hidden); carries no information. The arcs draw
 * and breathe via usePartnersChoreography (disabled under reduced motion).
 */
export function WorldMap() {
  const arcs = [
    "M120 360 Q400 180 700 300",
    "M700 300 Q980 200 1240 360",
    "M300 520 Q620 420 900 520",
    "M120 360 Q520 620 900 520",
  ];
  const nodes = [
    [120, 360],
    [700, 300],
    [1240, 360],
    [300, 520],
    [900, 520],
  ];

  return (
    <div
      data-worldmap
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 will-change-transform"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1400 760"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <pattern id="wm-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.3" cy="1.3" r="1.3" fill="rgba(20,35,44,0.045)" />
          </pattern>
        </defs>
        <rect width="1400" height="760" fill="url(#wm-dots)" />

        {arcs.map((d, i) => (
          <path
            key={i}
            data-map-path
            d={d}
            stroke="rgba(0,100,193,0.12)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            style={{ strokeDasharray: 1 }}
          />
        ))}

        {nodes.map(([cx, cy], i) => (
          <g key={i} data-map-node>
            <circle cx={cx} cy={cy} r={9} fill="rgba(0,138,75,0.05)" />
            <circle cx={cx} cy={cy} r={2.5} fill="rgba(0,100,193,0.28)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
