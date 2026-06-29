"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarClock,
  Gem,
  RotateCcw,
  Shield,
  Timer,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { LevelSwitcher } from "@/components/ui/LevelSwitcher";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { NetWorthProjection } from "@/components/charts/NetWorthProjection";
import {
  levelExpenses,
  monthsToTarget,
  plan,
  projectNetWorth,
  sourceGross,
} from "@/lib/finance";
import {
  formatCompact,
  formatCurrency,
  formatMonths,
  formatPercent,
} from "@/lib/format";

const BASE_WIN_RATE = 0.6;
const BASE_TAX_RATE = 0.4;

interface Scenario {
  winRate: number;
  tradingBoost: number;
  taxRate: number;
  membershipGrowth: number;
  expenseFactor: number;
  savingsRate: number;
}

const DEFAULT_SCENARIO: Scenario = {
  winRate: BASE_WIN_RATE,
  tradingBoost: 1,
  taxRate: BASE_TAX_RATE,
  membershipGrowth: 1,
  expenseFactor: 1,
  savingsRate: 1,
};

export default function SimulatorPage() {
  const [levelId, setLevelId] = useState(plan.profile.currentLevelId);
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const level = plan.levels.find((l) => l.id === levelId) ?? plan.levels[0];

  const results = useMemo(() => {
    const retention = 1 - scenario.taxRate;

    let monthlyNet = 0;
    for (const source of level.incomeSources) {
      let gross = sourceGross(source) * source.efficiency;
      if (source.category === "trading") {
        gross *= (scenario.winRate / BASE_WIN_RATE) * scenario.tradingBoost;
      } else if (source.category === "business") {
        gross *= scenario.membershipGrowth;
      }
      monthlyNet += gross * retention;
    }

    const expenses = levelExpenses(level) * scenario.expenseFactor;
    const rawCashFlow = monthlyNet - expenses;
    const banked = rawCashFlow > 0 ? rawCashFlow * scenario.savingsRate : rawCashFlow;

    const { currentNetWorth, currentEmergencyFund, assumedAnnualReturn } =
      plan.profile;
    const monthsTo1M = monthsToTarget(
      currentNetWorth,
      1_000_000,
      banked,
      assumedAnnualReturn,
    );
    const monthsTo10M = monthsToTarget(
      currentNetWorth,
      10_000_000,
      banked,
      assumedAnnualReturn,
    );
    const efMonths = expenses > 0 ? currentEmergencyFund / expenses : Infinity;
    const projection = projectNetWorth(
      currentNetWorth,
      banked,
      assumedAnnualReturn,
      120,
      3,
    );

    return {
      monthlyNet,
      expenses,
      banked,
      monthsTo1M,
      monthsTo10M,
      efMonths,
      projection,
    };
  }, [level, scenario]);

  const update = (key: keyof Scenario) => (value: number) =>
    setScenario((s) => ({ ...s, [key]: value }));

  return (
    <div>
      <PageHeader
        eyebrow="War Gaming"
        title="Scenario Simulator"
        description="Stress-test the machine. Drag the levers and watch cash flow, wealth timelines and reserve coverage recalculate live."
      >
        <LevelSwitcher selected={levelId} onSelect={setLevelId} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Controls */}
        <GlassCard className="p-6 xl:col-span-2" hover={false}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Levers
            </h2>
            <button
              type="button"
              onClick={() => setScenario(DEFAULT_SCENARIO)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          <div className="space-y-6">
            <Slider
              label="Win Rate"
              value={scenario.winRate}
              min={0.3}
              max={0.9}
              step={0.01}
              format={(v) => formatPercent(v)}
              baseline={`baseline ${formatPercent(BASE_WIN_RATE)}`}
              onChange={update("winRate")}
            />
            <Slider
              label="Trading Income Multiplier"
              value={scenario.tradingBoost}
              min={0.25}
              max={2}
              step={0.05}
              format={(v) => `${v.toFixed(2)}×`}
              baseline="baseline 1.00×"
              onChange={update("tradingBoost")}
            />
            <Slider
              label="Effective Tax Rate"
              value={scenario.taxRate}
              min={0.2}
              max={0.55}
              step={0.01}
              format={(v) => formatPercent(v)}
              baseline={`baseline ${formatPercent(BASE_TAX_RATE)}`}
              onChange={update("taxRate")}
            />
            <Slider
              label="Membership Growth"
              value={scenario.membershipGrowth}
              min={0}
              max={5}
              step={0.1}
              format={(v) => `${v.toFixed(1)}×`}
              baseline="baseline 1.0× current members"
              onChange={update("membershipGrowth")}
            />
            <Slider
              label="Expense Level"
              value={scenario.expenseFactor}
              min={0.5}
              max={1.5}
              step={0.01}
              format={(v) => formatPercent(v)}
              baseline="baseline 100% of plan"
              onChange={update("expenseFactor")}
            />
            <Slider
              label="Savings Rate (of surplus)"
              value={scenario.savingsRate}
              min={0.4}
              max={1}
              step={0.01}
              format={(v) => formatPercent(v)}
              baseline="share of surplus actually banked"
              onChange={update("savingsRate")}
            />
          </div>
        </GlassCard>

        {/* Outputs */}
        <div className="space-y-4 xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ResultCard
              icon={<Banknote size={16} className="text-emerald-400" />}
              label="Net Monthly Cash Flow"
              value={results.banked}
              format={formatCurrency}
              negative={results.banked < 0}
            />
            <ResultCard
              icon={<CalendarClock size={16} className="text-emerald-400" />}
              label="Net Annual Cash Flow"
              value={results.banked * 12}
              format={formatCompact}
              negative={results.banked < 0}
            />
            <ResultCard
              icon={<Timer size={16} className="text-gold-400" />}
              label="Time to $1M Net Worth"
              value={results.monthsTo1M}
              format={formatMonths}
              isTime
            />
            <ResultCard
              icon={<Gem size={16} className="text-gold-400" />}
              label="Time to $10M Net Worth"
              value={results.monthsTo10M}
              format={formatMonths}
              isTime
            />
          </div>

          <GlassCard className="p-5" hover={false}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <Shield size={15} className="text-emerald-400" />
                Emergency Fund Status
              </p>
              <p className="text-xs text-zinc-500">
                {formatCompact(plan.profile.currentEmergencyFund)} reserve ÷{" "}
                {formatCurrency(results.expenses)} adjusted burn
              </p>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="font-display text-2xl font-semibold text-white">
                {Number.isFinite(results.efMonths)
                  ? `${results.efMonths.toFixed(1)} months covered`
                  : "Fully covered"}
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  results.efMonths >= 12
                    ? "bg-emerald-500/15 text-emerald-300"
                    : results.efMonths >= 6
                      ? "bg-gold-500/15 text-gold-300"
                      : "bg-red-500/15 text-red-300"
                }`}
              >
                {results.efMonths >= 12
                  ? "Fortress"
                  : results.efMonths >= 6
                    ? "Building"
                    : "Exposed"}
              </span>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="mb-1 font-display text-lg font-semibold text-white">
              10-Year Net Worth Projection
            </h3>
            <p className="mb-4 text-xs text-zinc-500">
              Compounding at {formatPercent(plan.profile.assumedAnnualReturn)}{" "}
              annually on banked capital
            </p>
            <NetWorthProjection
              data={results.projection}
              milestones={plan.milestones}
              height={280}
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  baseline,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  baseline: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <span className="font-mono text-sm font-semibold text-emerald-300">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="mt-1.5 text-[11px] text-zinc-600">{baseline}</p>
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  format,
  negative = false,
  isTime = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  format: (value: number) => string;
  negative?: boolean;
  isTime?: boolean;
}) {
  return (
    <GlassCard className="p-5" hover={false}>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {icon}
        {label}
      </p>
      <p
        className={`mt-2.5 font-display text-2xl font-semibold ${
          negative ? "text-red-400" : "text-white"
        }`}
      >
        {isTime ? (
          format(value)
        ) : (
          <AnimatedNumber value={value} format={format} duration={0.5} />
        )}
      </p>
    </GlassCard>
  );
}
