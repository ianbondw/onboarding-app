// src/components/GoalEditor.tsx
"use client";

import React from "react";
import FlagThisField from "@/components/FlagThisField";
import { RANGE_STD } from "@/lib/validations";

type GoalDetail = {
  risk?: string;        // very_conservative | conservative | balanced | moderate | growth | aggressive | very_aggressive
  horizon?: string;     // <1y | 1-3y | 3-5y | 5-7y | 7-10y | 10-15y | 15+y
  liquidity?: string;   // daily | monthly | quarterly | annual | illiquid_ok
  amountBand?: string;  // "<100k" | "100-250k" | ...
  priority?: boolean;
};

type Props = {
  value: Record<string, GoalDetail>;
  onChange: (next: Record<string, GoalDetail>) => void;
  token: string;
  email: string;
};

const normalize = (s: string) =>
  s
    ?.toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s*\(\S.*?\)\s*/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w+<>\-y]/g, "") || "";

const RISK_OPTS = [
  { value: "very_conservative", label: "Very Conservative" },
  { value: "conservative",      label: "Conservative" },
  { value: "balanced",          label: "Balanced" },
  { value: "moderate",          label: "Moderate" },
  { value: "growth",            label: "Growth" },
  { value: "aggressive",        label: "Aggressive" },
  { value: "very_aggressive",   label: "Very Aggressive" },
];

const HORIZON_OPTS = [
  { value: "<1y",    label: "< 1 year" },
  { value: "1-3y",   label: "1–3 years" },
  { value: "3-5y",   label: "3–5 years" },
  { value: "5-7y",   label: "5–7 years" },
  { value: "7-10y",  label: "7–10 years" },
  { value: "10-15y", label: "10–15 years" },
  { value: "15+y",   label: "15+ years" },
];

const LIQ_OPTS = [
  { value: "daily",        label: "Daily access (highest liquidity)" },
  { value: "monthly",      label: "Monthly access" },
  { value: "quarterly",    label: "Quarterly access" },
  { value: "annual",       label: "Annual access" },
  { value: "illiquid_ok",  label: "Illiquid OK (long lockups)" },
];

function cap(s: string) {
  if (!s) return s;
  return s.replace(/[_-]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function GoalEditor({ value, onChange, token, email }: Props) {
  const keys = Object.keys(value || {});
  if (keys.length === 0) {
    return <p className="text-sm text-slate-600">Select at least one goal on the previous step.</p>;
  }

  const setPatch = (goalKey: string, patch: Partial<GoalDetail>) => {
    const next = { ...(value || {}) };
    next[goalKey] = { ...(next[goalKey] || {}), ...patch };
    onChange(next);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map((key) => {
        const detail = value[key] || {};
        return (
          <div key={key} className="rounded-xl border p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium capitalize">{cap(key.replace(/^custom:/, ""))}</div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={!!detail.priority}
                  onChange={(e) => setPatch(key, { priority: e.target.checked })}
                />
                <span className="text-sm">Mark priority</span>
              </label>
            </div>

            {/* Risk */}
            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Risk</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={detail.risk ?? ""} // "" means "Use default"
                onChange={(e) => setPatch(key, { risk: e.target.value || undefined })}
              >
                <option value="">Use default</option>
                {RISK_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            {/* Horizon */}
            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Time horizon</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={detail.horizon ?? ""}
                onChange={(e) => setPatch(key, { horizon: normalize(e.target.value) || undefined })}
              >
                <option value="">Use default</option>
                {HORIZON_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            {/* Liquidity */}
            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Liquidity need</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={detail.liquidity ?? ""}
                onChange={(e) => setPatch(key, { liquidity: normalize(e.target.value) || undefined })}
              >
                <option value="">Use default</option>
                {LIQ_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

            {/* Amount band */}
            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Amount (range)</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={detail.amountBand ?? ""}
                onChange={(e) => setPatch(key, { amountBand: e.target.value || undefined })}
              >
                <option value="">Select…</option>
                {RANGE_STD.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <div className="mt-2">
              <FlagThisField token={token} email={email} fieldKey={`goalsDetail.${key}`} className="text-xs underline" />
            </div>
          </div>
        );
      })}
    </div>
  );
}