import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  codes,
  grades,
  units,
  rankedUnits,
  dice,
  traits,
  mutations,
  oddsRange,
  inN,
  game,
} from "@/data/game";
import { CopyCode } from "@/components/copy-code";
import { OddsCurve } from "@/components/odds-ladder";
import { TierBadge } from "@/components/tier-badge";

export const metadata: Metadata = {
  title: "Anime Dice codes, unit odds and grade odds",
  description:
    "Every Anime Dice code, all 28 units with published roll odds, the nine grades with real chances, and the eight-dice ladder. Fan-made, with the source for every number.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const rarest = rankedUnits[0];
  const topCodes = codes.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      {/* Asymmetric split. The screenshot is a real in-game frame in which the
          game itself prints "1 in 9,342,584", which is the argument this site
          exists to make, so the image does work rather than decorate. */}
      <section className="grid items-center gap-10 pt-14 pb-16 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Every Anime Dice roll, by the odds
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg text-muted-foreground">
            {units.length} units with real roll odds, {grades.length} grades with published
            chances, and a calculator that shows what your rerolls actually buy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/codes/"
              className="inline-flex h-11 items-center rounded-[var(--radius-control)] bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Working codes
            </Link>
            <Link
              href="/units/"
              className="inline-flex h-11 items-center rounded-[var(--radius-control)] border rule bg-card px-6 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Unit odds
            </Link>
          </div>
        </div>
        <figure className="relative">
          <Image
            src="/game/board.png"
            alt="An Anime Dice roll in progress, with the game displaying odds of 1 in 9,342,584 above a die and a summoned unit"
            width={768}
            height={432}
            priority
            className="w-full rounded-[var(--radius-container)] border rule"
          />
          <figcaption className="mt-2.5 text-xs text-muted-foreground">
            An in-game roll. The game prints the odds for you; this site collects them in
            one place.
          </figcaption>
        </figure>
      </section>

      <section className="pb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Codes worth redeeming first</h2>
          <Link href="/codes/" className="text-sm text-primary underline-offset-4 hover:underline">
            All {codes.length} codes
          </Link>
        </div>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-3">
          {topCodes.map((c) => (
            <li key={c.code} className="bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-sm font-semibold">{c.code}</code>
                <CopyCode code={c.code} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{c.reward}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-16">
        <h2 className="text-sm font-medium">The odds ladder</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          All {rankedUnits.length} units with published odds, plotted on a log scale from{" "}
          {inN(oddsRange.commonest)} to {inN(oddsRange.rarest)}.
        </p>
        <div className="mt-5 rounded-[var(--radius-container)] border rule bg-card py-2">
          <OddsCurve />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {rarest.name} is the rarest published unit at {rarest.oddsText}. The full table
          sorts by income as well as odds.
        </p>
      </section>

      <section className="pb-16">
        <h2 className="text-sm font-medium">The four systems that multiply</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          A unit&apos;s final income is its base rate stacked with a grade, a trait and a
          mutation. Each layer is covered separately, because each one has a different
          cost.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SystemCard
            href="/grades/"
            title="Grades"
            count={`${grades.length} grades`}
            fact={`Z+ pays 25x at a 0.007% reroll chance`}
            note="Chances published, calculator included"
          />
          <SystemCard
            href="/traits/"
            title="Traits"
            count={`${traits.length} traits`}
            fact={`Transcendent raises income, damage and health by 15x`}
            note="Effects known, chances unpublished"
          />
          <SystemCard
            href="/mutations/"
            title="Mutations"
            count={`${mutations.names.length} mutations`}
            fact="Silver, Gold, Emerald, Diamond, Ruby, Rainbow"
            note="Names known, multipliers unpublished"
          />
          <SystemCard
            href="/dice/"
            title="Dice"
            count={`${dice.length} dice`}
            fact={`${dice[0].name} at ${dice[0].luck}x up to ${dice[dice.length - 1].name} at ${dice[dice.length - 1].luck.toLocaleString("en-US")}x`}
            note="Luck and price both published"
          />
        </div>
      </section>

      <section className="pb-16">
        <h2 className="text-sm font-medium">What this site will not do</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Four units in the roster have no roll odds or income in any source we could
              verify. Their pages say so, and their rows in the table read &quot;not
              published&quot; rather than carrying a plausible-looking number.
            </p>
          </div>
          <div className="rounded-[var(--radius-container)] border rule bg-card p-5">
            <p className="text-sm text-muted-foreground">
              The trait and mutation multipliers circulating online belong to a different
              Roblox game with a similar name. We left those columns empty instead of
              filling them with the wrong game&apos;s data.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Where a number is community-measured rather than published by the developers, the
          page says which. Dice prices, for instance, are marked per row with how many
          independent sources agreed on them.
        </p>
      </section>

      <section className="border-t rule py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">Start where you are</h2>
            <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
              New players usually want codes and the dice ladder first. The grade calculator
              matters once you have a unit worth investing in.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickLink href="/guide/">Beginner guide</QuickLink>
            <QuickLink href="/codes/">Codes</QuickLink>
            <QuickLink href="/dice/">Dice ladder</QuickLink>
            <QuickLink href="/grades/">Grade calculator</QuickLink>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          {game.name} is developed by {game.developer}. This is an independent fan
          reference and is not affiliated with them or with Roblox Corporation.
        </p>
      </section>
    </div>
  );
}

function SystemCard({
  href,
  title,
  count,
  fact,
  note,
}: {
  href: string;
  title: string;
  count: string;
  fact: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[var(--radius-container)] border rule bg-card p-4 transition-colors hover:bg-muted"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-medium group-hover:text-primary">{title}</h3>
        <span className="text-xs text-muted-foreground tabular">{count}</span>
      </div>
      <p className="mt-2.5 text-sm">{fact}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </Link>
  );
}

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-[var(--radius-control)] border rule bg-card px-4 text-sm transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}
