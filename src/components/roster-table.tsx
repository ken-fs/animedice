"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CaretDown, CaretUp } from "@phosphor-icons/react/dist/ssr";
import { TIER_ORDER, tierOf, type Tier, type Unit } from "@/data/game";
import { TierBadge } from "@/components/tier-badge";

type SortKey = "tier" | "name" | "odds" | "income";

/**
 * The roster table.
 *
 * A table is the right control for 28 comparable records: readers scan a column,
 * not a feed. Sorting is client-side because the data set is small and static,
 * so there is no reason to pay for a round trip.
 */
export function RosterTable({ units }: { units: Unit[] }) {
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<SortKey>("income");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const filtered = tier === "all" ? units : units.filter((u) => u.tier === tier);
    const sorted = [...filtered].sort((a, b) => {
      const sign = dir === "asc" ? 1 : -1;
      switch (sort) {
        case "tier":
          return (tierOf(a.tier) - tierOf(b.tier)) * sign;
        case "name":
          return a.name.localeCompare(b.name) * sign;
        // Nulls always sink to the bottom regardless of direction, so an
        // unverified unit never masquerades as the cheapest or the rarest.
        case "odds":
          if (a.odds === null) return 1;
          if (b.odds === null) return -1;
          return (a.odds - b.odds) * sign;
        case "income":
          if (a.income === null) return 1;
          if (b.income === null) return -1;
          return (a.income - b.income) * sign;
      }
    });
    return sorted;
  }, [units, tier, sort, dir]);

  function toggle(key: SortKey) {
    if (sort === key) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setDir(key === "name" || key === "tier" ? "asc" : "desc");
    }
  }

  const counts = useMemo(() => {
    const m = new Map<Tier, number>();
    for (const u of units) m.set(u.tier, (m.get(u.tier) ?? 0) + 1);
    return m;
  }, [units]);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <FilterPill active={tier === "all"} onClick={() => setTier("all")}>
          All <span className="text-muted-foreground tabular">{units.length}</span>
        </FilterPill>
        {TIER_ORDER.map((t) => (
          <FilterPill key={t} active={tier === t} onClick={() => setTier(t)}>
            {t === "Unranked" ? "No rank" : t}{" "}
            <span className="text-muted-foreground tabular">{counts.get(t) ?? 0}</span>
          </FilterPill>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-[var(--radius-container)] border rule bg-card">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b rule text-left">
              <Th onClick={() => toggle("tier")} active={sort === "tier"} dir={dir} className="w-16">
                Tier
              </Th>
              <Th onClick={() => toggle("name")} active={sort === "name"} dir={dir}>
                Unit
              </Th>
              <Th onClick={() => toggle("odds")} active={sort === "odds"} dir={dir} align="right">
                Roll odds
              </Th>
              <Th onClick={() => toggle("income")} active={sort === "income"} dir={dir} align="right">
                Base income
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.slug} className="border-b rule last:border-0 hover:bg-muted/60">
                <td className="px-3 py-2.5">
                  <TierBadge tier={u.tier} size="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/units/${u.slug}/`}
                    className="font-medium underline-offset-4 hover:text-primary hover:underline"
                  >
                    {u.name}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {u.odds === null ? (
                    <span className="text-muted-foreground">not published</span>
                  ) : (
                    u.oddsText
                  )}
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {u.income === null ? (
                    <span className="text-muted-foreground">not published</span>
                  ) : (
                    u.incomeText
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground tabular">
        Showing {rows.length} of {units.length}
      </p>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th className={`px-3 py-2.5 font-medium ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className={
          "inline-flex items-center gap-1 text-xs uppercase tracking-wide transition-colors hover:text-foreground " +
          (align === "right" ? "flex-row-reverse " : "") +
          (active ? "text-foreground" : "text-muted-foreground")
        }
      >
        {children}
        {active &&
          (dir === "asc" ? (
            <CaretUp size={11} weight="bold" />
          ) : (
            <CaretDown size={11} weight="bold" />
          ))}
      </button>
    </th>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border px-3 py-1 text-xs transition-colors " +
        (active
          ? "border-foreground bg-foreground text-background"
          : "rule bg-card hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}
