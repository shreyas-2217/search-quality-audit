"use client";

export const EXAMPLE_QUERIES = [
  "Best controller for Apex Legends PC",
  "Elden Ring DLC build tier list",
  "Creatine monohydrate vs HCl",
  "Best laptop for programming",
];

export default function ExampleQueries({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (q: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLE_QUERIES.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm text-[#111111] transition-colors hover:border-[#111827] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
