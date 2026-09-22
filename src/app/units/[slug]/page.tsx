import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  units,
  rankedUnits,
  inN,
  tierOf,
  type Unit,
} from "@/data/game";
import { OddsLadderInline } from "@/components/odds-ladder";
import { TierBadge } from "@/components/tier-badge";
import { CopyCode } from "@/components/copy-code";

export function generateStaticParams() {
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/units/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const u = units.find((x) => x.slug === slug);
  if (!u) return {};
  const title = u.verified
    ? `${u.name} in Anime Dice: ${u.oddsText} odds, ${u.incomeText}`
    : `${u.name} in Anime Dice: stats not published`;
  return {
    title,
    description: u.verified
      ? `${u.name} rolls at ${u.oddsText} and earns ${u.incomeText} at base in Anime Dice. See where it sits on the full odds ladder and whether it is worth your grades.`
      : `${u.name} appears in the Anime Dice roster but has no published roll odds or income in any source we could verify.`,
    alternates: { canonical: `/units/${u.slug}/` },
  };
}

/** Units within one tier step of this one, for the "compare against" block. */
function neighbours(unit: Unit, count = 4): Unit[] {
  const idx = rankedUnits.findIndex((u) => u.slug === unit.slug);
  if (idx < 0) return rankedUnits.slice(0, count);
  const out: Unit[] = [];
  for (let d = 1; out.length < count && d < rankedUnits.length; d++) {
    for (const j of [idx - d, idx + d]) {
      if (j >= 0 && j < rankedUnits.length) out.push(rankedUnits[j]);
      if (out.length >= count) break;
    }
  }
  return out;
}

export default async function UnitPage({ params }: PageProps<"/units/[slug]">) {
  const { slug } = await params;
  const unit = units.find((u) => u.slug === slug);
  if (!unit) notFound();

  const sameTier = units.filter((u) => u.tier === unit.tier && u.slug !== unit.slug);
  const rank = rankedUnits.findIndex((u) => u.slug === unit.slug);

  return (
    <article className="mx-auto w-full max-w-6xl px-5">
      <nav className="pt-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/units/" className="hover:text-foreground">
          Units
        </Link>
        <span className="px-2 text-border" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">{unit.name}</span>
      </nav>

      <header className="pt-6 pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={unit.tier} />
          {unit.verified && rank >= 0 && (
            <span className="text-xs text-muted-foreground tabular">
              #{rank + 1} of {rankedUnits.length} by rarity
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {unit.name}
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          {unit.verified ? (
            <>
              {unit.name} sits in tier {unit.tier}, rolling at {unit.oddsText} and earning{" "}
              {unit.incomeText} on a plain copy.
            </>
          ) : (
            <>
              {unit.name} is in the Anime Dice roster, but no source we checked publishes
              its roll odds or income. We would rather show you a gap than a guess.
            </>
          )}
        </p>
      </header>

      {unit.verified ? (
        <div className="grid gap-10 pb-16 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h2 className="text-sm font-medium">Where it sits on the ladder</h2>
            <div className="mt-4">
              <OddsLadderInline unit={unit} />
            </div>

            <h2 className="mt-12 text-sm font-medium">What the numbers mean</h2>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-3">
              <Stat label="Roll odds" value={unit.oddsText} sub={`${(unit.chance! * 100).toFixed(4)}% per roll`} />
              <Stat label="Base income" value={unit.incomeText} sub="per second, plain copy" />
              <Stat label="Tier" value={unit.tier} sub={`${sameTier.length + 1} unit${sameTier.length ? "s" : ""} in this tier`} />
            </dl>

            <h2 className="mt-12 text-sm font-medium">How to spend on it</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {adviceFor(unit).map((line, i) => (
                <p key={i} className="max-w-[62ch]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
              <h2 className="text-sm font-medium">Farming it</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {unit.odds! >= 1000
                  ? "This is a long-tail target. Luck comes from the dice ladder and the skill tree, so buy the highest dice tier you can reach before grinding for it."
                  : "This one arrives often enough that you will see several copies. Keep the best grade, sell or feed the rest."}
              </p>
              <Link
                href="/dice/"
                className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                See the dice ladder
              </Link>
            </div>

            {sameTier.length > 0 && (
              <div>
                <h2 className="text-sm font-medium">Also in tier {unit.tier}</h2>
                <ul className="mt-3 space-y-1.5">
                  {sameTier.map((u) => (
                    <li key={u.slug}>
                      <Link
                        href={`/units/${u.slug}/`}
                        className="flex items-baseline justify-between gap-3 text-sm hover:text-primary"
                      >
                        <span>{u.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground tabular">
                          {u.oddsText}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="text-sm font-medium">Nearby on the ladder</h2>
              <ul className="mt-3 space-y-1.5">
                {neighbours(unit).map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={`/units/${u.slug}/`}
                      className="flex items-baseline justify-between gap-3 text-sm hover:text-primary"
                    >
                      <span>{u.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular">
                        {u.oddsText}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--radius-container)] border rule bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">
                Codes hand out Lucky Spins and Trait Rerolls, which are the cheapest way
                to chase a unit like this.
              </p>
              <Link
                href="/codes/"
                className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                All working codes
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="pb-16">
          <div className="rounded-[var(--radius-container)] border rule bg-card p-6">
            <h2 className="text-sm font-medium">What we do know</h2>
            <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
              {unit.name} is listed in the game&apos;s roster and appears in player
              inventories, so it is a real unit. What is missing is the two numbers this
              site exists to publish: how often it rolls, and what it earns.
            </p>
            <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
              If you own one, the income panel in game shows the base rate on the unit
              card. We would rather leave this page honest than copy a number from a
              source that mixed this game up with another one.
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-sm font-medium">Units with published odds</h2>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {rankedUnits.slice(0, 12).map((u) => (
                <li key={u.slug}>
                  <Link
                    href={`/units/${u.slug}/`}
                    className="flex items-baseline justify-between gap-3 text-sm hover:text-primary"
                  >
                    <span>{u.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular">
                      {u.oddsText}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">Quick reference</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">Redeem in the Shop tab:</span>
          <CopyCode code="UPDATE5" />
          <Link href="/codes/" className="text-primary underline-offset-4 hover:underline">
            All {units.length > 0 ? 14 : 0} codes
          </Link>
        </div>
      </section>
    </article>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-lg font-semibold tabular">{value}</dd>
      <dd className="mt-0.5 text-xs text-muted-foreground">{sub}</dd>
    </div>
  );
}

/**
 * Advice is derived from the unit's own numbers so it stays true when the data
 * changes. No copy here claims anything the table above does not already show.
 */
function adviceFor(u: Unit): string[] {
  const odds = u.odds ?? 0;
  const income = u.income ?? 0;
  const lines: string[] = [];

  if (tierOf(u.tier) <= 1) {
    lines.push(
      `At ${u.oddsText}, most players meet ${u.name} late rather than early. The roll is the bottleneck, not the cash, so spending Trait Rerolls here is the best use of them you have.`
    );
  } else if (tierOf(u.tier) <= 3) {
    lines.push(
      `${u.name} is reachable without a long grind at ${u.oddsText}, and it earns enough that it can hold a plot slot while you chase something rarer.`
    );
  } else {
    lines.push(
      `${u.name} rolls at ${u.oddsText}, so it is a stepping stone rather than a destination. Use it to fill empty plot slots early and replace it as better units arrive.`
    );
  }

  if (income >= 1000) {
    lines.push(
      `A grade reroll here is worth more than one on a cheaper unit, because grades multiply income and ${u.name} already earns ${u.incomeText}.`
    );
  } else if (income >= 50) {
    lines.push(
      `Grades multiply, so a good grade on ${u.name} still pays. Check the grade odds page before burning gems on a unit you plan to replace.`
    );
  } else {
    lines.push(
      `At ${u.incomeText} the multiplier stacks on a small base. Save your gems and rerolls for a unit with more income behind it.`
    );
  }

  lines.push(
    `Placing ${u.name} on a plot slot always beats an empty slot, even at the end of its useful life.`
  );

  return lines;
}
