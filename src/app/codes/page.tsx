import type { Metadata } from "next";
import Link from "next/link";
import { codes, redeemSteps, game } from "@/data/game";
import { CopyCode } from "@/components/copy-code";

export const metadata: Metadata = {
  title: `All ${codes.length} working codes`,
  description: `Every working Anime Dice code, each confirmed by at least two independent sources, with the exact reward for each and the steps to redeem them in the Shop tab.`,
  alternates: { canonical: "/codes/" },
};

export default function CodesPage() {
  const totalSpins = sumRewards("Lucky Spins");
  const totalRerolls = sumRewards("Trait Rerolls");

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Anime Dice codes
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          {codes.length} codes, every one of them confirmed by at least two independent
          sources. Together they are worth {totalSpins} Lucky Spins, {totalRerolls} Trait
          Rerolls and a matching stack of gems.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          No expired codes yet. The game launched in August 2026 and nothing has been
          retired.
        </p>
      </header>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Working codes</h2>
        <ul className="mt-4 divide-y rule overflow-hidden rounded-[var(--radius-container)] border rule bg-card">
          {codes.map((c) => (
            <li
              key={c.code}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
            >
              <code className="font-mono text-sm font-semibold tracking-tight">
                {c.code}
              </code>
              <CopyCode code={c.code} />
              <span className="ml-auto text-sm text-muted-foreground">{c.reward}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Codes are case sensitive. Copy rather than retype, and paste into the box at the
          bottom of the Shop tab.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">How to redeem</h2>
        <ol className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-5">
          {redeemSteps.map((s, i) => (
            <li key={i} className="bg-card p-4">
              <span className="font-mono text-xs text-muted-foreground tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Where each reward goes</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          Codes are the cheapest source of rerolls in the game, so it matters what you
          spend them on.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Reward
            name="Lucky Spins"
            body="Boost the odds behind your next rolls. Best saved for a session where you can spend them back to back."
            href="/dice/"
            link="Dice ladder"
          />
          <Reward
            name="Trait Rerolls"
            body="Reroll a unit's trait. Worth far more on a rare unit than on a common one, because the multiplier stacks on the unit's own income."
            href="/traits/"
            link="Trait list"
          />
          <Reward
            name="Gems"
            body="The currency for grade rerolls at the hub. Grade is the largest single multiplier you can add to a unit."
            href="/grades/"
            link="Grade odds"
          />
        </div>
      </section>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">Why some code lists disagree</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          We only publish a code once two independent sources carry it. That is why our
          list can look shorter than others: a single outlet printing a code is not
          evidence, and a code that fails costs you a trip to the Shop tab for nothing.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          The reward text is taken from the sources as written. Where two sources
          described the same code with different rewards, we used the version that
          appeared most often.
        </p>
        <p className="mt-6 text-sm">
          <a
            href={game.robloxUrl}
            target="_blank"
            rel="noopener"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open Anime Dice on Roblox
          </a>
          <span className="px-2 text-border" aria-hidden="true">
            /
          </span>
          <Link href="/guide/" className="text-primary underline-offset-4 hover:underline">
            Beginner guide
          </Link>
        </p>
      </section>
    </div>
  );
}

function sumRewards(unit: string): number {
  let total = 0;
  for (const c of codes) {
    const m = c.reward.match(new RegExp(`(\\d+)\\s+${unit}`, "i"));
    if (m) total += Number(m[1]);
  }
  return total;
}

function Reward({
  name,
  body,
  href,
  link,
}: {
  name: string;
  body: string;
  href: string;
  link: string;
}) {
  return (
    <div className="rounded-[var(--radius-container)] border rule bg-card p-4">
      <h3 className="text-sm font-medium">{name}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      <Link
        href={href}
        className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        {link}
      </Link>
    </div>
  );
}
