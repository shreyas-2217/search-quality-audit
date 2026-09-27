"use client";

import { useState } from "react";

const ROWS: { category: string; score: number; description: string }[] = [
  { category: "User discussion/forums", score: 1, description: "Reddit, forums, Q&A communities — lived user experience." },
  { category: "Shopping/product pages", score: 0, description: "Amazon, Best Buy, Walmart, etc." },
  { category: "Review/affiliate blogs", score: 0, description: "\"Best…\", \"review\", \"vs\" listicles with affiliate incentives." },
  { category: "Guide/how-to articles", score: 0, description: "SEO how-tos, tutorials, wikis, tier lists." },
  { category: "Scientific/research articles", score: 0, description: ".edu / .gov / journals / studies." },
  { category: "News/editorial pieces", score: 0, description: "Newsroom / editorial coverage." },
];

export default function MethodologyNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-[#111111]"
      >
        <span>Methodology — how results are scored</span>
        <span className="text-[#6B7280]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-[#E5E7EB] px-4 py-4">
          <p className="text-sm text-[#6B7280]">
            Strict binary rubric from the paper. Only <em>user discussion / forums</em> counts
            as authentic (score 1); all other categories score 0. Authenticity rate = (sum of
            scores ÷ 5) × 100 per condition.
          </p>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="py-1.5 pr-2 font-medium">Category</th>
                <th className="py-1.5 pr-2 font-medium">Score</th>
                <th className="py-1.5 font-medium">Signal</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.category} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 pr-2 text-[#111111]">{r.category}</td>
                  <td className="py-1.5 pr-2">
                    <span className={r.score === 1 ? "font-semibold text-[#16A34A]" : "font-semibold text-[#DC2626]"}>
                      {r.score}
                    </span>
                  </td>
                  <td className="py-1.5 text-[#6B7280]">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-[#6B7280]">
            Classification is a domain heuristic + title/description keyword pass. Anything
            unclassifiable falls back to “Guide/how-to articles (unclassified)” with a ⚠ needs
            review tag — never silently forced into a cleaner category. Sponsored/ad results
            are excluded before scoring.
          </p>
        </div>
      )}
    </div>
  );
}
