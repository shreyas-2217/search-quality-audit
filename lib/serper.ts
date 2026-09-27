import type { SearchItem } from "./types";

interface SerperOrganicResult {
  title?: string;
  link?: string;
  snippet?: string;
  position?: number;
}

interface SerperSearchResponse {
  organic?: SerperOrganicResult[];
}

/**
 * Fetch live organic web results via Serper (Google SERP API).
 * Official REST API — stable from any network, no scraping involved.
 * Key lives server-side only (process.env), never sent to the browser.
 * Throws on failure — the caller surfaces this honestly, never fakes data.
 */
export async function searchSerper(
  query: string,
  count = 10
): Promise<SearchItem[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "SERPER_API_KEY is not configured on the server. Add it to .env.local (see .env.example)."
    );
  }

  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    // num <= 10 costs a single credit; never cache — each search is fresh.
    body: JSON.stringify({ q: query, num: count }),
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Serper API key rejected (401/403). Check SERPER_API_KEY.");
  }
  if (res.status === 429) {
    throw new Error(
      "Serper rate limit / credits exhausted (429). Check your serper.dev dashboard."
    );
  }
  if (!res.ok) {
    throw new Error(`Serper API failed with status ${res.status}.`);
  }

  const data = (await res.json()) as SerperSearchResponse;
  const raw = data?.organic ?? [];

  const organic = raw.filter((r) => {
    if (typeof r.link !== "string" || typeof r.title !== "string") return false;
    // Defensive: the organic array should contain no ads, but drop anything
    // that looks like a sponsored placement.
    const blob = `${r.link} ${r.title} ${r.snippet ?? ""}`.toLowerCase();
    if (blob.includes("sponsored")) return false;
    return true;
  });

  return organic.slice(0, count).map((r) => ({
    title: (r.title as string) ?? "",
    url: (r.link as string) ?? "",
    description: r.snippet ?? "",
  }));
}
