/**
 * The production origin.
 *
 * Read from the environment so previews and forks can point elsewhere, but the
 * fallback is the real domain rather than a placeholder. A wrong fallback is
 * silent and expensive: it ships a sitemap and canonical tags pointing at a
 * domain nobody owns, and nothing in the build output looks broken.
 *
 * Set NEXT_PUBLIC_SITE_URL in the Cloudflare build environment to override.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://animedice.xyz"
).replace(/\/+$/, "");

export const SITE_NAME = "Anime Dice Reference";
