import type { Category, ScoredResult } from "./types";

const DISCUSSION_DOMAINS = [
  "reddit.com",
  "steamcommunity.com",
  "quora.com",
  "stackexchange.com",
  "stackoverflow.com",
  "forums.",
  "community.",
  "discussions.",
];

const SHOPPING_DOMAINS = [
  "amazon.",
  "bestbuy.com",
  "walmart.com",
  "target.com",
  "ebay.com",
  "newegg.com",
];

const NEWS_DOMAINS = [
  "nytimes.com",
  "bbc.com",
  "bbc.co.uk",
  "theguardian.com",
  "washingtonpost.com",
  "reuters.com",
  "apnews.com",
  "cnn.com",
  "nbcnews.com",
  "abcnews.go.com",
  "cbsnews.com",
  "foxnews.com",
  "wsj.com",
  "nypost.com",
  "usatoday.com",
  "latimes.com",
  "theverge.com",
  "wired.com",
  "arstechnica.com",
  "techcrunch.com",
  "forbes.com",
  "bloomberg.com",
  "businessinsider.com",
  "polygon.com",
  "ign.com",
  "gamespot.com",
  "pcgamer.com",
  "eurogamer.net",
];

export function extractDomain(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return url.toLowerCase();
  }
}

function includesDomain(host: string, entry: string): boolean {
  return host === entry || host.includes(entry);
}

function looksScientific(title: string, desc: string, host: string): boolean {
  const text = `${title} ${desc}`.toLowerCase();
  if (host.endsWith(".edu") || host.endsWith(".gov")) return true;
  const keywords = [
    "journal",
    "study",
    "research",
    "peer-reviewed",
    "meta-analysis",
    "pubmed",
    "nih.gov",
    "nature.com",
    "sciencedirect",
    "plos one",
    "clinical trial",
  ];
  return keywords.some((k) => text.includes(k) || host.includes(k));
}

function looksReviewAffiliate(title: string, desc: string): boolean {
  const text = `${title} ${desc}`.toLowerCase();
  const patterns = [
    "review",
    "best ",
    "best-",
    "top 10",
    "top 5",
    " vs ",
    " vs.",
    "comparison",
    "affiliate",
    "discount code",
    "buy now",
    "price",
  ];
  return patterns.some((p) => text.includes(p));
}

function looksNews(host: string, title: string, desc: string): boolean {
  if (NEWS_DOMAINS.some((d) => includesDomain(host, d))) return true;
  const text = `${title} ${desc}`.toLowerCase();
  // Conservative: only obvious newsroom signals on unknown domains.
  return (
    text.includes("breaking news") ||
    text.includes("reported by") ||
    text.includes("according to sources")
  );
}

/**
 * Strict binary scoring per the paper's rubric:
 *  - User discussion/forums => 1
 *  - Everything else        => 0
 *
 * Anything that cannot be confidently classified falls back to
 * "Guide/how-to articles (unclassified)" with needsReview = true,
 * so the UI can flag it instead of silently misclassifying.
 */
export function classifyResult(
  title: string,
  url: string,
  description: string
): ScoredResult {
  const domain = extractDomain(url);
  const host = domain.toLowerCase();
  const t = title ?? "";
  const d = description ?? "";

  // Pass 1 — domain heuristics.
  if (DISCUSSION_DOMAINS.some((entry) => includesDomain(host, entry))) {
    return {
      title: t,
      url,
      description: d,
      domain,
      category: "User discussion/forums",
      score: 1,
      needsReview: false,
    };
  }

  if (SHOPPING_DOMAINS.some((entry) => includesDomain(host, entry))) {
    return {
      title: t,
      url,
      description: d,
      domain,
      category: "Shopping/product pages",
      score: 0,
      needsReview: false,
    };
  }

  // Pass 2 — keyword signals on title/description.
  if (looksScientific(t, d, host)) {
    const category: Category = "Scientific/research articles";
    return { title: t, url, description: d, domain, category, score: 0, needsReview: false };
  }

  if (looksNews(host, t, d)) {
    const category: Category = "News/editorial pieces";
    return { title: t, url, description: d, domain, category, score: 0, needsReview: false };
  }

  if (looksReviewAffiliate(t, d)) {
    const category: Category = "Review/affiliate blogs";
    return { title: t, url, description: d, domain, category, score: 0, needsReview: false };
  }

  const guideSignals = [
    "how to",
    "how-to",
    "guide",
    "tutorial",
    "tips",
    "build",
    "tier list",
    "wiki",
    "fandom",
  ];
  const text = `${t} ${d}`.toLowerCase();
  if (guideSignals.some((k) => text.includes(k))) {
    const category: Category = "Guide/how-to articles";
    return { title: t, url, description: d, domain, category, score: 0, needsReview: false };
  }

  // Fallback — never silently misclassify.
  return {
    title: t,
    url,
    description: d,
    domain,
    category: "Guide/how-to articles (unclassified)",
    score: 0,
    needsReview: true,
  };
}

export function scoreResults(
  items: { title: string; url: string; description: string }[]
): { results: ScoredResult[]; authenticityRate: number } {
  const results = items.map((r) =>
    classifyResult(r.title, r.url, r.description)
  );
  const sum = results.reduce((acc, r) => acc + r.score, 0);
  const authenticityRate =
    results.length === 0 ? 0 : Math.round((sum / results.length) * 100);
  return { results, authenticityRate };
}
