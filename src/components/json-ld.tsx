import { SITE_URL } from "@/lib/site";
/**
 * Structured data.
 *
 * Only two shapes are emitted: a WebSite node for the site itself, and FAQPage
 * where a page genuinely answers questions. No aggregateRating or
 * reviewCount, because there are no reviews to aggregate.
 */
export function WebsiteJsonLd({ site, name }: { site: string; name: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: SITE_URL,
    description:
      "An independent Anime Dice reference: unit roll odds, grade chances, codes and the dice ladder.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Ordered roster, so search engines see the same ordering the page shows. */
export function UnitListJsonLd({ units }: { units: { name: string; slug: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Anime Dice units by roll odds",
    numberOfItems: units.length,
    itemListElement: units.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: u.name,
      url: `${SITE_URL}/units/${u.slug}/`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
