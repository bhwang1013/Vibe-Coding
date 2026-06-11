"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE } from "@/components/charts/chartTheme";
import { levelCashFlow, levelExpenses, levelIncome, plan } from "@/lib/finance";
import { formatCompact, formatCurrency } from "@/lib/format";

/** Income vs expenses vs banked cash across all seven levels */
export function LevelTrajectory({ height = 300 }: { height?: number }) {
  const data = plan.levels.map((level) => ({
    name: `L${level.id}`,
    Income: Math.round(levelIncome(level)),
    Expenses: Math.round(levelExpenses(level)),
    "Cash Flow": Math.round(levelCashFlow(level)),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.emerald} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.emerald} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.gold} stopOpacity={0.3} />
            <stop offset="100%" stopColor={CHART_COLORS.gold} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="name"
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCompact(Number(value))}
          width={56}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => formatCurrency(Number(value))}
        />
        <Area
          type="monotone"
          dataKey="Income"
          stroke={CHART_COLORS.emerald}
          strokeWidth={2}
          fill="url(#gradIncome)"
          animationDuration={1100}
        />
        <Area
          type="monotone"
          dataKey="Expenses"
          stroke={CHART_COLORS.gold}
          strokeWidth={2}
          fill="url(#gradExpenses)"
          animationDuration={1100}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
