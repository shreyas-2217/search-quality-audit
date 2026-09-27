"use client";

import { useState } from "react";

const ROWS: { category: string; score: number; description: string }[] = [
  { category: "User discussion/forums", score: 1, description: "Reddit threads, community forums, and Q&A platforms representing firsthand user experience" },
  { category: "Shopping/product pages", score: 0, description: "E-commerce listings (e.g., Amazon, Flipkart, Best Buy)" },
  { category: "Review/affiliate blogs", score: 0, description: "Comparative or \u201Cbest-of\u201D content structured around affiliate monetization" },
  { category: "Guide/how-to articles", score: 0, description: "Instructional content, tutorials, wikis, and tier lists" },
  { category: "Scientific/research articles", score: 0, description: "Peer-reviewed publications and content hosted on .edu or .gov domains" },
  { category: "News/editorial pieces", score: 0, description: "Newsroom and editorial coverage" },
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
        <span>Methodology — Classification Rubric</span>
        <span className="text-[#6B7280]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-[#E5E7EB] px-4 py-4">
          <p className="text-sm text-[#6B7280]">
            Each result is scored using the binary authenticity rubric defined in the
            paper&rsquo;s pilot audit. A result scores 1 only if it constitutes genuine
            peer-to-peer discussion; all other content types score 0. The authenticity
            rate for each condition is calculated as (sum of scores &divide; 5) &times; 100.
          </p>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="py-1.5 pr-2 font-medium">Category</th>
                <th className="py-1.5 pr-2 font-medium">Score</th>
                <th className="py-1.5 font-medium">Classification Criteria</th>
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
            Classification is performed using a combination of domain-based heuristics
            and keyword analysis of each result&rsquo;s title and description. Results that
            cannot be classified with sufficient confidence are labeled
            &ldquo;Guide/how-to articles (unclassified)&rdquo; and flagged for manual review
            rather than assigned to a category without adequate signal. Sponsored and
            advertisement-labeled results are excluded prior to scoring.
          </p>
        </div>
      )}
    </div>
  );
}
