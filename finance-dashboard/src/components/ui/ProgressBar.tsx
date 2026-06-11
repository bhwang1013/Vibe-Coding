"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  /** 0–1 */
  progress: number;
  variant?: "emerald" | "gold" | "neutral";
  className?: string;
  height?: string;
}

const VARIANTS = {
  emerald: "from-emerald-500 to-teal-400",
  gold: "from-gold-600 to-gold-300",
  neutral: "from-zinc-500 to-zinc-300",
} as const;

export function ProgressBar({
  progress,
  variant = "emerald",
  className = "",
  height = "h-1.5",
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <div
      className={`${height} w-full overflow-hidden rounded-full bg-white/[0.06] ${className}`}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`h-full rounded-full bg-gradient-to-r ${VARIANTS[variant]}`}
      />
    </div>
  );
}
