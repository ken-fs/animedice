// Share card (1200×630) drawn at build time, so every page gets og:image / twitter:image.
// 2026-10-12: this site had no og:image, so social shares and Discord embeds were bare links.
// Same card as Ship/game-template-next (src/app/opengraph-image.tsx), with this site's colors and copy.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CARD = {
  "title": "Anime Dice Reference",
  "kicker": "Anime Dice · Roblox · fan guide",
  "domain": "animedice.xyz",
  "description": "Every Anime Dice code, all 28 units with published roll odds, the nine grades with their real chances, and the eight-dice ladder.",
  "colors": {
    "paper": "#fef7f0",
    "card": "#fffcfa",
    "ink": "#1c1917",
    "soft": "#57534e",
    "accent": "#b45309"
  },
  "displayFont": null
} as const;
export const alt = CARD.title;

const toArrayBuffer = (buf: Buffer) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
function font(rel: string): ArrayBuffer | null {
  const file = join(process.cwd(), rel);
  return existsSync(file) ? toArrayBuffer(readFileSync(file)) : null;
}

export default function OpengraphImage() {
  const body = font("node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf");
  const display = CARD.displayFont ? font(CARD.displayFont) : null;
  const c = CARD.colors;
  return new ImageResponse(
    (
      <div style={{ background: c.paper, display: "flex", ...(body ? { fontFamily: "Body" } : {}), height: "100%", padding: 56, width: "100%" }}>
        <div style={{ background: c.card, border: `4px solid ${c.ink}`, borderRadius: 28, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "52px 60px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ alignItems: "center", color: c.soft, display: "flex", fontSize: 28, gap: 14 }}>
              <div style={{ background: c.accent, borderRadius: 999, height: 16, width: 16 }} />
              {CARD.kicker}
            </div>
            <div style={{ color: c.ink, ...(display ? { fontFamily: "Display" } : {}), fontSize: CARD.title.length > 28 ? 72 : 86, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.04, marginTop: 28 }}>
              {CARD.title}
            </div>
            <div style={{ color: c.soft, display: "flex", fontSize: 30, lineHeight: 1.35, marginTop: 26, maxWidth: 960 }}>
              {CARD.description.length > 118 ? `${CARD.description.slice(0, 115).replace(/\s+\S*$/, "")}…` : CARD.description}
            </div>
          </div>
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <div style={{ background: c.accent, borderRadius: 999, height: 10, width: 120 }} />
            <div style={{ color: c.ink, fontSize: 30 }}>{CARD.domain}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(body ? [{ data: body, name: "Body", style: "normal" as const, weight: 400 as const }] : []),
        ...(display ? [{ data: display, name: "Display", style: "normal" as const, weight: 800 as const }] : []),
      ],
    },
  );
}
