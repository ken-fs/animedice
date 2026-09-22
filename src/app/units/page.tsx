import type { Metadata } from "next";
import Link from "next/link";
import { units, rankedUnits, oddsRange, inN, unverifiedUnits } from "@/data/game";
import { RosterTable } from "@/components/roster-table";
import { OddsCurve } from "@/components/odds-ladder";
import { TierLegend } from "@/components/tier-badge";
import { UnitListJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "All 28 units, ranked with real roll odds",
  description:
    "The full Anime Dice roster: every unit with its published roll odds and base income per second, from Enol at 1 in 290,000 down to Naroto at 1 in 2.",
  alternates: { canonical: "/units/" },
};

export default function UnitsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <UnitListJsonLd units={units.map((u) => ({ name: u.name, slug: u.slug }))} />
      <header className="pt-14 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Every Anime Dice unit, by roll odds
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          {units.length} units. {rankedUnits.length} have published odds and income;
          the remaining {unverifiedUnits.length} have no recorded stats anywhere we
          could verify, and they are marked rather than guessed at.
        </p>
      </header>

      {/* The roster on one axis. Same log scale as the unit pages, so a reader who
          learns it here can read any single unit page later. */}
      <section className="pb-12">
        <h2 className="text-sm font-medium">The full ladder</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          Plotted logarithmically across {inN(oddsRange.commonest)} to {inN(oddsRange.rarest)}.
          A linear axis would stack every unit except Enol into a single line.
        </p>
        <div className="mt-5 rounded-[var(--radius-container)] border rule bg-card py-2">
          <OddsCurve />
        </div>
      </section>

      <section className="pb-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">The roster</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sorted by income. Filter by tier, or sort any column.
            </p>
          </div>
          <TierLegend />
        </div>
        <div className="mt-5">
          <RosterTable units={units} />
        </div>
        <p className="mt-6 max-w-[62ch] text-xs text-muted-foreground">
          Income is base cash per second on a plain copy, before grade, trait, mutation
          or size. Those layers multiply on top and are covered on their own pages.
        </p>
      </section>
    </div>
  );
}
