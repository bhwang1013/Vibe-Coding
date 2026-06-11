"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/components/charts/chartTheme";
import type { RiskMetric } from "@/lib/finance";

export function RiskRadar({
  metrics,
  height = 300,
}: {
  metrics: RiskMetric[];
  height?: number;
}) {
  const data = metrics.map((m) => ({
    risk: m.name.replace(" Dependency", "").replace(" Inflation", ""),
    score: m.score,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="risk"
          tick={{ fill: "#a1a1aa", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [`${value} / 100`, "Risk Score"]}
        />
        <Radar
          dataKey="score"
          stroke={CHART_COLORS.gold}
          fill={CHART_COLORS.gold}
          fillOpacity={0.22}
          strokeWidth={2}
          animationDuration={900}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
