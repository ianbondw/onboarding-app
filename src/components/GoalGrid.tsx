// src/components/GoalGrid.tsx
"use client";

type Item = {
  goalKey: string;        // e.g., "retirement", "education"
  risk: string;           // conservative | moderate | growth | aggressive
  horizon: string;        // <3y | 3-5y | 5-10y | 10+y
};

const RISK_ORDER = ["conservative", "moderate", "growth", "aggressive"] as const;
const HORIZON_ORDER = ["<3y", "3-5y", "5-10y", "10+y"] as const;

function idxOf<T extends string>(arr: readonly T[], v: string) {
  const i = arr.indexOf(v as T);
  return i >= 0 ? i : Math.max(0, Math.min(arr.length - 1, Math.floor(arr.length / 2)));
}

export default function GoalGrid({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 text-sm font-medium text-slate-900">Goals map (risk × horizon)</div>
      <div className="relative">
        {/* grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-2">
          {HORIZON_ORDER.map((h) =>
            RISK_ORDER.map((r) => (
              <div
                key={`${r}-${h}`}
                className="h-16 rounded-md border border-dashed bg-white"
                title={`${r} × ${h}`}
              />
            ))
          )}
        </div>

        {/* axis labels */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500">
          Risk (low → high)
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-500 pl-4 pr-4">
          {RISK_ORDER.map((r) => (
            <span key={r} className="capitalize">{r}</span>
          ))}
        </div>
        <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-xs text-slate-500">
          Time horizon (short → long)
        </div>

        {/* dots */}
        {items.map((it) => {
          const x = idxOf(RISK_ORDER, it.risk);
          const y = idxOf(HORIZON_ORDER, it.horizon);
          const left = (x + 0.5) * (100 / 4);
          const top  = (y + 0.5) * (100 / 4);
          return (
            <div
              key={it.goalKey}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-black"
              style={{ left: `calc(${left}% + 4px)`, top: `calc(${top}% + 4px)` }}
              title={`${it.goalKey} — ${it.risk} × ${it.horizon}`}
            />
          );
        })}
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">Select goals to see them plotted here.</p>
      ) : null}
    </div>
  );
}