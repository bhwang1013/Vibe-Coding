export type IncomeCategory = "trading" | "business" | "passive";

export type ExpenseTag =
  | "essential"
  | "luxury"
  | "travel"
  | "business"
  | "charity"
  | "special";

export type ExpenseGroupId = "essential" | "extra" | "charity" | "special";

export interface IncomeSource {
  id: string;
  name: string;
  /** Broker / platform label, e.g. "Charles Schwab + E*Trade" */
  platform: string;
  category: IncomeCategory;
  /** Capital deployed across the accounts behind this source, in USD */
  capital: number;
  /** Gross monthly production before fees and taxes */
  gross: number;
  /** Fee / efficiency multiplier applied to gross (e.g. 0.96) */
  efficiency: number;
  /** After-tax retention multiplier applied next (e.g. 0.6) */
  retention: number;
  /** Number of identical accounts represented by this entry */
  count: number;
  /** Operating cadence, e.g. "16 days of trading" */
  cadence: string;
}

export interface ExpenseItem {
  name: string;
  amount: number;
  tag: ExpenseTag;
}

export interface ExpenseGroup {
  id: ExpenseGroupId;
  label: string;
  items: ExpenseItem[];
}

export interface ExpenseProfile {
  id: string;
  label: string;
  groups: ExpenseGroup[];
}

export interface Level {
  id: number;
  name: string;
  codename: string;
  tagline: string;
  approxIncomeLabel: string;
  approxExpenseLabel: string;
  lifestyle: string;
  expenseProfileId: string;
  emergencyFundTarget: number;
  incomeSources: IncomeSource[];
  risks: string[];
  milestoneRequirements: string[];
}

export interface Milestone {
  label: string;
  value: number;
}

export interface Profile {
  appName: string;
  ownerLabel: string;
  currentLevelId: number;
  currentNetWorth: number;
  currentEmergencyFund: number;
  financialFreedomTarget: number;
  /** Assumed annual return on banked capital, used in projections */
  assumedAnnualReturn: number;
}

export interface FinancialPlan {
  profile: Profile;
  milestones: Milestone[];
  expenseProfiles: ExpenseProfile[];
  levels: Level[];
}
