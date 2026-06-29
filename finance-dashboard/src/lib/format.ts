export function formatCurrency(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** $1.2M / $450K style compact currency for KPI surfaces */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    return `${sign}$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  if (abs >= 1_000) {
    const k = abs / 1_000;
    return `${sign}$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

/** "3 yrs 4 mos" from a month count; "—" when unreachable */
export function formatMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "—";
  if (months === 0) return "Reached";
  const yrs = Math.floor(months / 12);
  const mos = Math.round(months % 12);
  if (yrs === 0) return `${mos} mo${mos === 1 ? "" : "s"}`;
  if (mos === 0) return `${yrs} yr${yrs === 1 ? "" : "s"}`;
  return `${yrs} yr${yrs === 1 ? "" : "s"} ${mos} mo${mos === 1 ? "" : "s"}`;
}
