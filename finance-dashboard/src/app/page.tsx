"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Crown,
  Gauge,
  PiggyBank,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LevelTrajectory } from "@/components/charts/LevelTrajectory";
import { IncomePie, PieLegend } from "@/components/charts/IncomePie";
import { CATEGORY_COLORS } from "@/components/charts/chartTheme";
import {
  currentLevel,
  incomeByCategory,
  levelCashFlow,
  levelExpenses,
  levelIncome,
  nextLevel,
  nextMilestone,
  plan,
  prevMilestoneValue,
  savingsRate,
} from "@/lib/finance";
import { formatCompact, formatCurrency, formatPercent } from "@/lib/format";

export default function DashboardPage() {
  const level = currentLevel();
  const next = nextLevel(level);
  const income = levelIncome(level);
  const expenses = levelExpenses(level);
  const cashFlow = levelCashFlow(level);
  const rate = savingsRate(level);

  const { currentNetWorth, currentEmergencyFund, financialFreedomTarget } =
    plan.profile;
  const efProgress = currentEmergencyFund / level.emergencyFundTarget;
  const freedomProgress = currentNetWorth / financialFreedomTarget;

  const milestone = nextMilestone(currentNetWorth);
  const milestoneFloor = prevMilestoneValue(currentNetWorth);
  const milestoneProgress = milestone
    ? (currentNetWorth - milestoneFloor) / (milestone.value - milestoneFloor)
    : 1;

  const categories = incomeByCategory(level);
  const pieData = [
    { name: "Trading", value: categories.trading, color: CATEGORY_COLORS.trading },
    { name: "Business", value: categories.business, color: CATEGORY_COLORS.business },
    { name: "Passive", value: categories.passive, color: CATEGORY_COLORS.passive },
  ].filter((slice) => slice.value > 0);

  return (
    <div>
      <PageHeader
        eyebrow="Command Center"
        title="Wealth Operating System"
        description={`Operating at ${level.name} · ${level.codename}. ${level.tagline}`}
      >
        <Link
          href={`/levels/${level.id}`}
          className="group inline-flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-sm font-semibold text-gold-300 transition hover:bg-gold-500/20"
        >
          <Crown size={15} />
          {level.name} · {level.codename}
          <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
        </Link>
      </PageHeader>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Monthly Income"
          value={income}
          format={formatCurrency}
          icon={TrendingUp}
          sublabel={`${level.incomeSources.length} income streams · net of fees + taxes`}
          accent="emerald"
          delay={0}
        />
        <KpiCard
          label="Monthly Expenses"
          value={expenses}
          format={formatCurrency}
          icon={TrendingDown}
          sublabel={`${formatPercent(expenses / income)} of net income`}
          accent="gold"
          delay={1}
        />
        <KpiCard
          label="Monthly Cash Flow"
          value={cashFlow}
          format={formatCurrency}
          icon={Banknote}
          sublabel={`${formatPercent(rate)} savings rate`}
          accent="emerald"
          delay={2}
        />
        <KpiCard
          label="Annual Savings"
          value={cashFlow * 12}
          format={formatCompact}
          icon={PiggyBank}
          sublabel="Banked per year at current run rate"
          accent="emerald"
          delay={3}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Emergency Fund"
          value={currentEmergencyFund}
          format={formatCompact}
          icon={Shield}
          sublabel={`Target ${formatCompact(level.emergencyFundTarget)} · 12 months of burn`}
          progress={efProgress}
          accent={efProgress >= 1 ? "emerald" : "gold"}
          delay={0}
        />
        <KpiCard
          label="Net Worth"
          value={currentNetWorth}
          format={formatCompact}
          icon={Target}
          sublabel={
            milestone
              ? `Next milestone ${milestone.label} · ${formatCompact(milestone.value - currentNetWorth)} to go`
              : "All milestones cleared"
          }
          progress={milestoneProgress}
          accent="emerald"
          delay={1}
        />
        <KpiCard
          label="Financial Freedom"
          value={freedomProgress}
          format={(v) => formatPercent(v, 1)}
          icon={Gauge}
          sublabel={`Progress toward ${formatCompact(financialFreedomTarget)} target`}
          progress={freedomProgress}
          accent="gold"
          delay={2}
        />
      </div>

      {/* Charts row */}
      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <GlassCard className="p-6 xl:col-span-3" delay={0}>
          <div className="mb-5 flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">
                Trajectory · Level 0 → Level 6
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Net monthly income vs expenses at every level of the roadmap
              </p>
            </div>
            <Link
              href="/roadmap"
              className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              View roadmap →
            </Link>
          </div>
          <LevelTrajectory height={290} />
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2" delay={1}>
          <div className="mb-2">
            <h2 className="font-display text-lg font-semibold text-white">
              Income Mix · {level.name}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Net contribution by engine category
            </p>
          </div>
          <IncomePie
            data={pieData}
            centerLabel={formatCompact(income)}
            centerSublabel="per month"
            height={230}
          />
          <PieLegend data={pieData} />
        </GlassCard>
      </div>

      {/* Next level call-to-action */}
      {next && (
        <GlassCard className="mt-4 overflow-hidden p-6 sm:p-8" delay={2}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="label-caps mb-2 text-gold-400/90">Next Objective</p>
              <h2 className="font-display text-2xl font-semibold text-white">
                Unlock {next.name} · {next.codename}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {next.tagline} Income climbs from{" "}
                <span className="text-emerald-400">{formatCompact(income)}</span> to{" "}
                <span className="text-emerald-400">
                  {formatCompact(levelIncome(next))}
                </span>{" "}
                per month.
              </p>
              <ul className="mt-4 space-y-2">
                {level.milestoneRequirements.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center lg:w-64">
              <p className="label-caps mb-2">Cash flow at {next.name}</p>
              <p className="font-display text-3xl font-semibold text-gradient-emerald">
                <AnimatedNumber
                  value={levelCashFlow(next)}
                  format={formatCompact}
                />
              </p>
              <p className="mt-1 text-xs text-zinc-500">per month banked</p>
              <ProgressBar
                progress={income / levelIncome(next)}
                variant="gold"
                className="mt-4"
              />
              <p className="mt-2 text-[11px] text-zinc-500">
                Current income is {formatPercent(income / levelIncome(next))} of
                the {next.name} target
              </p>
              <Link
                href={`/levels/${next.id}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
              >
                View {next.name} brief
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
