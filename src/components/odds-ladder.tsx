import { oddsPosition, oddsRange, rankedUnits, type Unit } from "@/data/game";

/**
 * The odds ladder.
 *
 * A rank-frequency plot, which is the right chart for "how are the 24 published
 * odds distributed" rather than 24 separate rows. The x axis is the odds on a log
 * scale, the y axis is rank from commonest to rarest, and the line is drawn
 * through the actual values.
 *
 * The log scale is not decoration: on a linear axis every unit except Enol would
 * land inside the first pixel, so the shape of the distribution would be invisible.
 *
 * Gridlines are derived from the range rather than hardcoded, so the chart stays
 * correct if the roster changes.
 */

const PAD = { top: 34, right: 76, bottom: 30, left: 8 };
const W = 1000;
const H = 340;

const DECADES = (() => {
  const { commonest, rarest } = oddsRange;
  const out: number[] = [];
  for (let e = Math.ceil(Math.log10(commonest)); e <= Math.floor(Math.log10(rarest)); e++) {
    out.push(10 ** e);
  }
  return out;
})();

const fmtShort = (n: number) =>
  n >= 1_000_000 ? "1M" : n >= 1_000 ? `${n / 1_000}K` : `${n}`;

/** x pixel for a given odds value. */
const xFor = (odds: number) => PAD.left + oddsPosition(odds) * (W - PAD.left - PAD.right);
/** y pixel for a given rank index (0 = commonest). */
const yFor = (i: number) =>
  PAD.top + (i / Math.max(rankedUnits.length - 1, 1)) * (H - PAD.top - PAD.bottom);

export function OddsCurve() {
  // rankedUnits is rarest-first; the chart runs commonest-first left to right.
  const pts = [...rankedUnits].reverse().map((u, i) => ({
    unit: u,
    x: xFor(u.odds as number),
    y: yFor(i),
  }));

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Label every unit, alternating above and below the point so the dense common
  // end of the curve does not collide with itself. The offset also gives each
  // label a leader line back to its own point, so a staggered label is never
  // ambiguous about which dot it belongs to. The final point always labels
  // upward, since it sits on the bottom edge of the plot area.
  const labelY = (p: { x: number; y: number }, i: number, last: boolean) => {
    const above = last || i % 2 === 0;
    return { y: above ? p.y - 9 : p.y + 14, above };
  };

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[340px] w-full min-w-[680px]"
        role="img"
        aria-label={`Roll odds for all ${rankedUnits.length} units with published rates, from 1 in ${oddsRange.commonest} to 1 in ${oddsRange.rarest.toLocaleString("en-US")}`}
      >
        {/* Decade gridlines */}
        {DECADES.map((d) => {
          const x = xFor(d);
          return (
            <g key={d}>
              <line
                x1={x}
                x2={x}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={H - PAD.bottom + 18}
                textAnchor="middle"
                className="fill-muted-foreground tabular"
                style={{ fontSize: 11 }}
              >
                1 in {fmtShort(d)}
              </text>
            </g>
          );
        })}

        {/* The distribution itself */}
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />

        {/* Points, leader lines and labels */}
        {pts.map((p, i) => {
          const { y: ly, above } = labelY(p, i, i === pts.length - 1);
          return (
            <g key={p.unit.slug}>
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={ly}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <circle cx={p.x} cy={p.y} r="3" fill="var(--primary)" />
              <text
                x={p.x}
                y={ly + (above ? -2 : 10)}
                textAnchor={i === pts.length - 1 ? "end" : "middle"}
                className="fill-foreground"
                style={{ fontSize: 10.5, fontWeight: 500 }}
              >
                {p.unit.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Axis-only variant, kept for the unit detail page where no curve is drawn. */
export function OddsAxis() {
  return (
    <div className="relative h-6 select-none" aria-hidden="true">
      {DECADES.map((d) => (
        <span
          key={d}
          className="absolute top-0 -translate-x-1/2 text-[11px] text-muted-foreground tabular"
          style={{ left: `${((oddsPosition(d) * (W - PAD.left - PAD.right) + PAD.left) / W) * 100}%` }}
        >
          1 in {fmtShort(d)}
        </span>
      ))}
    </div>
  );
}

export function OddsGrid() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {DECADES.map((d) => (
        <span
          key={d}
          className="absolute inset-y-0 w-px bg-border"
          style={{ left: `${((oddsPosition(d) * (W - PAD.left - PAD.right) + PAD.left) / W) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function OddsTick({ unit, showLabel = true }: { unit: Unit; showLabel?: boolean }) {
  if (unit.odds === null) return null;
  const pct = ((oddsPosition(unit.odds) * (W - PAD.left - PAD.right) + PAD.left) / W) * 100;
  const flip = pct > 74;

  return (
    <span className="absolute inset-y-0" style={{ left: `${pct}%` }}>
      <span className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-foreground" />
      {showLabel && (
        <span
          className={
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium " +
            (flip ? "right-2" : "left-2")
          }
        >
          {unit.name}
        </span>
      )}
    </span>
  );
}

/** Single-unit ladder for the detail page. */
export function OddsLadderInline({ unit }: { unit: Unit }) {
  if (unit.odds === null) {
    return (
      <p className="text-sm text-muted-foreground">
        Roll odds for this unit are not published in any source we could verify.
      </p>
    );
  }
  const pct = ((oddsPosition(unit.odds) * (W - PAD.left - PAD.right) + PAD.left) / W) * 100;
  return (
    <div>
      <OddsAxis />
      <div className="relative mt-1 h-12 rounded-[var(--radius-container)] border rule bg-card">
        <OddsGrid />
        <span
          className="absolute -top-px z-10 h-[calc(100%+2px)] w-[3px] rounded-full bg-primary"
          style={{ left: `${pct}%`, transform: "translateX(-1.5px)" }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground tabular">
        <span>commonest published: {oddsRange.commonest.toLocaleString("en-US")}</span>
        <span>rarest published: {oddsRange.rarest.toLocaleString("en-US")}</span>
      </div>
    </div>
  );
}
