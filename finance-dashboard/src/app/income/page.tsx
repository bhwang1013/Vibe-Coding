"use client";

import { useMemo, useState } from "react";
import { Briefcase, CandlestickChart, Leaf } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { LevelSwitcher } from "@/components/ui/LevelSwitcher";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { IncomePie, PieLegend } from "@/components/charts/IncomePie";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import {
  CATEGORY_COLORS,
  CHART_COLORS,
} from "@/components/charts/chartTheme";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TOOLTIP_STYLE } from "@/components/charts/chartTheme";
import type { IncomeCategory } from "@/lib/types";
import {
  incomeByCategory,
  levelIncome,
  plan,
  sourceGross,
  sourceNet,
} from "@/lib/finance";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";

const CATEGORY_META: Record<
  IncomeCategory,
  { label: string; icon: React.ReactNode; blurb: string }
> = {
  trading: {
    label: "Trading",
    icon: <CandlestickChart size={16} className="text-emerald-400" />,
    blurb: "Schwab · E*Trade · Fidelity · IBKR · Oanda · Forex.com · Tradovate · NinjaTrader · Apex · Crypto",
  },
  business: {
    label: "Business",
    icon: <Briefcase size={16} className="text-gold-400" />,
    blurb: "Money Muscle Mindset membership",
  },
  passive: {
    label: "Passive",
    icon: <Leaf size={16} className="text-sky-400" />,
    blurb: "ETFs · HYSAs · investment accounts",
  },
};

export default function IncomePage() {
  const [levelId, setLevelId] = useState(plan.profile.currentLevelId);
  const level = plan.levels.find((l) => l.id === levelId) ?? plan.levels[0];
  const total = levelIncome(level);
  const categories = incomeByCategory(level);

  const pieData = (Object.keys(CATEGORY_META) as IncomeCategory[])
    .map((category) => ({
      name: CATEGORY_META[category].label,
      value: categories[category],
      color: CATEGORY_COLORS[category],
    }))
    .filter((slice) => slice.value > 0);

  const sourceBars = useMemo(
    () =>
      [...level.incomeSources]
        .sort((a, b) => sourceNet(b) - sourceNet(a))
        .map((source) => ({
          name: source.count > 1 ? `${source.name} (×${source.count})` : source.name,
          value: sourceNet(source),
          color: CATEGORY_COLORS[source.category],
          meta: formatPercent(sourceNet(source) / total, 1),
        })),
    [level, total],
  );

  const growthData = plan.levels.map((l) => {
    const byCat = incomeByCategory(l);
    return {
      name: `L${l.id}`,
      Trading: Math.round(byCat.trading),
      Business: Math.round(byCat.business),
      Passive: Math.round(byCat.passive),
    };
  });

  return (
    <div>
      <PageHeader
        eyebrow="Revenue Machine"
        title="Income Engine"
        description="Every stream, net of fees and taxes (gross × efficiency × retention). Switch levels to see how the machine scales."
      >
        <LevelSwitcher selected={levelId} onSelect={setLevelId} />
      </PageHeader>

      {/* Category summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(Object.keys(CATEGORY_META) as IncomeCategory[]).map(
          (category, index) => {
            const meta = CATEGORY_META[category];
            const value = categories[category];
            return (
              <GlassCard key={category} delay={index} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                    {meta.icon}
                    {meta.label}
                  </p>
                  <span className="font-mono text-xs text-zinc-500">
                    {total > 0 ? formatPercent(value / total, 1) : "—"}
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  <AnimatedNumber value={value} format={formatCurrency} />
                </p>
                <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                  {meta.blurb}
                </p>
              </GlassCard>
            );
          },
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Pie */}
        <GlassCard className="p-6 xl:col-span-2" delay={0}>
          <h2 className="font-display text-lg font-semibold text-white">
            Category Mix · {level.name}
          </h2>
          <IncomePie
            data={pieData}
            centerLabel={formatCompact(total)}
            centerSublabel="net / month"
            height={250}
          />
          <PieLegend data={pieData} />
        </GlassCard>

        {/* Source bars */}
        <GlassCard className="p-6 xl:col-span-3" delay={1}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Stream Contributions
            </h2>
            <span className="text-xs text-zinc-500">
              {level.incomeSources.length} streams
            </span>
          </div>
          <HorizontalBars data={sourceBars} />
        </GlassCard>
      </div>

      {/* Growth across levels */}
      <GlassCard className="mt-4 p-6" delay={0}>
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold text-white">
            Engine Growth · Level 0 → Level 6
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Stacked net income by category at every level
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={growthData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              {(
                [
                  ["gradTrading", CATEGORY_COLORS.trading],
                  ["gradBusiness", CATEGORY_COLORS.business],
                  ["gradPassive", CATEGORY_COLORS.passive],
                ] as const
              ).map(([id, color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.04} />
                </linearGradient>
              ))}
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
              dataKey="Trading"
              stackId="1"
              stroke={CATEGORY_COLORS.trading}
              fill="url(#gradTrading)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Business"
              stackId="1"
              stroke={CATEGORY_COLORS.business}
              fill="url(#gradBusiness)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Passive"
              stackId="1"
              stroke={CATEGORY_COLORS.passive}
              fill="url(#gradPassive)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Detailed table */}
      <GlassCard className="mt-4 overflow-x-auto p-6" delay={1}>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">
          Stream Detail · {level.name}
        </h2>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="label-caps border-b border-white/[0.06]">
              <th className="pb-3 pr-4 font-medium">Stream</th>
              <th className="pb-3 pr-4 font-medium">Cadence</th>
              <th className="pb-3 pr-4 text-right font-medium">Gross</th>
              <th className="pb-3 pr-4 text-right font-medium">Net</th>
              <th className="pb-3 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody>
            {level.incomeSources.map((source) => (
              <tr
                key={source.id}
                className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
              >
                <td className="py-3.5 pr-4">
                  <span className="font-medium text-zinc-200">
                    {source.name}
                  </span>
                  {source.count > 1 && (
                    <span className="ml-2 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-400">
                      ×{source.count}
                    </span>
                  )}
                </td>
                <td className="max-w-[260px] truncate py-3.5 pr-4 text-xs text-zinc-500">
                  {source.cadence}
                </td>
                <td className="py-3.5 pr-4 text-right font-mono text-xs text-zinc-400">
                  {formatCurrency(sourceGross(source))}
                </td>
                <td className="py-3.5 pr-4 text-right font-mono text-xs text-emerald-300">
                  {formatCurrency(sourceNet(source))}
                </td>
                <td className="py-3.5 text-right font-mono text-xs text-zinc-400">
                  {formatPercent(sourceNet(source) / total, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
