import type { Metadata } from "next";
import Link from "next/link";
import { game, gaps } from "@/data/game";

export const metadata: Metadata = {
  title: "About this reference and how the data is checked",
  description:
    "Where every number on this Anime Dice site comes from, how many sources each one needs before we publish it, and what we deliberately left blank.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <header className="pt-14 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          How we check a number before publishing it
        </h1>
        <p className="mt-3 max-w-[62ch] text-muted-foreground">
          This is an independent reference for {game.name}. Every figure on the site is
          either published by the developers or measured by players, and each page says
          which.
        </p>
      </header>

      <section className="pb-12">
        <h2 className="text-sm font-medium">The rules</h2>
        <div className="mt-4 space-y-4">
          <Rule title="A code needs two independent sources">
            Outlets copy each other constantly, so one article printing a code is not
            evidence. Every code on this site appears in at least two separate
            publications, and the page shows the count.
          </Rule>
          <Rule title="A blank is better than a guess">
            Four units have no published odds or income. They are marked in the roster and
            their pages explain the gap rather than filling it.
          </Rule>
          <Rule title="Similar games are not this game">
            The mutation multipliers that circulate under this game&apos;s name belong to a
            different Roblox title. We verified that before publishing, and left the column
            empty as a result.
          </Rule>
          <Rule title="Sources are shown per row where they disagree">
            Dice prices come from community reporting. Rows that rest on a single list are
            labelled, so you know which numbers to confirm in your own shop first.
          </Rule>
        </div>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">What is still missing</h2>
        <p className="mt-1 max-w-[62ch] text-sm text-muted-foreground">
          These are the gaps we know about. If you can point us at a source for any of them,
          they become pages.
        </p>
        <ul className="mt-4 divide-y rule overflow-hidden rounded-[var(--radius-container)] border rule bg-card">
          {(gaps as string[]).map((g) => (
            <li key={g} className="px-4 py-3 text-sm text-muted-foreground">
              {g}
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">The game</h2>
        <dl className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-container)] border rule bg-border sm:grid-cols-2">
          {[
            ["Developer", game.developer],
            ["Released", game.created],
            ["Last updated", game.updated],
            ["Server size", `${game.maxPlayers} players`],
          ].map(([k, v]) => (
            <div key={k} className="bg-card p-4">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm">
          <a
            href={game.robloxUrl}
            target="_blank"
            rel="noopener"
            className="text-primary underline-offset-4 hover:underline"
          >
            {game.name} on Roblox
          </a>
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-medium">Analytics and cookies</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          This site uses Google Analytics to see which pages get read and which ones do not.
          It sets cookies, so it does not load until you accept the banner. Decline and no
          Google script runs, no cookie is set, and no request leaves your browser.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          Your choice is stored in your own browser under the key <code className="font-mono text-xs">ad-consent</code>.
          Clear it and the banner returns. There is no account, no newsletter and no other
          tracker on the site.
        </p>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          The site is served by Cloudflare, which keeps standard request logs. Those are
          outside our control and covered by Cloudflare&apos;s own policy.
        </p>
      </section>

      <section className="border-t rule py-10">
        <h2 className="text-sm font-medium">Independence</h2>
        <p className="mt-3 max-w-[62ch] text-sm text-muted-foreground">
          This site is not affiliated with {game.developer} or Roblox Corporation. Game
          names, unit names and screenshots belong to their owners and are used here to
          describe the game. Screenshots are taken from the game&apos;s own public media.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/units/" className="text-primary underline-offset-4 hover:underline">
            Browse the roster
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

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 rule pl-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1.5 max-w-[62ch] text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
