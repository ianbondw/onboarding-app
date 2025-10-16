// src/components/GoalEditor.tsx
"use client";

import { useMemo } from "react";
import FlagThisField from "@/components/FlagThisField";
import { RISK_OPTIONS, TIME_HORIZON, RANGE_STD } from "@/lib/validations";

type GoalDetail = {
  risk?: string;
  horizon?: string;
  amountBand?: string;
  priority?: boolean;
};

type Props = {
  value: Record<string, GoalDetail>;
  onChange: (next: Record<string, GoalDetail>) => void;
  /** Optional — if provided, we'll show the "Need help" flag button per row */
  token?: string;
  email?: string;
};

const normalize = (s: string) =>
  (s || "")
    .replace(/[–—]/g, "-")
    .replace(/\s*\(\S.*?\)\s*/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w+-]/g, "")
    .toLowerCase();

export default function GoalEditor({ value, onChange, token, email }: Props) {
  const keys = useMemo(() => Object.keys(value || {}), [value]);

  if (!keys.length) {
    return (
      <div className="text-sm text-slate-600">
        No goals selected yet — choose goals on the previous step.
      </div>
    );
  }

  function update(key: string, patch: Partial<GoalDetail>) {
    const next = { ...value, [key]: { ...(value[key] || {}), ...patch } };
    onChange(next);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keys.map((key) => {
        const d = value[key] || {};
        return (
          <div key={key} className="rounded-xl border p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium capitalize">{key}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!d.priority}
                  onChange={(e) => update(key, { priority: e.target.checked })}
                />
                <span className="text-sm">Mark priority</span>
              </label>
            </div>

            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Risk</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={d.risk || ""}
                onChange={(e) => update(key, { risk: normalize(e.target.value) })}
              >
                <option value="">Use overall</option>
                {RISK_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs block mb-2">
              <span className="mb-1 block text-slate-700">Time horizon</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={d.horizon || ""}
                onChange={(e) => update(key, { horizon: normalize(e.target.value) })}
              >
                <option value="">Use overall</option>
                {TIME_HORIZON.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs block mb-1">
              <span className="mb-1 block text-slate-700">Amount (range)</span>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={d.amountBand || ""}
                onChange={(e) => update(key, { amountBand: e.target.value })}
              >
                <option value="">Not sure</option>
                {RANGE_STD.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            {/* Need-help flag (only if token+email provided) */}
            {token && email ? (
              <div className="-mt-1">
                <FlagThisField token={token} email={email} fieldKey={`goalsDetail.${key}`} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}