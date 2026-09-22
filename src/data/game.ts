import raw from "./game.json";

/**
 * Single source of truth for every number on this site.
 *
 * Provenance rules, enforced by the shape of this file:
 *  - Anything under `verified: false` has NO public source. Pages must render
 *    it as "not published" rather than filling the gap with a plausible number.
 *  - `sourcing` on the dice ladder records how many independent sources agreed.
 *    We surface that on the page instead of hiding it behind a confident table.
 *  - Research log, including the one data set we nearly imported from the wrong
 *    game: ../../animedice-research/README.md
 */

export type Tier = "S+" | "S" | "A" | "B" | "C" | "D" | "Unranked";

export type Unit = {
  name: string;
  slug: string;
  tier: Tier;
  odds: number | null;
  oddsText: string;
  income: number | null;
  incomeText: string;
  chance: number | null;
  verified: boolean;
};

export type Grade = { name: string; income: number; chance: number };
export type Trait = {
  name: string;
  income: number | null;
  damage: number | null;
  health: number | null;
  tier: "S" | "A" | "B" | "C";
  chance: null;
};
export type Die = {
  name: string;
  rarity: string;
  luck: number;
  price: string;
  sourcing: "single" | "corroborated";
};

export const game = raw.game;
export const units = raw.units as Unit[];
export const grades = raw.grades as Grade[];
export const traits = raw.traits as Trait[];
export const dice = raw.dice as Die[];
export const codes = raw.codes as { code: string; reward: string; sources: number }[];
export const redeemSteps = raw.redeemSteps as string[];
export const systems = raw.systems;
export const mutations = raw.mutations;

/** Known gaps in the public data. Surfaced on /about rather than hidden. */
export const gaps = raw.gaps as string[];

export const TIER_ORDER: Tier[] = ["S+", "S", "A", "B", "C", "D", "Unranked"];

export const tierOf = (t: Tier) => TIER_ORDER.indexOf(t);

/** Units with published odds, ordered rarest first. Drives the ladder on /units. */
export const rankedUnits = units
  .filter((u) => u.odds !== null)
  .sort((a, b) => (b.odds ?? 0) - (a.odds ?? 0));

export const unverifiedUnits = units.filter((u) => !u.verified);

/** Rarest and most common published odds, for scaling the ladder. */
export const oddsRange = (() => {
  const vals = rankedUnits.map((u) => u.odds as number);
  return { rarest: Math.max(...vals), commonest: Math.min(...vals) };
})();

/**
 * Position of a unit on a log scale across the full odds range, 0 (commonest)
 * to 1 (rarest). A linear scale would collapse 23 of 24 units into the first
 * pixel, which is why the ladder is logarithmic.
 */
export function oddsPosition(odds: number): number {
  const { rarest, commonest } = oddsRange;
  const lo = Math.log10(commonest);
  const hi = Math.log10(rarest);
  return (Math.log10(odds) - lo) / (hi - lo);
}

/** Formats 290000 as "1 in 290,000" without depending on Intl for grouping. */
export const inN = (n: number) => `1 in ${n.toLocaleString("en-US")}`;

/** Total gem cost of a grade reroll is not published; we only model the odds. */
export const gradeChanceSum = grades.reduce((a, g) => a + g.chance, 0);
