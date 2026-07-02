/**
 * ConnectionLines - a suggested molecular network, drawn hairline-thin and
 * near-invisible (primary at ~12% opacity). NOT a glowing circuit. The paths
 * carry data-innov-line so the choreography can draw them once, slowly, via
 * stroke-dashoffset; nodes carry data-innov-node to fade in behind them.
 */
export function ConnectionLines() {
  const paths = [
    "M120 420 Q250 360 380 300",
    "M380 300 Q330 210 300 120",
    "M380 300 Q540 230 680 200",
    "M680 200 Q770 300 820 420",
    "M560 460 Q700 450 820 420",
    "M120 420 Q330 470 560 460",
  ];
  const nodes = [
    [120, 420],
    [380, 300],
    [300, 120],
    [680, 200],
    [820, 420],
    [560, 460],
  ];

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          data-innov-line
          d={d}
          stroke="rgba(0,100,193,0.14)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          style={{ strokeDasharray: 1 }}
        />
      ))}
      {nodes.map(([cx, cy], i) => (
        <circle
          key={i}
          data-innov-node
          cx={cx}
          cy={cy}
          r={3}
          fill="rgba(0,100,193,0.30)"
        />
      ))}
    </svg>
  );
}
