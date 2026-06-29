"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PIE_PALETTE, TOOLTIP_STYLE } from "@/components/charts/chartTheme";
import { formatCompact, formatCurrency } from "@/lib/format";

export interface PieSlice {
  name: string;
  value: number;
  color?: string;
}

interface IncomePieProps {
  data: PieSlice[];
  /** Center label, e.g. total */
  centerLabel?: string;
  centerSublabel?: string;
  height?: number;
}

export function IncomePie({
  data,
  centerLabel,
  centerSublabel,
  height = 280,
}: IncomePieProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [formatCurrency(Number(value)), ""]}
            separator=""
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
            cornerRadius={6}
            stroke="none"
            isAnimationActive
            animationDuration={900}
          >
            {data.map((slice, index) => (
              <Cell
                key={slice.name}
                fill={slice.color ?? PIE_PALETTE[index % PIE_PALETTE.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-white">
            {centerLabel}
          </span>
          {centerSublabel && (
            <span className="label-caps mt-1">{centerSublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function PieLegend({ data }: { data: PieSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <ul className="space-y-2.5">
      {data.map((slice, index) => (
        <li
          key={slice.name}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  slice.color ?? PIE_PALETTE[index % PIE_PALETTE.length],
              }}
            />
            <span className="truncate text-zinc-300">{slice.name}</span>
          </span>
          <span className="shrink-0 font-mono text-xs text-zinc-400">
            {formatCompact(slice.value)}
            <span className="ml-2 text-zinc-600">
              {total > 0 ? `${((slice.value / total) * 100).toFixed(1)}%` : "—"}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
