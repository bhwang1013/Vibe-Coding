"use client";

import { motion } from "framer-motion";
import { plan } from "@/lib/finance";

interface LevelSwitcherProps {
  selected: number;
  onSelect: (levelId: number) => void;
}

export function LevelSwitcher({ selected, onSelect }: LevelSwitcherProps) {
  return (
    <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-xl">
      {plan.levels.map((level) => {
        const active = level.id === selected;
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelect(level.id)}
            className={`relative shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active ? "text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="level-switch-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-300"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10">L{level.id}</span>
          </button>
        );
      })}
    </div>
  );
}
