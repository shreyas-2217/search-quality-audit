"use client";

interface SearchFormProps {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function SearchForm({ value, loading, onChange, onSubmit }: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="audit-query" className="sr-only">
        Search query
      </label>
      <input
        id="audit-query"
        type="text"
        value={value}
        maxLength={200}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Best controller for Apex Legends PC"
        disabled={loading}
        className="h-12 flex-1 rounded-md border border-[#E5E7EB] bg-white px-4 text-base text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
      />
      <button
        type="submit"
        disabled={loading || value.trim().length === 0}
        className="h-12 shrink-0 rounded-md bg-[#111827] px-6 text-base font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Auditing…" : "Run Audit"}
      </button>
    </form>
  );
}
