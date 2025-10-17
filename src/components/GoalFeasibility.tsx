// src/components/GoalFeasibility.tsx
"use client";

import { useMemo } from "react";

type FeasibilityInput = {
  key: string;
  label?: string;
  risk?: string;        // conservative | moderate | growth | aggressive
  horizon?: string;     // <3y | 3-5y | 5-10y | 10+y
  amountBand?: string;  // "100-250k", "<100k", "500k-1M", "3M+"
};

type Props = {
  items: FeasibilityInput[];
  cashBand?: string;
  investmentsBand?: string;
  retirementBand?: string;
};

/* ---------- helpers ---------- */
const bandMidpoint = (band?: string): number => {
  if (!band) return 0;
  const b = band.replace(/\s/g, "").toLowerCase();
  const cleaned = b.replace(/[,$]/g, "").replace(/[–—]/g, "-").replace(/^\$/, "");
  if (cleaned.startsWith("<")) {
    const n = Number(cleaned.slice(1).replace(/k/, "000").replace(/m/, "000000"));
    return Number.isFinite(n) ? n * 0.5 : 0;
  }
  if (cleaned.endsWith("+")) {
    const core = cleaned.slice(0, -1);
    const n = Number(core.replace(/k/, "000").replace(/m/, "000000"));
    return Number.isFinite(n) ? n * 1.2 : 0;
  }
  if (cleaned.includes("-")) {
    const [a, c] = cleaned.split("-");
    const aNum = Number(a.replace(/k/, "000").replace(/m/, "000000"));
    const cNum = Number(c.replace(/k/, "000").replace(/m/, "000000"));
    if (Number.isFinite(aNum) && Number.isFinite(cNum)) return (aNum + cNum) / 2;
  }
  const n = Number(cleaned.replace(/k/, "000").replace(/m/, "000000"));
  return Number.isFinite(n) ? n : 0;
};

const yearsFromHorizon = (h?: string): number => {
  const x = (h || "").toLowerCase();
  if (x.startsWith("<3")) return 2;
  if (x.startsWith("3-5")) return 4;
  if (x.startsWith("5-10")) return 7.5;
  return 15; // "10+y" or unknown
};

const riskParams = (r?: string) => {
  const x = (r || "moderate").toLowerCase();
  if (x.startsWith("conservative")) return { mu: 0.03, sigma: 0.06 };
  if (x.startsWith("growth"))       return { mu: 0.07, sigma: 0.14 };
  if (x.startsWith("aggressive"))   return { mu: 0.09, sigma: 0.20 };
  return { mu: 0.05, sigma: 0.10 }; // moderate
};

const quantile = (arr: number[], q: number) => {
  if (!arr.length) return 0;
  const p = Math.max(0, Math.min(1, q));
  const idx = (arr.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return arr[lo];
  return arr[lo] + (arr[hi] - arr[lo]) * (idx - lo);
};

function mcTerminalWealth(S0: number, mu: number, sigma: number, years: number, steps = 12, N = 2000) {
  // geometric brownian motion
  const dt = Math.max(1 / Math.max(1, steps), 1 / 12);
  const totalSteps = Math.max(1, Math.round(years / dt));
  const out: number[] = new Array(N);
  for (let i = 0; i < N; i++) {
    let S = S0;
    for (let t = 0; t < totalSteps; t++) {
      const z = randn();
      S = S * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
    }
    out[i] = Math.max(0, S);
  }
  out.sort((a, b) => a - b);
  return out;
}

// Box–Muller
function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ---------- component ---------- */
export default function GoalFeasibility({
  items,
  cashBand,
  investmentsBand,
  retirementBand,
}: Props) {
  const investable = useMemo(() => {
    const cash = bandMidpoint(cashBand);
    const inv  = bandMidpoint(investmentsBand);
    const ret  = bandMidpoint(retirementBand);
    // conservative approximation: cash + inv + 80% of retirement
    return Math.max(0, cash + inv + 0.8 * ret);
  }, [cashBand, investmentsBand, retirementBand]);

  const rows = useMemo(() => {
    return items.map((g) => {
      const goalAmt = bandMidpoint(g.amountBand);
      const yrs = yearsFromHorizon(g.horizon);
      const { mu, sigma } = riskParams(g.risk);

      const samples = mcTerminalWealth(investable, mu, sigma, yrs, 12, 2000);
      const p10 = quantile(samples, 0.10);
      const p50 = quantile(samples, 0.50);
      const p90 = quantile(samples, 0.90);
      const maxX = Math.max(goalAmt * 1.2, p90 * 1.2, investable * 1.2);
      const prob = goalAmt > 0 ? samples.filter((v) => v >= goalAmt).length / samples.length : 0;

      // histogram for nice area graph
      const bins = 48;
      const hist = new Array(bins).fill(0);
      for (const v of samples) {
        const x = Math.max(0, Math.min(bins - 1, Math.floor((v / maxX) * bins)));
        hist[x] += 1;
      }
      const maxH = Math.max(...hist) || 1;

      return {
        key: g.key,
        label: g.label || g.key,
        risk: g.risk,
        horizon: g.horizon,
        amountBand: g.amountBand,
        prob,
        p10,
        p50,
        p90,
        maxX,
        hist: hist.map((h) => h / maxH), // 0..1
        goalAmt,
      };
    });
  }, [items, investable]);

  if (!items.length) return null;

  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm font-medium mb-2">Goal feasibility (rough estimate)</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.key} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium capitalize">{r.label}</div>
              <div className="text-sm tabular-nums">{Math.round(r.prob * 100)}%</div>
            </div>
            <div className="text-xs text-slate-500">
              {r.amountBand ? `Target ${r.amountBand}` : "No amount set"}
              {r.risk ? ` · ${r.risk}` : ""}{r.horizon ? ` · ${r.horizon}` : ""}
            </div>

            <svg viewBox="0 0 300 90" className="mt-2 w-full">
              {/* axis */}
              <line x1="12" y1="70" x2="288" y2="70" stroke="#e5e7eb" strokeWidth="1" />

              {/* shaded success region (>= goal) */}
              {r.goalAmt > 0 && (
                <rect
                  x={mapX(r.goalAmt, r.maxX)}
                  y={15}
                  width={Math.max(0, 288 - mapX(r.goalAmt, r.maxX))}
                  height={55}
                  fill="#e6fce8"
                />
              )}

              {/* histogram */}
              {(() => {
                const W = 276; // 288 - 12
                const H = 50;
                const left = 12;
                const top = 20;
                const pts: string[] = [];
                r.hist.forEach((v, i) => {
                  const x = left + (i / (r.hist.length - 1)) * W;
                  const y = top + H * (1 - v);
                  pts.push(`${x},${y}`);
                });
                return <polyline points={pts.join(" ")} fill="none" stroke="#6b7280" strokeWidth="2" />;
              })()}

              {/* percentiles */}
              {[
                { val: r.p10, color: "#cbd5e1" },
                { val: r.p50, color: "#475569" },
                { val: r.p90, color: "#cbd5e1" },
              ].map((p, idx) => (
                <line
                  key={idx}
                  x1={mapX(p.val, r.maxX)}
                  x2={mapX(p.val, r.maxX)}
                  y1={15}
                  y2={70}
                  stroke={p.color}
                  strokeDasharray={idx === 1 ? "4 2" : "2 3"}
                  strokeWidth={idx === 1 ? 2 : 1}
                />
              ))}

              {/* goal line */}
              {r.goalAmt > 0 && (
                <line
                  x1={mapX(r.goalAmt, r.maxX)}
                  x2={mapX(r.goalAmt, r.maxX)}
                  y1={15}
                  y2={70}
                  stroke="#16a34a"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}
            </svg>

            <div className="mt-1 text-[11px] text-slate-500">
              Percentiles (p10 / p50 / p90) drawn as light–dark–light lines. Shaded area indicates values above your target.
              This is a rough illustration (not advice).
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapX(v: number, maxX: number) {
  const clamped = Math.max(0, Math.min(maxX, v));
  const t = maxX > 0 ? clamped / maxX : 0;
  // map to [12, 288]
  return 12 + t * 276;
}