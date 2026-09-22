import type { Tier } from "@/data/game";

const TIER_VAR: Record<Tier, string> = {
  "S+": "var(--tier-splus)",
  S: "var(--tier-s)",
  A: "var(--tier-a)",
  B: "var(--tier-b)",
  C: "var(--tier-c)",
  D: "var(--tier-d)",
  Unranked: "var(--tier-d)",
};

/**
 * Tier badge.
 *
 * Tier is ordinal and correlates with roll odds, so it uses the sequential ink
 * ramp rather than the red/orange/yellow rainbow every other Anime Dice site
 * ships. Darker ink means rarer. The letter is the label, the ink is the data.
 */
export function TierBadge({ tier, size = "md" }: { tier: Tier; size?: "sm" | "md" }) {
  const unranked = tier === "Unranked";
  const dim = size === "sm" ? "size-5 text-[10px]" : "size-6 text-[11px]";

  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-[4px] font-mono font-semibold tabular`}
      style={
        unranked
          ? { border: "1px dashed var(--border)", color: "var(--muted-foreground)" }
          : { background: TIER_VAR[tier], color: "var(--background)" }
      }
      title={unranked ? "No published ranking" : `Tier ${tier}`}
    >
      {unranked ? "?" : tier}
    </span>
  );
}

/** Tier legend, used once per page that shows badges. */
export function TierLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span>Ink density tracks roll odds:</span>
      <span className="flex items-center gap-1.5">
        <TierBadge tier="S+" size="sm" /> rarest
      </span>
      <span className="text-border" aria-hidden="true">
        /
      </span>
      <span className="flex items-center gap-1.5">
        <TierBadge tier="D" size="sm" /> commonest
      </span>
    </div>
  );
}
