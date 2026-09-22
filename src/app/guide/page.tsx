import type { Metadata } from "next";
import Link from "next/link";
import { dice, grades, units, rankedUnits } from "@/data/game";

export const metadata: Metadata = {
  title: "Beginner guide: what to do in your first sessions",
  description:
    "How Anime Dice actually plays: the order to spend cash, when to buy dice, when a rebirth pays off, and the four mistakes that cost new players the most.",
  alternates: { canonical: "/guide/" },
};

export default function GuidePage() {
  const midTier = rankedUnits.find((u) => u.tier === "C");
  const entryDice = dice[0];
  const secondDice = dice[1];

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your first sessions
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          Anime Dice is a collection game with four separate multiplier systems layered on
          top of each other. The order you spend in matters more than the amount you spend.
        </p>
      </header>

      <section className="pb-12">
        <h2 className="text-sm font-medium">The loop</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Roll the dice to get units.",
            "Place your best units on the plot pads. An empty pad is wasted income, so fill every slot even with a weak unit.",
            "Spend the cash on better dice and on skill tree nodes.",
            "Raise your luck, then roll again.",
            "Improve the units you are keeping with grades, traits and mutations.",
            "Rebirth once your income rebuilds quickly, and keep the dice you bought.",
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-[62ch] text-sm text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Spend on money before anything else</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Every other system is gated behind cash. Better dice cost cash, skill tree nodes
          cost cash, and both feed back into getting more of it. During your first session
          the correct answer to almost every spending question is the money upgrade.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          The exception is a unit rare enough to keep. Spending on a unit you will replace
          in an hour is the most common waste of early resources, because grade and trait
          multipliers land on top of a base income that is about to become irrelevant.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Buying dice</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Luck roughly doubles per tier while price roughly quintuples. That means an
          intermediate tier you intend to discard costs far more cash than it costs luck,
          so skipping a step is often correct. The{" "}
          <Link href="/dice/" className="text-primary underline-offset-4 hover:underline">
            dice ladder
          </Link>{" "}
          lists all eight with their prices.
        </p>
        <div className="mt-4 rounded-[var(--radius-container)] border rule bg-card p-5">
          <p className="text-sm">
            <span className="font-medium">{entryDice.name}</span> at {entryDice.luck}x for{" "}
            {entryDice.price} is the first purchase that makes rolling feel worthwhile.{" "}
            <span className="font-medium">{secondDice.name}</span> at {secondDice.luck}x for{" "}
            {secondDice.price} doubles it, but the Epic tier arrives soon after, so do not
            linger.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">When to rebirth</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          A rebirth resets your cash, gives a permanent cash multiplier, raises your luck
          multiplier and adds a plot slot. The test is simple: if you can rebuild your
          previous cash total within a few minutes, rebirth. If rebuilding takes a long
          session, you are not ready and the reset will set you back.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Buy dice before a rebirth rather than after. Dice persist through the reset, so
          buying first gives you the tier and the multiplier from it. Buying afterwards
          means rebuilding from a smaller base to afford the same thing.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Where the multipliers stack</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          A unit&apos;s final income is its base rate multiplied by grade, trait and
          mutation together. Because they multiply, a good grade on a high-income unit beats
          a great grade on a cheap one.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stack title="Grade" detail={`${grades[0].name} at ${grades[0].income}x down to ${grades[grades.length - 1].name} at ${grades[grades.length - 1].income}x`} href="/grades/" link="Chances and calculator" />
          <Stack title="Trait" detail="Four traits raise all three stats, nine raise one" href="/traits/" link="All 13 traits" />
          <Stack title="Mutation" detail="Six gem-named variants plus two size modifiers" href="/mutations/" link="Mutation list" />
        </div>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Four mistakes that cost the most</h2>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-2">
          {[
            ["Rerolling a unit you will replace", "Trait Rerolls are the scarcest item codes give you. Spend them on a keeper."],
            ["Leaving plot pads empty", "An empty pad earns nothing. A common unit in the slot still beats no unit."],
            ["Selling without checking", "Grade, trait, mutation and size all change a copy's value. Two copies of one unit are rarely equal."],
            ["Over-investing in temporary units", "Early income is about to be dwarfed. Keep the upgrades for the units that survive a rebirth."],
          ].map(([title, body]) => (
            <li key={title} className="bg-card p-5">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">What to look at next</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          {midTier
            ? `${midTier.name} is a reasonable early target at ${midTier.oddsText}. The full roster sorts by odds and by income so you can pick a reachable one.`
            : `The full roster sorts by odds and by income so you can pick a reachable target.`}
        </p>
        <p className="mt-6 text-sm">
          <Link href="/units/" className="text-primary underline-offset-4 hover:underline">
            All {units.length} units
          </Link>
          <span className="px-2 text-border" aria-hidden="true">/</span>
          <Link href="/codes/" className="text-primary underline-offset-4 hover:underline">
            Codes
          </Link>
        </p>
      </section>
    </div>
  );
}

function Stack({
  title,
  detail,
  href,
  link,
}: {
  title: string;
  detail: string;
  href: string;
  link: string;
}) {
  return (
    <div className="rounded-[var(--radius-container)] border rule bg-card p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{detail}</p>
      <Link href={href} className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline">
        {link}
      </Link>
    </div>
  );
}
