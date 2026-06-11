"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { LevelSwitcher } from "@/components/ui/LevelSwitcher";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { IncomePie, PieLegend } from "@/components/charts/IncomePie";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { TAG_COLORS } from "@/components/charts/chartTheme";
import type { ExpenseTag } from "@/lib/types";
import {
  allExpenseItems,
  expenseProfileFor,
  expensesByTag,
  groupTotal,
  levelExpenses,
  levelIncome,
  plan,
} from "@/lib/finance";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";

const TAG_LABELS: Record<ExpenseTag, string> = {
  essential: "Essential",
  luxury: "Luxury",
  travel: "Travel",
  business: "Business",
  charity: "Charity",
  special: "Special",
};

type ViewMode = "monthly" | "annual";

export default function ExpensesPage() {
  const [levelId, setLevelId] = useState(plan.profile.currentLevelId);
  const [view, setView] = useState<ViewMode>("monthly");
  const level = plan.levels.find((l) => l.id === levelId) ?? plan.levels[0];

  const multiplier = view === "annual" ? 12 : 1;
  const income = levelIncome(level) * multiplier;
  const total = levelExpenses(level) * multiplier;
  const byTag = expensesByTag(level);
  const profile = expenseProfileFor(level);

  const pieData = (Object.keys(TAG_LABELS) as ExpenseTag[])
    .map((tag) => ({
      name: TAG_LABELS[tag],
      value: byTag[tag] * multiplier,
      color: TAG_COLORS[tag],
    }))
    .filter((slice) => slice.value > 0);

  const itemBars = useMemo(
    () =>
      [...allExpenseItems(level)]
        .sort((a, b) => b.amount - a.amount)
        .map((item) => ({
          name: item.name,
          value: item.amount * multiplier,
          color: TAG_COLORS[item.tag],
          meta: formatPercent((item.amount * multiplier) / income, 1),
        })),
    [level, multiplier, income],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Burn Control"
        title="Expense Engine"
        description={`${profile.label} · ${formatPercent(total / income)} of net income consumed at ${level.name}.`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
            {(["monthly", "annual"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                  view === mode
                    ? "bg-gradient-to-r from-gold-500 to-gold-400 text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <LevelSwitcher selected={levelId} onSelect={setLevelId} />
        </div>
      </PageHeader>

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="p-5" delay={0}>
          <p className="label-caps">Total {view} burn</p>
          <p className="mt-2 font-display text-2xl font-semibold text-white">
            <AnimatedNumber value={total} format={formatCurrency} />
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={1}>
          <p className="label-caps">% of net income</p>
          <p className="mt-2 font-display text-2xl font-semibold text-gold-300">
            <AnimatedNumber
              value={total / income}
              format={(v) => formatPercent(v, 1)}
            />
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={2}>
          <p className="label-caps">Surplus after burn</p>
          <p className="mt-2 font-display text-2xl font-semibold text-emerald-300">
            <AnimatedNumber value={income - total} format={formatCurrency} />
          </p>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <GlassCard className="p-6 xl:col-span-2" delay={0}>
          <h2 className="font-display text-lg font-semibold text-white">
            Spend by Category
          </h2>
          <IncomePie
            data={pieData}
            centerLabel={formatCompact(total)}
            centerSublabel={view}
            height={250}
          />
          <PieLegend data={pieData} />
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-3" delay={1}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Line Items · Ranked
            </h2>
            <span className="text-xs text-zinc-500">
              {itemBars.length} items · % of income
            </span>
          </div>
          <div className="max-h-[430px] overflow-y-auto pr-2">
            <HorizontalBars data={itemBars} />
          </div>
        </GlassCard>
      </div>

      {/* Groups breakdown */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {profile.groups.map((group, index) => {
          const groupSum = groupTotal(group) * multiplier;
          return (
            <GlassCard key={group.id} className="p-5" delay={index}>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-zinc-200">
                  {group.label}
                </h3>
                <span className="font-mono text-xs text-gold-300">
                  {formatCompact(groupSum)}
                </span>
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: TAG_COLORS[item.tag] }}
                      />
                      <span className="truncate text-zinc-400">
                        {item.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">
                      {formatCurrency(item.amount * multiplier)}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
