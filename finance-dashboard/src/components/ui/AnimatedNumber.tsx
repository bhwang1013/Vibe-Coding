"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  format = (v) => v.toLocaleString("en-US"),
  className = "",
  duration = 1.1,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) => format(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, value, duration, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
