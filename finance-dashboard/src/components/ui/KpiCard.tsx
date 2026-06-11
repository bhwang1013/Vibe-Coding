"use client";

import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface KpiCardProps {
  label: string;
  value: number;
  format: (value: number) => string;
  icon: LucideIcon;
  sublabel?: string;
  /** 0–1; renders a progress bar when provided */
  progress?: number;
  accent?: "emerald" | "gold" | "neutral";
  delay?: number;
}

const ICON_ACCENTS = {
  emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  gold: "border-gold-500/25 bg-gold-500/10 text-gold-400",
  neutral: "border-white/10 bg-white/[0.05] text-zinc-300",
} as const;

export function KpiCard({
  label,
  value,
  format,
  icon: Icon,
  sublabel,
  progress,
  accent = "emerald",
  delay = 0,
}: KpiCardProps) {
  return (
    <GlassCard delay={delay} className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps">{label}</p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${ICON_ACCENTS[accent]}`}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
        <AnimatedNumber value={value} format={format} />
      </p>
      {sublabel && <p className="mt-1 text-xs text-zinc-500">{sublabel}</p>}
      {progress !== undefined && (
        <ProgressBar
          progress={progress}
          variant={accent}
          className="mt-3.5"
        />
      )}
    </GlassCard>
  );
}
