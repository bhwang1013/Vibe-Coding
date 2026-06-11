"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  Flag,
  Landmark,
  Shield,
} from "lucide-react";
import type { Level } from "@/lib/types";
import {
  deployedCapital,
  levelCashFlow,
  levelExpenses,
  levelIncome,
  plan,
  savingsRate,
} from "@/lib/finance";
import { formatCompact, formatPercent } from "@/lib/format";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface LevelCardProps {
  level: Level;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}

export function LevelCard({ level, expanded, onToggle, index }: LevelCardProps) {
  const income = levelIncome(level);
  const expenses = levelExpenses(level);
  const cashFlow = levelCashFlow(level);
  const rate = savingsRate(level);
  const capital = deployedCapital(level);
  const isCurrent = level.id === plan.profile.currentLevelId;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className={`glass overflow-hidden transition-colors duration-300 ${
        isCurrent
          ? "border-emerald-500/30 shadow-glow"
          : "hover:border-white/[0.14]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-display text-lg font-bold ${
                isCurrent
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-zinc-300"
              }`}
            >
              {level.id}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-white">
                  {level.name} · {level.codename}
                </h3>
                {isCurrent && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-zinc-500">{level.tagline}</p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-zinc-500"
          >
            <ChevronDown size={18} />
          </motion.span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Income" value={formatCompact(income)} tone="emerald" />
          <Stat label="Expenses" value={formatCompact(expenses)} tone="gold" />
          <Stat label="Savings" value={formatCompact(cashFlow)} tone="emerald" />
          <Stat
            label="Capital Req."
            value={capital > 0 ? formatCompact(capital) : "Prop-funded"}
            tone="neutral"
          />
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[11px] text-zinc-500">
            <span>Savings rate</span>
            <span className="font-mono">{formatPercent(rate)}</span>
          </div>
          <ProgressBar progress={rate} variant={rate > 0.5 ? "emerald" : "gold"} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-t border-white/[0.06] p-6 pt-5">
              <p className="text-sm leading-relaxed text-zinc-400">
                {level.lifestyle}
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <DetailList
                  icon={<Shield size={14} className="text-emerald-400" />}
                  title="Reserve Target"
                  items={[
                    `${formatCompact(level.emergencyFundTarget)} — 12 months of expenses`,
                    `${formatCompact(expenses * 12)} annual burn rate`,
                  ]}
                />
                <DetailList
                  icon={<AlertTriangle size={14} className="text-gold-400" />}
                  title="Key Risks"
                  items={level.risks}
                />
                <DetailList
                  icon={<Flag size={14} className="text-sky-400" />}
                  title="To Reach Next Level"
                  items={level.milestoneRequirements}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs text-zinc-500">
                  <Landmark size={13} />
                  {level.incomeSources.length} income engines ·{" "}
                  {level.approxIncomeLabel}
                </span>
                <Link
                  href={`/levels/${level.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  Full level brief
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "gold" | "neutral";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "gold"
        ? "text-gold-300"
        : "text-zinc-300";
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </p>
      <p className={`mt-0.5 font-display text-base font-semibold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function DetailList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {icon}
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] leading-snug text-zinc-400"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
