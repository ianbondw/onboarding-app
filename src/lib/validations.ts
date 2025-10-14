// src/lib/validation.ts

// Title-case helper (keeps acronyms)
export function tc(s: string) {
  return s
    .split(" ")
    .map(w => (w.toUpperCase() === w ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** ===== Select / multiselect options (title-cased) ===== */

export const EMPLOYMENT_OPTIONS = [
  "Employed", "Self Employed", "Student", "Retired", "Unemployed",
];

export const INCOME_RANGE = ["<50k", "50-100k", "100-250k", "250-500k", "500k+"].map(tc);

// UX buckets (plain English). We’ll map these to legacy fields before submit.
export const ASSET_BUCKETS = {
  cash: "Cash & Cash Equivalents",
  investments: "Investments",
  retirement: "Retirement Accounts",
  realEstate: "Real Estate (Equity)",
  otherAssets: "Other Assets",
  debts: "Debts",
} as const;

export const RANGE_STD = [
  "<100k", "100-250k", "250-500k", "500k-1M", "1-3M", "3M+",
].map(tc);

export const SOURCE_OF_FUNDS = [
  "Salary/Wages", "Business", "Investments", "Inheritance", "Asset Sale", "Other",
];

export const ACCOUNT_TYPES = [
  "Brokerage", "401(k)", "403(b)", "Roth IRA", "Traditional IRA", "529/Education", "HSA", "Crypto", "Real Estate",
];

export const RISK_OPTIONS = ["Very Conservative", "Conservative", "Moderate", "Growth", "Aggressive"];
export const TIME_HORIZON = ["<3 years", "3–5 years", "5–10 years", "10+ years"];
export const LIQUIDITY_NEEDS = ["None", "Some (1–3 years)", "High (≤ 12 months)"];

export const PRIMARY_GOALS = [
  "Retirement", "Income", "Education", "Wealth Growth", "Major Purchase", "Estate/Legacy", "Tax Optimization",
];

export const CONSTRAINTS = [
  "No Leverage", "No Derivatives", "Tax-Sensitive", "ESG Preference", "No Tobacco", "No Weapons", "Concentration Limits",
];

export const EXPERIENCE = ["None", "Limited", "Moderate", "Extensive"];

export const ID_DOC_TYPES = ["Driver License", "Passport", "Other"];

/** ===== Helpers ===== */

// Map human ranges to an approximate mid-point number (for net worth calc)
const mid = (label: string): number => {
  const L = label.toLowerCase();
  if (L.includes("<50k")) return 25_000;
  if (L.includes("50-100k")) return 75_000;
  if (L.includes("100-250k")) return 175_000;
  if (L.includes("250-500k")) return 375_000;
  if (L.includes("500k+")) return 750_000;

  if (L.includes("<100k")) return 50_000;
  if (L.includes("100-250k")) return 175_000;
  if (L.includes("250-500k")) return 375_000;
  if (L.includes("500k-1m")) return 750_000;
  if (L.includes("1-3m")) return 2_000_000;
  if (L.includes("3m+")) return 4_000_000;

  return 0;
};

// Convert numeric value to a display band
export function toNetWorthBand(value: number): string {
  if (value < 100_000) return "<100k";
  if (value < 250_000) return "100-250k";
  if (value < 500_000) return "250-500k";
  if (value < 1_000_000) return "500k-1M";
  if (value < 3_000_000) return "1-3M";
  return "3M+";
}

// Compute net worth band from selected ranges
export function computeNetWorthBand(opts: {
  cash?: string;
  investments?: string;
  retirement?: string;
  realEstate?: string;
  otherAssets?: string;
  debts?: string;
}): string {
  const assets =
    mid(opts.cash || "") +
    mid(opts.investments || "") +
    mid(opts.retirement || "") +
    mid(opts.realEstate || "") +
    mid(opts.otherAssets || "");

  const liabilities = mid(opts.debts || "");
  return toNetWorthBand(Math.max(0, assets - liabilities));
}