"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/components/charts/chartTheme";
import type { ProjectionPoint } from "@/lib/finance";
import { formatCompact, formatCurrency } from "@/lib/format";

interface NetWorthProjectionProps {
  data: ProjectionPoint[];
  /** Milestone values to draw as horizontal reference lines */
  milestones?: { label: string; value: number }[];
  height?: number;
}

export function NetWorthProjection({
  data,
  milestones = [],
  height = 320,
}: NetWorthProjectionProps) {
  const max = data.length > 0 ? data[data.length - 1].netWorth : 0;
  const visibleMilestones = milestones.filter((m) => m.value <= max * 1.15);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.emerald} stopOpacity={0.4} />
            <stop offset="100%" stopColor={CHART_COLORS.emerald} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCompact(Number(value))}
          width={60}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [formatCurrency(Number(value)), "Net Worth"]}
        />
        {visibleMilestones.map((milestone) => (
          <ReferenceLine
            key={milestone.label}
            y={milestone.value}
            stroke={CHART_COLORS.gold}
            strokeDasharray="4 6"
            strokeOpacity={0.45}
            label={{
              value: milestone.label,
              position: "insideTopRight",
              fill: CHART_COLORS.goldLight,
              fontSize: 10,
            }}
          />
        ))}
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke={CHART_COLORS.emerald}
          strokeWidth={2.5}
          fill="url(#gradNetWorth)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
