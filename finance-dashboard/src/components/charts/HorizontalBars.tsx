"use client";

import { motion } from "framer-motion";
import { formatCompact } from "@/lib/format";

export interface BarDatum {
  name: string;
  value: number;
  color: string;
  /** Optional secondary label, e.g. "% of income" */
  meta?: string;
}

/** Animated horizontal bar list — crisper than a chart for ranked items */
export function HorizontalBars({
  data,
  maxBars,
}: {
  data: BarDatum[];
  maxBars?: number;
}) {
  const shown = maxBars ? data.slice(0, maxBars) : data;
  const max = Math.max(...shown.map((d) => d.value), 1);

  return (
    <ul className="space-y-3">
      {shown.map((datum, index) => (
        <li key={datum.name}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-zinc-300">{datum.name}</span>
            <span className="shrink-0 font-mono text-xs text-zinc-400">
              {formatCompact(datum.value)}
              {datum.meta && (
                <span className="ml-2 text-zinc-600">{datum.meta}</span>
              )}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(datum.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${datum.color}99, ${datum.color})`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
