"use client";

import * as React from "react";

export type GoalDetail = {
  risk?: "conservative" | "moderate" | "aggressive" | string;
  horizon?:
    | "<1y"
    | "1-3y"
    | "3-5y"
    | "5-10y"
    | "10+y"
    | string;
  amountBand?: string; // e.g., "100-250k", "500k-1M"
  priority?: boolean;
};

export type GoalsDetail = Record<string, GoalDetail>;

const RISK_ORDER = ["conservative", "moderate", "aggressive"];
const HORIZON_ORDER = ["<1y", "1-3y", "3-5y", "5-10y", "10+y"];

function toAxisX(risk?: string) {
  const idx = RISK_ORDER.indexOf((risk ?? "").toLowerCase());
  return idx >= 0 ? idx : 1; // default to middle column
}
function toAxisY(h?: string) {
  const idx = HORIZON_ORDER.indexOf((h ?? "").toLowerCase());
  return idx >= 0 ? idx : 2; // default to middle row
}

function bandToNumber(band?: string): number {
  if (!band) return 0;
  // crude parser: pick the largest number in the band
  const nums = (band.match(/\d+\.?\d*/g) || []).map(parseFloat);
  if (nums.length === 0) return 0;
  const max = Math.max(...nums);
  // assume k/M markers
  if (/m/i.test(band)) return max * 1_000_000;
  if (/k/i.test(band)) return max * 1_000;
  return max;
}

export default function GoalGrid({
  goalsDetail,
  className,
}: {
  goalsDetail: GoalsDetail | undefined;
  className?: string;
}) {
  const items = React.useMemo(() => {
    if (!goalsDetail) return [];
    return Object.entries(goalsDetail).map(([key, g]) => {
      const x = toAxisX(g.risk);
      const y = toAxisY(g.horizon);
      const amt = bandToNumber(g.amountBand);
      // size heuristic: 8..24 px base, bump if priority
      let r = 8 + Math.min(24, Math.floor(Math.log10((amt || 1000)))); // 1k→+3, 1M→+6-ish
      if (g.priority) r += 6;
      return { key, x, y, r, g };
    });
  }, [goalsDetail]);

  return (
    <div className={className}>
      <div className="border rounded-xl p-4">
        {/* axis labels */}
        <div className="flex justify-between text-xs mb-2">
          <span>Conservative</span>
          <span>Moderate</span>
          <span>Aggressive</span>
        </div>
        <div className="relative grid grid-cols-3 grid-rows-5 gap-4 min-h-[260px]">
          {/* faint grid */}
          {[...Array(15)].map((_, i) => (
            <div key={i} className="border border-dashed rounded-md" />
          ))}
          {/* dots */}
          {items.map((it) => {
            // place center of the cell
            const left = `calc(${(it.x / 2) * 100}% - ${it.r / 2}px)`;
            const top = `calc(${(it.y / 4) * 100}% - ${it.r / 2}px)`;
            return (
              <div
                key={it.key}
                title={`${it.key}: ${it.g.risk ?? "?"} × ${it.g.horizon ?? "?"}${
                  it.g.amountBand ? ` • ${it.g.amountBand}` : ""
                }${it.g.priority ? " • priority" : ""}`}
                className="absolute rounded-full opacity-80"
                style={{
                  left,
                  top,
                  width: it.r,
                  height: it.r,
                  border: "2px solid currentColor",
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs mt-2">
          {HORIZON_ORDER.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}