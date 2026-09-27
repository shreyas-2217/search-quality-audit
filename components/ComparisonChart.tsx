"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface ComparisonChartProps {
  vanillaRate: number;
  evasionRate: number;
}

export default function ComparisonChart({ vanillaRate, evasionRate }: ComparisonChartProps) {
  const data = [
    { name: "Vanilla", rate: vanillaRate, fill: "#9CA3AF" },
    { name: "Evasion (+ reddit)", rate: evasionRate, fill: "#111827" },
  ];

  return (
    <figure className="rounded-md border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <figcaption className="font-serif text-lg text-[#111111]">
        Fig. 2 — Authenticity rate: vanilla vs. evasion
      </figcaption>
      <p className="mt-1 text-sm text-[#6B7280]">
        Share of top-5 results classified as user discussion (score 1).
      </p>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 56, top: 8, bottom: 8 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#6B7280" }} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 13, fill: "#111111" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Bar dataKey="rate" radius={[0, 6, 6, 0]} isAnimationActive animationDuration={800}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <LabelList dataKey="rate" position="right" formatter={(v: unknown) => `${Number(v)}%`} style={{ fontSize: 14, fontWeight: 600, fill: "#111111" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-6 text-sm">
        <span className="flex items-center gap-2 text-[#6B7280]">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#9CA3AF]" /> Vanilla: {vanillaRate}%
        </span>
        <span className="flex items-center gap-2 text-[#111111] font-medium">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#111827]" /> Evasion: {evasionRate}%
        </span>
      </div>
    </figure>
  );
}
