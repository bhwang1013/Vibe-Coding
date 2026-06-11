"use client";

import { motion } from "framer-motion";
import { Check, Flag, MapPin, Rocket } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { KpiCard } from "@/components/ui/KpiCard";
import { NetWorthProjection } from "@/components/charts/NetWorthProjection";
import {
  currentLevel,
  levelCashFlow,
  monthsToTarget,
  nextMilestone,
  plan,
  prevMilestoneValue,
  projectNetWorth,
} from "@/lib/finance";
import {
  formatCompact,
  formatCurrency,
  formatMonths,
  formatPercent,
} from "@/lib/format";

export default function NetWorthPage() {
  const level = currentLevel();
  const cashFlow = levelCashFlow(level);
  const { currentNetWorth, assumedAnnualReturn, financialFreedomTarget } =
    plan.profile;

  const milestone = nextMilestone(currentNetWorth);
  const floor = prevMilestoneValue(currentNetWorth);
  const segmentProgress = milestone
    ? (currentNetWorth - floor) / (milestone.value - floor)
    : 1;

  const finalMilestone = plan.milestones[plan.milestones.length - 1];
  const overallProgress = Math.min(1, currentNetWorth / finalMilestone.value);

  const projection = projectNetWorth(
    currentNetWorth,
    cashFlow,
    assumedAnnualReturn,
    144,
    3,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Capital Campaign"
        title="Net Worth Tracker"
        description={`Marching from ${formatCompact(currentNetWorth)} to ${finalMilestone.label} at ${formatCurrency(cashFlow)}/month of banked cash flow.`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Current Position"
          value={currentNetWorth}
          format={formatCompact}
          icon={MapPin}
          sublabel={`${formatPercent(overallProgress, 1)} of the ${finalMilestone.label} campaign`}
          accent="emerald"
          delay={0}
        />
        <KpiCard
          label="Next Milestone"
          value={milestone ? milestone.value : finalMilestone.value}
          format={formatCompact}
          icon={Flag}
          sublabel={
            milestone
              ? `${formatCompact(milestone.value - currentNetWorth)} remaining · ETA ${formatMonths(
                  monthsToTarget(
                    currentNetWorth,
                    milestone.value,
                    cashFlow,
                    assumedAnnualReturn,
                  ),
                )}`
              : "Campaign complete"
          }
          progress={segmentProgress}
          accent="gold"
          delay={1}
        />
        <KpiCard
          label="Freedom Target"
          value={financialFreedomTarget}
          format={formatCompact}
          icon={Rocket}
          sublabel={`ETA ${formatMonths(
            monthsToTarget(
              currentNetWorth,
              financialFreedomTarget,
              cashFlow,
              assumedAnnualReturn,
            ),
          )} at current run rate`}
          progress={currentNetWorth / financialFreedomTarget}
          accent="emerald"
          delay={2}
        />
      </div>

      {/* Milestone timeline */}
      <GlassCard className="mt-6 p-6 sm:p-8" delay={0} hover={false}>
        <h2 className="mb-8 font-display text-lg font-semibold text-white">
          Milestone Timeline
        </h2>
        <div className="relative">
          {/* Track */}
          <div className="absolute left-0 right-0 top-[18px] h-1 rounded-full bg-white/[0.06]" />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${overallProgress * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-[18px] h-1 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-gold-400"
          />
          <div className="relative flex justify-between">
            {plan.milestones.map((m, index) => {
              const reached = currentNetWorth >= m.value;
              const isNext = milestone?.value === m.value;
              const eta = monthsToTarget(
                currentNetWorth,
                m.value,
                cashFlow,
                assumedAnnualReturn,
              );
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="flex flex-col items-center"
                >
                  <span
                    className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${
                      reached
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : isNext
                          ? "border-gold-400 bg-gold-500/15 text-gold-300 shadow-glow-gold"
                          : "border-white/15 bg-charcoal text-zinc-600"
                    }`}
                  >
                    {reached ? (
                      <Check size={15} />
                    ) : (
                      <span className="text-[10px] font-bold">{index + 1}</span>
                    )}
                  </span>
                  <span
                    className={`mt-2.5 font-display text-xs font-semibold sm:text-sm ${
                      reached
                        ? "text-emerald-300"
                        : isNext
                          ? "text-gold-300"
                          : "text-zinc-600"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="mt-0.5 hidden text-[10px] text-zinc-600 sm:block">
                    {reached ? "Secured" : formatMonths(eta)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {milestone && (
          <div className="mt-9 rounded-xl border border-gold-500/20 bg-gold-500/[0.05] p-4 text-sm text-zinc-300">
            <span className="font-semibold text-gold-300">
              Next objective: {milestone.label}.
            </span>{" "}
            {formatCompact(milestone.value - currentNetWorth)} to go — roughly{" "}
            {formatMonths(
              monthsToTarget(
                currentNetWorth,
                milestone.value,
                cashFlow,
                assumedAnnualReturn,
              ),
            )}{" "}
            at the current {formatCurrency(cashFlow)}/month savings pace.
          </div>
        )}
      </GlassCard>

      {/* Projection */}
      <GlassCard className="mt-4 p-6" delay={1} hover={false}>
        <h2 className="mb-1 font-display text-lg font-semibold text-white">
          12-Year Projection
        </h2>
        <p className="mb-4 text-xs text-zinc-500">
          Banked cash flow compounding at{" "}
          {formatPercent(assumedAnnualReturn)} annually — milestone lines in
          gold
        </p>
        <NetWorthProjection
          data={projection}
          milestones={plan.milestones}
          height={340}
        />
      </GlassCard>
    </div>
  );
}
