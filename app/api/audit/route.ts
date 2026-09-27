import { NextRequest, NextResponse } from "next/server";
import { searchSerper } from "@/lib/serper";
import { scoreResults } from "@/lib/classify";
import type { SearchItem } from "@/lib/types";

// Simple in-memory rate limiter: max 1 request per IP per 10 seconds.
// Protects the free Serper quota (2,500 queries; each audit costs 2).
// Note: resets on server restart / scales per-instance — sufficient for a pilot demo.
const lastHitByIp = new Map<string, number>();
const WINDOW_MS = 10_000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** Retry once after a short pause before surfacing a search failure. */
async function searchWithRetry(query: string, count: number): Promise<SearchItem[]> {
  try {
    return await searchSerper(query, count);
  } catch {
    await new Promise((r) => setTimeout(r, 800));
    return await searchSerper(query, count);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit check.
    const ip = getClientIp(req);
    const now = Date.now();
    const last = lastHitByIp.get(ip);
    if (last !== undefined && now - last < WINDOW_MS) {
      const waitSec = Math.ceil((WINDOW_MS - (now - last)) / 1000);
      return NextResponse.json(
        {
          error: `Rate limited — please wait ${waitSec}s before running another audit (1 request per 10 seconds protects the free search quota).`,
        },
        { status: 429 }
      );
    }
    lastHitByIp.set(ip, now);

    // Validate input.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const query =
      typeof (body as { query?: unknown }).query === "string"
        ? ((body as { query: string }).query ?? "").trim()
        : "";

    if (!query) {
      return NextResponse.json(
        { error: "Query must not be empty." },
        { status: 400 }
      );
    }
    if (query.length > 200) {
      return NextResponse.json(
        { error: "Query is too long — maximum 200 characters." },
        { status: 400 }
      );
    }

    // Fire both searches in parallel (each with one retry on failure).
    const [vanillaRaw, evasionRaw] = await Promise.all([
      searchWithRetry(query, 10),
      searchWithRetry(`${query} reddit`, 10),
    ]);

    // Take top 5 organic results per condition.
    const vanillaTop = vanillaRaw.slice(0, 5);
    const evasionTop = evasionRaw.slice(0, 5);

    if (vanillaTop.length < 5 || evasionTop.length < 5) {
      return NextResponse.json(
        {
          error: `Live search returned too few results (vanilla: ${vanillaTop.length}, evasion: ${evasionTop.length}). Please try again in a moment — no placeholder data was substituted.`,
        },
        { status: 502 }
      );
    }

    const vanilla = scoreResults(vanillaTop);
    const evasion = scoreResults(evasionTop);

    return NextResponse.json({ vanilla, evasion, query });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Live search failed unexpectedly.";
    return NextResponse.json(
      { error: `Live search failed — ${message} Please try again in a moment.` },
      { status: 502 }
    );
  }
}
