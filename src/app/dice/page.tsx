import type { Metadata } from "next";
import Link from "next/link";
import { dice } from "@/data/game";

export const metadata: Metadata = {
  title: "The 8-dice ladder, by luck multiplier",
  description:
    "All eight Anime Dice from Lightning at 42x luck to Void at 5,000x, with prices, and why skipping a tier usually beats buying it.",
  alternates: { canonical: "/dice/" },
};

export default function DicePage() {
  const first = dice[0];
  const last = dice[dice.length - 1];

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          The dice ladder
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          Eight dice, from {first.name} at {first.luck}x luck for {first.price} up to{" "}
          {last.name} at {last.luck.toLocaleString("en-US")}x for {last.price}. Luck is the
          only thing they change, and it applies to every roll you make afterwards.
        </p>
      </header>

      <section className="pb-12">
        <div className="overflow-x-auto rounded-[var(--radius-container)] border rule bg-card">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b rule text-left">
                {["Dice", "Rarity", "Luck", "Price", "Step up"].map((h, i) => (
                  <th
                    key={h}
                    className={
                      "px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground " +
                      (i >= 2 ? "text-right" : "")
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dice.map((d, i) => {
                const prev = dice[i - 1];
                return (
                  <tr key={d.name} className="border-b rule last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-medium">{d.name}</span>
                      {/* Sourcing is part of the data, so it is shown next to the
                          row rather than buried in a footnote. */}
                      {d.sourcing === "single" && (
                        <span className="ml-2 text-[11px] text-muted-foreground">
                          single source
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{d.rarity}</td>
                    <td className="px-4 py-3 text-right font-mono tabular">
                      {d.luck.toLocaleString("en-US")}x
                    </td>
                    <td className="px-4 py-3 text-right tabular">{d.price}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground tabular">
                      {prev
                        ? `${(d.luck / prev.luck).toFixed(1)}x luck for ${(priceRatio(d.price) / priceRatio(prev.price)).toFixed(1)}x cost`
                        : "entry tier"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">The one pattern worth memorising</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Luck roughly doubles at each step. Price roughly quintuples. That asymmetry is
          the whole strategy: an intermediate tier you intend to discard costs far more
          cash than it costs luck, so skipping ahead is usually correct when your current
          dice can reach the higher price in a reasonable number of sessions.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Deciding what to buy</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Can you afford the tier two steps up rather than one? Buy that instead. The step in between gets discarded, so its price is wasted either way.",
            "Is the next tier within roughly one session of income? Buy it now. Saving longer costs more play time than the tier saves you.",
            "Are you close to a rebirth threshold? Buy dice first. Dice survive a rebirth, so you keep both the tier and the multiplier instead of rebuilding from a smaller base.",
            "Have you bought this session's money and luck upgrades? Do that first. Upgrade nodes compound within a session; a dice tier is a one-time step with no repeat purchases.",
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

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">About the prices</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Luck values are published by the game. Prices come from community reporting, and
          the rows marked &quot;single source&quot; rest on one list rather than two
          independent recordings. Treat those as a savings target to confirm in your own
          shop, not as a settled number.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/grades/" className="text-primary underline-offset-4 hover:underline">
            Grade odds and calculator
          </Link>
          <span className="px-2 text-border" aria-hidden="true">
            /
          </span>
          <Link href="/codes/" className="text-primary underline-offset-4 hover:underline">
            Codes for Lucky Spins
          </Link>
        </p>
      </section>
    </div>
  );
}

/** "$1.5T" -> 1.5e12, so the step-up column can compare rows. */
function priceRatio(p: string): number {
  const m = p.match(/\$([\d.]+)([KMBT]?)/);
  if (!m) return 0;
  const mult: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9, T: 1e12, "": 1 };
  return Number(m[1]) * (mult[m[2]] ?? 1);
}
