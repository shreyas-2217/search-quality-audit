"use client";

import type { ScoredResult } from "@/lib/types";

const CATEGORY_STYLES: Record<string, string> = {
  "User discussion/forums": "bg-green-50 text-green-800 border-green-200",
  "Shopping/product pages": "bg-gray-100 text-gray-700 border-gray-300",
  "Review/affiliate blogs": "bg-amber-50 text-amber-800 border-amber-200",
  "Guide/how-to articles": "bg-blue-50 text-blue-800 border-blue-200",
  "Guide/how-to articles (unclassified)": "bg-blue-50 text-blue-800 border-blue-200",
  "Scientific/research articles": "bg-violet-50 text-violet-800 border-violet-200",
  "News/editorial pieces": "bg-rose-50 text-rose-800 border-rose-200",
};

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-md border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="h-5 w-8 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function ResultCard({ result, index }: { result: ScoredResult; index: number }) {
  const badge = CATEGORY_STYLES[result.category] ?? "bg-gray-100 text-gray-700 border-gray-300";
  const dot = result.score === 1 ? "bg-[#16A34A]" : "bg-[#DC2626]";

  return (
    <article className="rounded-md border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <span
          title={result.score === 1 ? "Authentic (score 1)" : "Inauthentic (score 0)"}
          aria-label={result.score === 1 ? "Score 1" : "Score 0"}
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
        />
        <div className="min-w-0 flex-1">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[15px] font-medium text-[#111111] hover:underline"
            title={result.title}
          >
            <span className="mr-1 text-[#6B7280]">{index + 1}.</span>
            {result.title || "(untitled)"}
          </a>
          <p className="mt-0.5 truncate text-sm text-[#6B7280]">{result.domain}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge}`}>
          {result.category}
        </span>
        <span className="text-xs text-[#6B7280]">
          score: <strong className={result.score === 1 ? "text-[#16A34A]" : "text-[#DC2626]"}>{result.score}</strong>
        </span>
        {result.needsReview && (
          <span
            className="inline-block rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-800"
            title="Classifier could not confidently categorize this result"
          >
            ⚠ needs review
          </span>
        )}
      </div>
    </article>
  );
}
