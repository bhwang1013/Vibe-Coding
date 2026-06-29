"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { LevelSwitcher } from "@/components/ui/LevelSwitcher";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiskRadar } from "@/components/charts/RiskRadar";
import { overallRiskScore, plan, riskMetricsFor } from "@/lib/finance";

function riskTone(score: number): {
  label: string;
  text: string;
  bg: string;
  heat: string;
} {
  if (score >= 70)
    return {
      label: "Critical",
      text: "text-red-300",
      bg: "bg-red-500/15",
      heat: "rgba(248,113,113,0.55)",
    };
  if (score >= 50)
    return {
      label: "Elevated",
      text: "text-gold-300",
      bg: "bg-gold-500/15",
      heat: "rgba(212,175,55,0.45)",
    };
  if (score >= 30)
    return {
      label: "Moderate",
      text: "text-amber-200",
      bg: "bg-amber-500/10",
      heat: "rgba(251,191,36,0.28)",
    };
  return {
    label: "Controlled",
    text: "text-emerald-300",
    bg: "bg-emerald-500/15",
    heat: "rgba(16,185,129,0.3)",
  };
}

export default function RiskPage() {
  const [levelId, setLevelId] = useState(plan.profile.currentLevelId);
  const level = plan.levels.find((l) => l.id === levelId) ?? plan.levels[0];
  const metrics = riskMetricsFor(level);
  const overall = overallRiskScore(level);
  const overallTone = riskTone(overall);

  const riskNames = riskMetricsFor(plan.levels[0]).map((m) => m.name);

  return (
    <div>
      <PageHeader
        eyebrow="Threat Matrix"
        title="Risk Analysis"
        description="Structural risk scores computed from the income and expense data — concentration, lifestyle inflation, and dependency exposure at every level."
      >
        <LevelSwitcher selected={levelId} onSelect={setLevelId} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Radar + overall */}
        <GlassCard className="p-6 xl:col-span-2" delay={0}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Risk Surface · {level.name}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${overallTone.bg} ${overallTone.text}`}
            >
              {overall}/100 · {overallTone.label}
            </span>
          </div>
          <RiskRadar metrics={metrics} height={290} />
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldAlert size={13} className="text-gold-400" />
            Composite score across five structural risk vectors
          </p>
        </GlassCard>

        {/* Metric breakdown */}
        <div className="space-y-4 xl:col-span-3">
          {metrics.map((metric, index) => {
            const tone = riskTone(metric.score);
            return (
              <GlassCard key={metric.id} className="p-5" delay={index}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {metric.name} Risk
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone.bg} ${tone.text}`}
                  >
                    {metric.score}/100 · {tone.label}
                  </span>
                </div>
                <ProgressBar
                  progress={metric.score / 100}
                  variant={
                    metric.score >= 50
                      ? "gold"
                      : metric.score >= 30
                        ? "neutral"
                        : "emerald"
                  }
                  className="mt-3"
                />
                <p className="mt-3 text-[13px] text-zinc-400">{metric.detail}</p>
                <p className="mt-2 flex items-start gap-2 text-[13px] leading-snug text-zinc-300">
                  <Lightbulb
                    size={14}
                    className="mt-0.5 shrink-0 text-gold-400"
                  />
                  {metric.recommendation}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Heat map */}
      <GlassCard className="mt-4 overflow-x-auto p-6" delay={0}>
        <h2 className="mb-1 font-display text-lg font-semibold text-white">
          Risk Heat Map · All Levels
        </h2>
        <p className="mb-5 text-xs text-zinc-500">
          How each structural risk evolves as the machine scales from L0 to L6
        </p>
        <div className="min-w-[640px]">
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `180px repeat(${plan.levels.length}, 1fr)`,
            }}
          >
            <div />
            {plan.levels.map((l) => (
              <div
                key={l.id}
                className={`pb-2 text-center text-xs font-semibold ${
                  l.id === levelId ? "text-emerald-300" : "text-zinc-500"
                }`}
              >
                L{l.id}
              </div>
            ))}
            {riskNames.map((name, rowIndex) => (
              <RowCells
                key={name}
                name={name}
                rowIndex={rowIndex}
                selectedLevelId={levelId}
                onSelect={setLevelId}
              />
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] text-zinc-500">
          {[15, 40, 60, 85].map((score) => {
            const tone = riskTone(score);
            return (
              <span key={score} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: tone.heat }}
                />
                {tone.label}
              </span>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function RowCells({
  name,
  rowIndex,
  selectedLevelId,
  onSelect,
}: {
  name: string;
  rowIndex: number;
  selectedLevelId: number;
  onSelect: (levelId: number) => void;
}) {
  return (
    <>
      <div className="flex items-center pr-3 text-xs text-zinc-400">{name}</div>
      {plan.levels.map((l, colIndex) => {
        const score = riskMetricsFor(l)[rowIndex].score;
        const tone = riskTone(score);
        return (
          <motion.button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (rowIndex * 7 + colIndex) * 0.02 }}
            whileHover={{ scale: 1.06 }}
            className={`flex h-11 items-center justify-center rounded-lg font-mono text-xs font-semibold text-white/90 transition ${
              l.id === selectedLevelId ? "ring-1 ring-emerald-400/60" : ""
            }`}
            style={{ backgroundColor: tone.heat }}
            title={`${name} at L${l.id}: ${score}/100`}
          >
            {score}
          </motion.button>
        );
      })}
    </>
  );
}
