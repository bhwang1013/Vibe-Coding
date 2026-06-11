import rawPlan from "@/data/plan.json";
import type {
  ExpenseGroup,
  ExpenseItem,
  ExpenseProfile,
  ExpenseTag,
  FinancialPlan,
  IncomeCategory,
  IncomeSource,
  Level,
} from "@/lib/types";

export const plan = rawPlan as FinancialPlan;

/* ----------------------------- income ----------------------------- */

/** Net monthly payout for a source: gross × efficiency × retention × count */
export function sourceNet(source: IncomeSource): number {
  return source.gross * source.efficiency * source.retention * source.count;
}

export function sourceGross(source: IncomeSource): number {
  return source.gross * source.count;
}

export function levelIncome(level: Level): number {
  return level.incomeSources.reduce((sum, s) => sum + sourceNet(s), 0);
}

export function incomeByCategory(level: Level): Record<IncomeCategory, number> {
  const totals: Record<IncomeCategory, number> = {
    trading: 0,
    business: 0,
    passive: 0,
  };
  for (const s of level.incomeSources) totals[s.category] += sourceNet(s);
  return totals;
}

export function deployedCapital(level: Level): number {
  return level.incomeSources.reduce((sum, s) => sum + s.capital, 0);
}

/* ----------------------------- expenses ----------------------------- */

export function expenseProfileFor(level: Level): ExpenseProfile {
  const profile = plan.expenseProfiles.find(
    (p) => p.id === level.expenseProfileId,
  );
  if (!profile) {
    throw new Error(`Unknown expense profile: ${level.expenseProfileId}`);
  }
  return profile;
}

export function groupTotal(group: ExpenseGroup): number {
  return group.items.reduce((sum, i) => sum + i.amount, 0);
}

export function levelExpenses(level: Level): number {
  return expenseProfileFor(level).groups.reduce(
    (sum, g) => sum + groupTotal(g),
    0,
  );
}

export function allExpenseItems(level: Level): ExpenseItem[] {
  return expenseProfileFor(level).groups.flatMap((g) => g.items);
}

export function expensesByTag(level: Level): Record<ExpenseTag, number> {
  const totals: Record<ExpenseTag, number> = {
    essential: 0,
    luxury: 0,
    travel: 0,
    business: 0,
    charity: 0,
    special: 0,
  };
  for (const item of allExpenseItems(level)) totals[item.tag] += item.amount;
  return totals;
}

/* ----------------------------- derived ----------------------------- */

export function levelCashFlow(level: Level): number {
  return levelIncome(level) - levelExpenses(level);
}

export function savingsRate(level: Level): number {
  const income = levelIncome(level);
  return income > 0 ? levelCashFlow(level) / income : 0;
}

export function currentLevel(): Level {
  const level = plan.levels.find((l) => l.id === plan.profile.currentLevelId);
  return level ?? plan.levels[0];
}

export function nextLevel(level: Level): Level | undefined {
  return plan.levels.find((l) => l.id === level.id + 1);
}

export function nextMilestone(netWorth: number) {
  return plan.milestones.find((m) => m.value > netWorth);
}

export function prevMilestoneValue(netWorth: number): number {
  const passed = plan.milestones.filter((m) => m.value <= netWorth);
  return passed.length > 0 ? passed[passed.length - 1].value : 0;
}

/* ----------------------------- projections ----------------------------- */

/**
 * Months until `target` is reached, compounding monthly savings at
 * `annualReturn`. Returns Infinity if it can never be reached.
 */
export function monthsToTarget(
  start: number,
  target: number,
  monthlySavings: number,
  annualReturn: number,
): number {
  if (start >= target) return 0;
  if (monthlySavings <= 0 && annualReturn <= 0) return Infinity;
  const monthlyRate = annualReturn / 12;
  let balance = start;
  for (let month = 1; month <= 1200; month++) {
    balance = balance * (1 + monthlyRate) + monthlySavings;
    if (balance >= target) return month;
  }
  return Infinity;
}

export interface ProjectionPoint {
  month: number;
  label: string;
  netWorth: number;
}

/** Net-worth curve from compounding `monthlySavings`, sampled for charting */
export function projectNetWorth(
  start: number,
  monthlySavings: number,
  annualReturn: number,
  months: number,
  step = 3,
): ProjectionPoint[] {
  const monthlyRate = annualReturn / 12;
  const points: ProjectionPoint[] = [
    { month: 0, label: "Now", netWorth: Math.round(start) },
  ];
  let balance = start;
  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlySavings;
    if (month % step === 0 || month === months) {
      const label =
        month % 12 === 0 ? `Yr ${month / 12}` : `M${month}`;
      points.push({ month, label, netWorth: Math.round(balance) });
    }
  }
  return points;
}

/* ----------------------------- risk ----------------------------- */

export interface RiskMetric {
  id: string;
  name: string;
  /** 0–100, higher = more dangerous */
  score: number;
  detail: string;
  recommendation: string;
}

function clampScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function riskMetricsFor(level: Level): RiskMetric[] {
  const income = levelIncome(level);
  const byCategory = incomeByCategory(level);
  const tradingShare = income > 0 ? byCategory.trading / income : 0;
  const businessShare = income > 0 ? byCategory.business / income : 0;

  const apexNet = level.incomeSources
    .filter((s) => s.platform.toLowerCase().includes("apex"))
    .reduce((sum, s) => sum + sourceNet(s), 0);
  const propShare = income > 0 ? apexNet / income : 0;

  const topSource = Math.max(
    ...level.incomeSources.map((s) => (income > 0 ? sourceNet(s) / income : 0)),
  );

  const expenseRatio = income > 0 ? levelExpenses(level) / income : 1;

  return [
    {
      id: "concentration",
      name: "Income Concentration",
      score: clampScore(topSource * 130),
      detail: `Largest single source is ${(topSource * 100).toFixed(0)}% of net income.`,
      recommendation:
        topSource > 0.4
          ? "Scale secondary streams until no single source exceeds 40% of income."
          : "Concentration is acceptable — keep streams balanced as they scale.",
    },
    {
      id: "lifestyle",
      name: "Lifestyle Inflation",
      score: clampScore(expenseRatio * 100),
      detail: `Burn rate consumes ${(expenseRatio * 100).toFixed(0)}% of net income.`,
      recommendation:
        expenseRatio > 0.6
          ? "Freeze lifestyle upgrades until savings rate is back above 40%."
          : "Savings rate is healthy — lock the lifestyle and bank the spread.",
    },
    {
      id: "trading",
      name: "Trading Dependency",
      score: clampScore(tradingShare * 100),
      detail: `${(tradingShare * 100).toFixed(0)}% of income requires active trading days.`,
      recommendation:
        tradingShare > 0.7
          ? "Accelerate the membership and passive layers — income should survive a month off the desk."
          : "Active/passive mix is improving — keep compounding the passive layer.",
    },
    {
      id: "prop",
      name: "Prop Firm Dependency",
      score: clampScore(propShare * 170),
      detail: `Apex payouts are ${(propShare * 100).toFixed(0)}% of net income and can be revoked.`,
      recommendation:
        propShare > 0.3
          ? "Treat prop payouts as bonus capital, not baseline income — fund lifestyle from personal accounts only."
          : "Prop exposure is contained — keep activations budgeted as a business cost.",
    },
    {
      id: "business",
      name: "Business Dependency",
      score:
        businessShare === 0
          ? 25
          : clampScore(35 + businessShare * 80),
      detail:
        businessShare === 0
          ? "No business income yet — zero diversification from a second engine."
          : `Membership contributes ${(businessShare * 100).toFixed(0)}% of income with churn and ad-cost exposure.`,
      recommendation:
        businessShare === 0
          ? "Launch Money Muscle Mindset to add a non-trading engine."
          : "Systematize content + support so the business survives founder downtime.",
    },
  ];
}

export function overallRiskScore(level: Level): number {
  const metrics = riskMetricsFor(level);
  return Math.round(
    metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length,
  );
}
