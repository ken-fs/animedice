import type { Metadata } from "next";
import Link from "next/link";
import { mutations } from "@/data/game";

export const metadata: Metadata = {
  title: "The 6 mutations and 2 size modifiers",
  description:
    "Anime Dice mutations are gem-named: Silver, Gold, Emerald, Diamond, Ruby and Rainbow, plus the huge and titanic size modifiers. Multipliers are not published.",
  alternates: { canonical: "/mutations/" },
};

export default function MutationsPage() {
  const names = mutations.names as string[];
  const sizes = mutations.sizeModifiers as string[];

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Mutations and size modifiers
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          Mutations raise a unit&apos;s base value, and they sit underneath the grade and
          trait multipliers rather than beside them. There are {names.length} of them, plus
          two size modifiers that can appear on the same copy.
        </p>
      </header>

      <section className="pb-12">
        <h2 className="text-sm font-medium">The six mutations</h2>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-3">
          {names.map((n) => (
            <li key={n} className="bg-card p-5">
              <p className="font-medium">{n}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Multiplier not published
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Size modifiers</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          A unit can carry a size modifier on top of its mutation, so two copies of the
          same unit are rarely identical.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <li
              key={s}
              className="rounded-[var(--radius-control)] border rule bg-card px-3 py-1.5 text-sm capitalize"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Why we are not publishing multipliers</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          The mutation multipliers circulating online belong to a different Roblox game
          with a similar name. They list Demonic, Dracula and Nightmare, which are fish
          mutations in that game, not gem mutations in this one. Copying them across would
          have produced a page that looks complete and is wrong in every row.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          The six names above come from a guide published after Update 3. Their multipliers
          are shown in game on the unit card, so if you have one, the number is on your
          screen. We will publish the full table when a source states them.
        </p>
      </section>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">Checking a duplicate before you sell it</h2>
        <ol className="mt-4 space-y-3">
          {[
            "Open the unit card and read the mutation name.",
            "Check the size modifier. A huge or titanic copy is worth keeping even on an average unit.",
            "Read the grade letter and the trait. Those two multipliers often matter more than the base income difference between two units.",
            "Only then compare base income against the unit you would replace.",
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 font-mono text-xs text-muted-foreground tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="max-w-[62ch] text-sm text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/units/" className="text-primary underline-offset-4 hover:underline">
            Unit income table
          </Link>
          <span className="px-2 text-border" aria-hidden="true">/</span>
          <Link href="/grades/" className="text-primary underline-offset-4 hover:underline">
            Grade odds
          </Link>
        </p>
      </section>
    </div>
  );
}
