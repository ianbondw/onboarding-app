"use client";

import * as React from "react";
import GoalGrid, { GoalsDetail, GoalDetail } from "./GoalGrid";
import FlagThisField from "./FlagThisField";

const PRESET_GOALS = ["retirement", "education", "home", "income", "growth"] as const;
const RISK = ["conservative", "moderate", "aggressive"] as const;
const HORIZON = ["<1y", "1-3y", "3-5y", "5-10y", "10+y"] as const;

export default function GoalEditor({
  value,
  onChange,
}: {
  value: GoalsDetail | undefined;
  onChange: (next: GoalsDetail) => void;
}) {
  const [local, setLocal] = React.useState<GoalsDetail>(value ?? {});
  const [other, setOther] = React.useState("");

  React.useEffect(() => setLocal(value ?? {}), [value]);

  function toggleGoal(key: string) {
    const next = { ...local };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = { risk: "moderate", horizon: "5-10y" };
    }
    setLocal(next);
    onChange(next);
  }

  function patch(key: string, partial: Partial<GoalDetail>) {
    const next = { ...local, [key]: { ...(local[key] ?? {}), ...partial } };
    setLocal(next);
    onChange(next);
  }

  function addOther() {
    const k = other.trim().toLowerCase();
    if (!k) return;
    if (!local[k]) {
      const next = { ...local, [k]: { risk: "moderate", horizon: "3-5y" } };
      setLocal(next);
      onChange(next);
    }
    setOther("");
  }

  const selectedKeys = Object.keys(local);

  return (
    <div className="space-y-6">
      {/* chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_GOALS.map((g) => {
          const active = !!local[g];
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggleGoal(g)}
              className={`px-3 py-1 rounded-full border text-sm ${
                active ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {capitalize(g)}
            </button>
          );
        })}
        <div className="flex items-center gap-2">
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Other goal…"
            className="border rounded-md px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={addOther}
            className="px-2 py-1 text-sm border rounded-md"
          >
            Add
          </button>
        </div>
      </div>

      {/* rows */}
      <div className="space-y-3">
        {selectedKeys.map((key) => {
          const g = local[key] ?? {};
          return (
            <div
              key={key}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border rounded-xl p-3"
            >
              <div className="md:col-span-1">
                <label className="text-xs uppercase tracking-wide">Goal</label>
                <div className="font-medium">{beautify(key)}</div>
              </div>

              <div>
                <label className="text-xs">Risk tolerance</label>
                <select
                  className="w-full border rounded-md px-2 py-1"
                  value={g.risk ?? "moderate"}
                  onChange={(e) => patch(key, { risk: e.target.value })}
                >
                  {RISK.map((r) => (
                    <option key={r} value={r}>
                      {capitalize(r)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs">Time horizon</label>
                <select
                  className="w-full border rounded-md px-2 py-1"
                  value={g.horizon ?? "3-5y"}
                  onChange={(e) => patch(key, { horizon: e.target.value })}
                >
                  {HORIZON.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs">Amount band</label>
                <input
                  className="w-full border rounded-md px-2 py-1"
                  placeholder='e.g., "100-250k" or "1-2M"'
                  value={g.amountBand ?? ""}
                  onChange={(e) => patch(key, { amountBand: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between md:justify-start gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!g.priority}
                    onChange={(e) => patch(key, { priority: e.target.checked })}
                  />
                  <span className="text-sm">Mark priority</span>
                </label>
                <FlagThisField fieldPath={`goalsDetail.${key}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* live viz */}
      <GoalGrid goalsDetail={local} />

      {/* tip */}
      <p className="text-xs text-gray-500">
        Dots update live: X = risk, Y = horizon, size = amount/priority.
      </p>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function beautify(s: string) {
  return s.split(/[_-]/).map(capitalize).join(" ");
}
