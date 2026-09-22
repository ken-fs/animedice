import type { MetadataRoute } from "next";
import { units, codes } from "@/data/game";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://animedice.wiki";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, freq: "daily" },
    { path: "/codes/", priority: 0.9, freq: "daily" },
    { path: "/units/", priority: 0.9, freq: "weekly" },
    { path: "/grades/", priority: 0.8, freq: "weekly" },
    { path: "/dice/", priority: 0.7, freq: "weekly" },
    { path: "/traits/", priority: 0.7, freq: "weekly" },
    { path: "/mutations/", priority: 0.7, freq: "weekly" },
    { path: "/guide/", priority: 0.7, freq: "weekly" },
    { path: "/about/", priority: 0.3, freq: "monthly" },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: SITE + r.path,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...units.map((u) => ({
      url: `${SITE}/units/${u.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

export const dynamic = "force-static";

/** Exported so the codes page and sitemap can never drift apart. */
export const codeCount = codes.length;
