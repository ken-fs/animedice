"use client";

import { useMemo, useState } from "react";
import { grades } from "@/data/game";

/**
 * Grade reroll calculator.
 *
 * The maths is the honest part: grades are independent rolls, so the chance of
 * hitting at least one target within n rerolls is 1-(1-p)^n and the expected
 * number of rerolls is 1/p. Nothing here is a game formula we invented; it is
 * the arithmetic anyone can check by hand.
 *
 * What we do NOT model: gem cost. No source publishes the gem price per grade
 * reroll, so a "you need X gems" line would be invented. The page says so.
 */

const pct = (n: number, digits = 4) =>
  `${(n * 100).toFixed(digits).replace(/\.?0+$/, "")}%`;

/** Chance of at least one hit in n independent attempts. */
function chanceWithin(p: number, n: number): number {
  // Use the expm1/log1p forms: with p as small as 7e-5 and n in the thousands,
  // the naive 1-(1-p)**n loses all its significant digits.
  return -Math.expm1(n * Math.log1p(-p));
}

export function GradeCalculator() {
  const [target, setTarget] = useState("Z+");
  const [done, setDone] = useState(0);

  const idx = grades.findIndex((g) => g.name === target);
  // "This grade or better" is what players actually mean, so the target pools
  // every rarer grade with it.
  const pooled = useMemo(
    () => grades.slice(0, idx + 1).reduce((a, g) => a + g.chance, 0) / 100,
    [idx]
  );
  const exact = grades[idx].chance / 100;

  const expected = 1 / pooled;
  const soFar = done > 0 ? chanceWithin(pooled, done) : 0;

  // The inverse of the curve, which is the question players actually ask: how
  // many rerolls until I am likely to have hit it? A bar chart of "chance within
  // N" is useless here, because at Z+ every value under 1000 rerolls rounds to
  // an invisible sliver.
  const milestones = useMemo(() => {
    const out: { conf: number; n: number }[] = [];
    for (const conf of [0.25, 0.5, 0.75, 0.9, 0.99]) {
      const n = Math.ceil(Math.log(1 - conf) / Math.log1p(-pooled));
      out.push({ conf, n });
    }
    return out;
  }, [pooled]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <label htmlFor="target" className="text-sm font-medium">
          Target grade
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Counts this grade or anything rarer, which is how most players budget.
        </p>
        <select
          id="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mt-2 h-10 w-full rounded-[var(--radius-container)] border rule bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {grades.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name} or better ({g.income}x income)
            </option>
          ))}
        </select>

        <label htmlFor="done" className="mt-6 block text-sm font-medium">
          Rerolls already spent
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Your existing rolls do not change the next one, but they do change the odds
          you have already beaten.
        </p>
        <input
          id="done"
          type="number"
          min={0}
          max={100000}
          value={done}
          onChange={(e) => setDone(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
          className="mt-2 h-10 w-full rounded-[var(--radius-container)] border rule bg-card px-3 text-sm outline-none tabular focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border">
          <Cell label="This grade exactly" value={pct(exact)} />
          <Cell label={`${target} or better`} value={pct(pooled)} />
          <Cell label="Expected rerolls" value={`${Math.round(expected).toLocaleString("en-US")}`} />
          <Cell
            label={`Chance after ${done} reroll${done === 1 ? "" : "s"}`}
            value={done === 0 ? "0%" : pct(soFar, 2)}
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Expected rerolls is the average, not a guarantee. Half of all players need
          more than {Math.round(expected).toLocaleString("en-US")} rerolls, and a tail of
          unlucky ones need several times that.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium">How many rerolls it takes</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Rerolls needed for {target} or better, at each level of confidence. Read the
          middle row as: half of all players have hit it by then.
        </p>
        <ul className="mt-4 divide-y rule overflow-hidden rounded-[var(--radius-container)] border rule bg-card">
          {milestones.map(({ conf, n }) => (
            <li key={conf} className="flex items-baseline justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {conf * 100}% of players have hit it
              </span>
              <span className="font-mono text-sm font-semibold tabular">
                {n.toLocaleString("en-US")} rolls
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          The last row is not a guarantee. Even at 99% confidence, roughly one player in a
          hundred is still waiting.
        </p>

        <div className="mt-6 rounded-[var(--radius-container)] border rule bg-muted/50 p-4">
          <h3 className="text-sm font-medium">Gems are not modelled</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            No source publishes the gem cost of a single grade reroll, so this page counts
            rerolls rather than gems. If the cost is ever published, the maths above
            converts straight into a budget.
          </p>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular">{value}</p>
    </div>
  );
}
