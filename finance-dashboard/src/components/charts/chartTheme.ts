export const CHART_COLORS = {
  emerald: "#10b981",
  emeraldLight: "#34d399",
  teal: "#2dd4bf",
  gold: "#d4af37",
  goldLight: "#e8c46b",
  zinc: "#71717a",
  red: "#f87171",
  amber: "#fbbf24",
  sky: "#38bdf8",
  violet: "#a78bfa",
  grid: "rgba(255,255,255,0.05)",
  axis: "#52525b",
};

export const CATEGORY_COLORS: Record<string, string> = {
  trading: CHART_COLORS.emerald,
  business: CHART_COLORS.gold,
  passive: CHART_COLORS.sky,
};

export const TAG_COLORS: Record<string, string> = {
  essential: CHART_COLORS.emerald,
  luxury: CHART_COLORS.gold,
  travel: CHART_COLORS.sky,
  business: CHART_COLORS.violet,
  charity: CHART_COLORS.teal,
  special: CHART_COLORS.amber,
};

export const PIE_PALETTE = [
  CHART_COLORS.emerald,
  CHART_COLORS.gold,
  CHART_COLORS.sky,
  CHART_COLORS.violet,
  CHART_COLORS.teal,
  CHART_COLORS.amber,
  CHART_COLORS.emeraldLight,
  CHART_COLORS.goldLight,
  CHART_COLORS.red,
];

export const TOOLTIP_STYLE = {
  backgroundColor: "rgba(14, 14, 17, 0.94)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  fontSize: "12px",
  color: "#e4e4e7",
} as const;
