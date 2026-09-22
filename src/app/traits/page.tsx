import type { Metadata } from "next";
import Link from "next/link";
import { traits } from "@/data/game";

export const metadata: Metadata = {
  title: "All 13 traits and what each one multiplies",
  description:
    "Every Anime Dice trait from Transcendent at 15x to Money I at 1.2x, grouped by tier, with which stats each one raises.",
  alternates: { canonical: "/traits/" },
};

const TIERS = ["S", "A", "B", "C"] as const;
const TIER_NOTE: Record<string, string> = {
  S: "The four traits that raise all three stats at once. Each has under a 1% roll chance, so they are the ones worth saving rerolls for.",
  A: "Single-stat traits with a 2x multiplier. The realistic target for most units.",
  B: "1.5x on one stat. Fine on a mid-tier unit, worth replacing on a keeper.",
  C: "1.2x on one stat, and by far the most common results. Reroll past these.",
};

export default function TraitsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Traits, grouped by what they multiply
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          There are {traits.length} traits. The four best raise Health, Damage and Income
          together; the other nine raise a single stat. Traits stack with grades and
          mutations, so a trait multiplier lands on top of everything else on the unit.
        </p>
      </header>

      <div className="space-y-10 pb-12">
        {TIERS.map((tier) => {
          const rows = traits.filter((t) => t.tier === tier);
          return (
            <section key={tier}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-sm font-medium">Tier {tier}</h2>
                <span className="text-xs text-muted-foreground tabular">
                  {rows.length} trait{rows.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-1.5 max-w-[62ch] text-sm text-muted-foreground">
                {TIER_NOTE[tier]}
              </p>
              <ul className="mt-4 divide-y rule overflow-hidden rounded-[var(--radius-container)] border rule bg-card">
                {rows.map((t) => (
                  <li key={t.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                    <span className="w-32 shrink-0 font-medium">{t.name}</span>
                    <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {t.income !== null && <span className="tabular">{t.income}x Income</span>}
                      {t.damage !== null && <span className="tabular">{t.damage}x Damage</span>}
                      {t.health !== null && <span className="tabular">{t.health}x Health</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">What we could not find</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Roll chances for individual traits are not published. The only figure any source
          gives is that the four tier S traits each sit under 1%, which is not enough to
          build a reroll calculator on. Rather than invent a distribution, this page lists
          effects only.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Grade chances, by contrast, are published in full, so that page does carry a
          working calculator.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/grades/" className="text-primary underline-offset-4 hover:underline">
            Grade calculator
          </Link>
          <span className="px-2 text-border" aria-hidden="true">/</span>
          <Link href="/mutations/" className="text-primary underline-offset-4 hover:underline">
            Mutations
          </Link>
        </p>
      </section>
    </div>
  );
}
