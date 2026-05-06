const BASE = "https://www.eggthropic.com";

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eggthropic",
    url: BASE,
    description:
      "An independent experimental lab for learning Claude by building real experiments with Claude Code, Agent Skills, MCP, and the Anthropic API.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    author: { "@type": "Organization", name: "Eggthropic", url: BASE },
    publisher: { "@type": "Organization", name: "Eggthropic", url: BASE },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ExperimentJsonLd({
  title,
  description,
  url,
  datePublished,
  tools,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  tools: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    datePublished,
    keywords: tools.join(", "),
    author: { "@type": "Organization", name: "Eggthropic", url: BASE },
    publisher: { "@type": "Organization", name: "Eggthropic", url: BASE },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
