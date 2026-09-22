# Anime Dice Reference

A data reference for the Roblox game Anime Dice: unit roll odds, grade chances,
codes, the dice ladder, traits and mutations.

Built as the first site in this fleet that does **not** use the AnvilWiki template
or the CRT-terminal look. Next.js 16 App Router + Tailwind v4 + shadcn/ui, static
export served from Cloudflare Workers assets.

## Why the design looks like this

Every competing Anime Dice site ships the same visual: near-black navy background
with neon accents. Checked four of them, three are `#06080f`-to-`#0c1015` dark.
So this one goes the other way: warm paper, warm ink, one burnt-amber accent.

The layout follows the content rather than a template. The site's whole value is
odds, so the odds are the visual system:

- **The odds ladder** (`src/components/odds-ladder.tsx`) is a rank-frequency plot
  on a log axis. On a linear axis 23 of the 24 published units collapse into the
  first pixel, so the log scale is the data, not a style choice.
- **Tier badges** use a sequential ink ramp rather than the red/orange/yellow
  rainbow everyone else uses. Tier correlates with roll odds, so one ramp carries
  both readings.

## Data provenance

`src/data/game.json` is generated from `../animedice-research/anime-dice-data.json`.
The research log, including the data set that belongs to a different game and was
nearly imported, is in `../animedice-research/README.md`.

Rules the code enforces:

- A unit with no published odds renders `not published`, never a guess.
- Dice prices carry a per-row `sourcing` flag (`single` vs `corroborated`).
- The grade chances sum to 98.613%, not 100%. The page says so rather than
  rescaling the numbers to look tidy.

## Commands

```bash
pnpm dev                 # local dev
pnpm build               # static export to ./out
npx wrangler deploy      # deploy ./out to Cloudflare Workers
```

## Structure

```
src/app/
  page.tsx               home: hero, codes, the ladder, the four systems
  codes/                 all 14 codes, each confirmed by 2+ sources
  units/                 roster index with the full ladder and a sortable table
  units/[slug]/          28 unit pages, generated from game.json
  grades/                nine grades plus a working reroll calculator
  dice/                  the 8-dice ladder and a buy/skip procedure
  traits/                13 traits by tier
  mutations/             6 mutations, multipliers deliberately blank
  guide/                 beginner guide
  about/                 sourcing rules and the list of known gaps
```


## Deployment

Push to `main` and Cloudflare Workers Builds rebuilds and redeploys automatically.
Verified 2026-09-22: a push produced a new deployment 75 seconds later.

```bash
git add -A && git commit -m "..." && git push
```

Manual deploy still works but is temporary, since the next push rebuilds from git.

```bash
pnpm build && npx wrangler deploy
```
