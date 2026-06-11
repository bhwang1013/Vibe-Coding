"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  ChevronRight,
  Flag,
  Landmark,
  PiggyBank,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { KpiCard } from "@/components/ui/KpiCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IncomePie, PieLegend } from "@/components/charts/IncomePie";
import { HorizontalBars } from "@/components/charts/HorizontalBars";
import { CATEGORY_COLORS, TAG_COLORS } from "@/components/charts/chartTheme";
import {
  allExpenseItems,
  deployedCapital,
  expenseProfileFor,
  groupTotal,
  incomeByCategory,
  levelCashFlow,
  levelExpenses,
  levelIncome,
  nextLevel,
  plan,
  savingsRate,
  sourceNet,
} from "@/lib/finance";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";

export function LevelDetail({ levelId }: { levelId: number }) {
  const level = plan.levels.find((l) => l.id === levelId) ?? plan.levels[0];
  const next = nextLevel(level);
  const prev = plan.levels.find((l) => l.id === level.id - 1);

  const income = levelIncome(level);
  const expenses = levelExpenses(level);
  const cashFlow = levelCashFlow(level);
  const rate = savingsRate(level);
  const capital = deployedCapital(level);
  const profile = expenseProfileFor(level);
  const isCurrent = level.id === plan.profile.currentLevelId;

  const categories = incomeByCategory(level);
  const pieData = [
    { name: "Trading", value: categories.trading, color: CATEGORY_COLORS.trading },
    { name: "Business", value: categories.business, color: CATEGORY_COLORS.business },
    { name: "Passive", value: categories.passive, color: CATEGORY_COLORS.passive },
  ].filter((slice) => slice.value > 0);

  const sourceBars = [...level.incomeSources]
    .sort((a, b) => sourceNet(b) - sourceNet(a))
    .map((source) => ({
      name: source.count > 1 ? `${source.name} (×${source.count})` : source.name,
      value: sourceNet(source),
      color: CATEGORY_COLORS[source.category],
      meta: formatPercent(sourceNet(source) / income, 1),
    }));

  const expenseBars = [...allExpenseItems(level)]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      value: item.amount,
      color: TAG_COLORS[item.tag],
      meta: formatPercent(item.amount / income, 1),
    }));

  return (
    <div>
      <Link
        href="/roadmap"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-300"
      >
        <ArrowLeft size={13} />
        Back to roadmap
      </Link>

      <PageHeader
        eyebrow={`Level Brief ${isCurrent ? "· Current Position" : ""}`}
        title={`${level.name} · ${level.codename}`}
        description={level.tagline}
      >
        <div className="flex gap-2">
          {prev && (
            <Link
              href={`/levels/${prev.id}`}
              className="rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              ← L{prev.id}
            </Link>
          )}
          {next && (
            <Link
              href={`/levels/${next.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              L{next.id} · {next.codename}
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Monthly Income"
          value={income}
          format={formatCurrency}
          icon={TrendingUp}
          sublabel={level.approxIncomeLabel}
          accent="emerald"
          delay={0}
        />
        <KpiCard
          label="Monthly Expenses"
          value={expenses}
          format={formatCurrency}
          icon={TrendingDown}
          sublabel={level.approxExpenseLabel}
          accent="gold"
          delay={1}
        />
        <KpiCard
          label="Monthly Banked"
          value={cashFlow}
          format={formatCurrency}
          icon={Banknote}
          sublabel={`${formatPercent(rate)} savings rate`}
          progress={rate}
          accent="emerald"
          delay={2}
        />
        <KpiCard
          label="Capital Deployed"
          value={capital}
          format={formatCompact}
          icon={Landmark}
          sublabel="Across personal + investment accounts"
          accent="neutral"
          delay={3}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Emergency Fund Target"
          value={level.emergencyFundTarget}
          format={formatCompact}
          icon={Shield}
          sublabel="12 months of expenses in reserve"
          accent="gold"
          delay={0}
        />
        <KpiCard
          label="Annual Savings Power"
          value={cashFlow * 12}
          format={formatCompact}
          icon={PiggyBank}
          sublabel={`Reserve target hit in ~${Math.max(1, Math.ceil(level.emergencyFundTarget / cashFlow))} months from zero`}
          accent="emerald"
          delay={1}
        />
      </div>

      {/* Lifestyle */}
      <GlassCard className="mt-4 p-6" delay={0}>
        <p className="label-caps mb-2 text-gold-400/90">Lifestyle</p>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-300">
          {level.lifestyle}
        </p>
      </GlassCard>

      {/* Income + Expenses */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GlassCard className="p-6" delay={0}>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            Income Sources
          </h2>
          <IncomePie
            data={pieData}
            centerLabel={formatCompact(income)}
            centerSublabel="net / month"
            height={210}
          />
          <PieLegend data={pieData} />
          <div className="mt-5 border-t border-white/[0.06] pt-5">
            <HorizontalBars data={sourceBars} />
          </div>
        </GlassCard>

        <GlassCard className="p-6" delay={1}>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Expense Breakdown
            </h2>
            <span className="text-xs text-zinc-500">Top 10 line items</span>
          </div>
          <HorizontalBars data={expenseBars} />
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-5">
            {profile.groups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3"
              >
                <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                  {group.label}
                </p>
                <p className="mt-1 font-display text-base font-semibold text-gold-300">
                  {formatCompact(groupTotal(group))}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Risks + next level requirements */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GlassCard className="p-6" delay={0}>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
            <AlertTriangle size={17} className="text-gold-400" />
            Major Risks
          </h2>
          <ul className="space-y-3">
            {level.risks.map((risk) => (
              <li
                key={risk}
                className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                {risk}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6" delay={1}>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
            <Flag size={17} className="text-emerald-400" />
            {next ? `Requirements → ${next.name}` : "Endgame Mandate"}
          </h2>
          <ul className="space-y-3">
            {level.milestoneRequirements.map((req, index) => (
              <li
                key={req}
                className="flex items-start gap-3 rounded-xl border border-emerald-500/[0.12] bg-emerald-500/[0.04] px-4 py-3 text-sm text-zinc-200"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                  {index + 1}
                </span>
                {req}
              </li>
            ))}
          </ul>
          {next && (
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-1.5 flex justify-between text-xs text-zinc-500">
                <span>Income runway to {next.name}</span>
                <span className="font-mono">
                  {formatCompact(income)} / {formatCompact(levelIncome(next))}
                </span>
              </div>
              <ProgressBar progress={income / levelIncome(next)} variant="gold" />
              <Link
                href={`/levels/${next.id}`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 transition hover:text-emerald-200"
              >
                Preview {next.name} · {next.codename}
                <ChevronRight size={13} />
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
