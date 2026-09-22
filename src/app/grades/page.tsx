import type { Metadata } from "next";
import Link from "next/link";
import { grades, gradeChanceSum } from "@/data/game";
import { GradeCalculator } from "@/components/grade-calculator";

export const metadata: Metadata = {
  title: "Grades: all 9 multipliers and the real reroll odds",
  description:
    "Every Anime Dice grade from D at 1.1x to Z+ at 25x, with published roll chances, plus a calculator for how many rerolls a target grade actually takes.",
  alternates: { canonical: "/grades/" },
};

export default function GradesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Grades, and what they actually cost you
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          A grade multiplies a unit&apos;s income and nothing else. There are nine of them,
          from D at 1.1x up to Z+ at 25x. Grades stack with traits and mutations, so the
          multiplier here is the base of a much larger number.
        </p>
      </header>

      <section className="pb-12">
        <h2 className="text-sm font-medium">All nine grades</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Chances are per single reroll, as published by Sportskeeda.
        </p>
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-container)] border rule bg-card">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b rule text-left">
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Grade
                </th>
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Income
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Chance per reroll
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Rerolls to expect
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.name} className="border-b rule last:border-0">
                  <td className="px-4 py-2.5 font-mono font-semibold">{g.name}</td>
                  <td className="px-4 py-2.5 tabular">{g.income}x</td>
                  <td className="px-4 py-2.5 text-right tabular">{g.chance}%</td>
                  <td className="px-4 py-2.5 text-right tabular">
                    {Math.round(100 / g.chance).toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The source chances sum to 98.6%, not 100%. Saying so is better than
            silently normalising and presenting a tidier number than exists. */}
        <p className="mt-3 max-w-[62ch] text-xs text-muted-foreground tabular">
          The published chances sum to {gradeChanceSum.toFixed(3)}%, not 100%. Either a
          tier is missing from the source or the small values are rounded. We have left
          the numbers as published rather than rescaling them to look tidy.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Grade reroll calculator</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          Rerolling is independent each time, so a Z+ is not more likely because you
          have missed ten times. The calculator below shows the odds across a budget
          rather than implying a due date.
        </p>
        <div className="mt-6">
          <GradeCalculator />
        </div>
      </section>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">Where grades sit in the stack</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Layer
            title="Grade"
            body="Multiplies income. Rerolled with gems at the Grades station in the hub."
            href="/grades/"
            current
          />
          <Layer
            title="Trait"
            body="Adds Health, Damage or Income, and the four best traits add all three."
            href="/traits/"
          />
          <Layer
            title="Mutation"
            body="Raises the unit's base value before the other layers apply."
            href="/mutations/"
          />
        </div>
        <p className="mt-6 max-w-[62ch] text-sm text-muted-foreground">
          Because the layers multiply, a great grade on a cheap unit can still lose to a
          mediocre grade on an expensive one. Check the{" "}
          <Link href="/units/" className="text-primary underline-offset-4 hover:underline">
            unit income table
          </Link>{" "}
          before committing gems.
        </p>
      </section>
    </div>
  );
}

function Layer({
  title,
  body,
  href,
  current = false,
}: {
  title: string;
  body: string;
  href: string;
  current?: boolean;
}) {
  return (
    <div
      className={
        "rounded-[var(--radius-container)] border rule p-4 " +
        (current ? "bg-muted" : "bg-card")
      }
    >
      <h3 className="text-sm font-medium">
        {title}
        {current && <span className="ml-2 text-xs text-muted-foreground">this page</span>}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      {!current && (
        <Link
          href={href}
          className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          Open
        </Link>
      )}
    </div>
  );
}
