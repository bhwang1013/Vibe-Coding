"use client";

import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger index for entrance animation */
  delay?: number;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: delay * 0.07, ease: "easeOut" }}
      className={`glass ${hover ? "glass-hover" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
