"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultCard, { SkeletonCard } from "@/components/ResultCard";
import ComparisonChart from "@/components/ComparisonChart";
import ExampleQueries from "@/components/ExampleQueries";
import MethodologyNote from "@/components/MethodologyNote";
import type { AuditResponse } from "@/lib/types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditResponse | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>("");

  async function runAudit(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setData(null);
    setActiveQuery(trimmed);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          (json as { error?: string }).error ??
            "Live search failed — please try again in a moment."
        );
        return;
      }
      setData(json as AuditResponse);
    } catch {
      setError("Live search failed — please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5">
      {/* Header */}
      <section className="py-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7280]">
          Pilot audit companion
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-[#111111]">
          Bypassing the Ad Machine
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#6B7280]">
          A live companion to{" "}
          <em>
            “Bypassing the Ad Machine: An Analysis of Search Engine
            Enshittification and User-Side Algorithmic Evasion.”
          </em>{" "}
          Type any query to compare a standard search against the same query
          with “ reddit” appended — scored with the paper’s binary authenticity
          rubric. All results are fetched live; nothing is mocked.
        </p>
      </section>

      {/* Search */}
      <section className="border-t border-[#E5E7EB] py-12">
        <SearchForm
          value={query}
          loading={loading}
          onChange={setQuery}
          onSubmit={() => runAudit(query)}
        />
        <div className="mt-4">
          <p className="mb-2 text-sm text-[#6B7280]">
            Or try one of the paper’s original 4 queries:
          </p>
          <ExampleQueries
            disabled={loading}
            onSelect={(q) => {
              setQuery(q);
              runAudit(q);
            }}
          />
        </div>
        <div className="mt-6">
          <MethodologyNote />
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section aria-live="polite" className="border-t border-[#E5E7EB] py-12">
          <p className="mb-4 text-sm text-[#6B7280]">
            Fetching live results for “{activeQuery}” — vanilla + evasion…
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            {[0, 1].map((col) => (
              <div key={col}>
                <div className="mb-3 h-5 w-40 rounded bg-gray-200" />
                <div className="flex flex-col gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error — honest, never fake data */}
      {!loading && error && (
        <section aria-live="assertive" className="border-t border-[#E5E7EB] py-12">
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        </section>
      )}

      {/* Results */}
      {!loading && data && (
        <section className="border-t border-[#E5E7EB] py-12">
          <h2 className="font-serif text-2xl text-[#111111]">
            Results for “{data.query}”
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Top 5 organic results per condition, fetched live and independently.
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-base font-semibold text-[#111111]">
                Vanilla Search
              </h3>
              <p className="mb-3 text-sm text-[#6B7280]">
                Authenticity:{" "}
                <strong className="text-[#111111]">
                  {data.vanilla.authenticityRate}%
                </strong>
              </p>
              <div className="flex flex-col gap-3">
                {data.vanilla.results.map((r, i) => (
                  <ResultCard key={r.url + i} result={r} index={i} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-base font-semibold text-[#111111]">
                Evasion Search + reddit
              </h3>
              <p className="mb-3 text-sm text-[#6B7280]">
                Authenticity:{" "}
                <strong className="text-[#111111]">
                  {data.evasion.authenticityRate}%
                </strong>
              </p>
              <div className="flex flex-col gap-3">
                {data.evasion.results.map((r, i) => (
                  <ResultCard key={r.url + i} result={r} index={i} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <ComparisonChart
              vanillaRate={data.vanilla.authenticityRate}
              evasionRate={data.evasion.authenticityRate}
            />
          </div>

          <p className="mt-6 rounded-md border border-[#E5E7EB] bg-gray-50 px-4 py-3 text-xs leading-relaxed text-[#6B7280]">
            This tool illustrates the methodology from a 4-query pilot study
            using live Google results. Each search above is fetched live
            and independently — results are not part of the original published
            dataset unless they match one of the 4 example queries.
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-12 text-center">
        <p className="text-xs leading-relaxed text-[#6B7280]">
          Stateless demo — searches are fetched fresh via Google (Serper API)
          and never stored. Rate limited to 1 audit per 10 seconds.
          <br />
          The API key lives server-side only (see{" "}
          <code className="rounded bg-gray-100 px-1">/api/audit</code>); it
          never appears in client network requests.
        </p>
      </footer>
    </main>
  );
}
