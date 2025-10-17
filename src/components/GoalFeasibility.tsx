// src/components/GoalFeasibility.tsx
"use client";

import { useMemo } from "react";

type FeasibilityInput = {
  key: string;
  label?: string;
  risk?: string;        // conservative | moderate | growth | aggressive
  horizon?: string;     // <3y | 3-5y | 5-10y | 10+y
  amountBand?: string;  // goal size (range like "100-250k", "500k-1M")
};

type Props = {
  items: FeasibilityInput[];
  // asset bands from the wizard step
  cashBand?: string;
  investmentsBand?: string;
  retirementBand?: string;
};

const bandMidpoint = (band?: string): number => {
  if (!band) return 0;
  const b = band.replace(/\s/g, "").toLowerCase();
  // Normalize variants like "$100-250k", "100–250k", etc.
  const cleaned = b.replace(/[,$]/g, "").replace(/[–—]/g, "-").replace(/^\$/, "");
  if (cleaned.startsWith("<")) {
    const n = Number(cleaned.slice(1).replace(/k/, "000").replace(/m/, "000000"));
    return Number.isFinite(n) ? n * 0.5 : 0;
  }
  if (cleaned.endsWith("+")) {
    const core = cleaned.slice(0, -1);
    const n = Number(core.replace(/k/, "000").replace(/m/, "000000"));
    // pick a conservative midpoint above lower bound
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
  // crude mean/vol assumptions (annualized)
  if (x.startsWith("conservative")) return { mu: 0.03, sigma: 0.06 };
  if (x.startsWith("growth"))       return { mu: 0.07, sigma: 0.14 };
  if (x.startsWith("aggressive"))   return { mu: 0.09, sigma: 0.20 };
  return { mu: 0.05, sigma: 0.10 }; // moderate
};

// erf approximation for Normal CDF
function erf(z: number) {
  // Abramowitz & Stegun 7.1.26
  const t = 1 / (1 + 0.5 * Math.abs(z));
  const tau =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        1.00002368 * t +
        0.37409196 * t ** 2 +
        0.09678418 * t ** 3 -
        0.18628806 * t ** 4 +
        0.27886807 * t ** 5 -
        1.13520398 * t ** 6 +
        1.48851587 * t ** 7 -
        0.82215223 * t ** 8 +
        0.17087277 * t ** 9
    );
  return z >= 0 ? 1 - tau : tau - 1;
}
function normCdf(x: number, mu = 0, sigma = 1) {
  return 0.5 * (1 + erf((x - mu) / (Math.SQRT2 * sigma)));
}
function normPdf(x: number, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  return (Math.exp(-0.5 * z * z) / (Math.sqrt(2 * Math.PI) * sigma));
}

export default function GoalFeasibility({
  items,
  cashBand,
  investmentsBand,
  retirementBand,
}: Props) {
  const investable = useMemo(() => {
    // crude investable base: cash + investments + 0.8 * retirement
    const cash = bandMidpoint(cashBand);
    const inv  = bandMidpoint(investmentsBand);
    const ret  = bandMidpoint(retirementBand);
    return Math.max(0, cash + inv + 0.8 * ret);
  }, [cashBand, investmentsBand, retirementBand]);

  const rows = useMemo(() => {
    return items.map((g) => {
      const amt = bandMidpoint(g.amountBand);
      const yrs = yearsFromHorizon(g.horizon);
      const { mu, sigma } = riskParams(g.risk);

      // very rough terminal wealth mean/vol (compounding; sigma scaled by sqrt(T))
      const meanTW = investable * Math.pow(1 + mu, yrs);
      const sdTW   = meanTW * Math.max(0.05, sigma) * Math.sqrt(Math.max(1, yrs / 5));

      let p = 0;
      if (amt > 0 && meanTW > 0 && sdTW > 0) {
        p = 1 - normCdf(amt, meanTW, sdTW); // P(TW >= amount)
      }

      return {
        key: g.key,
        label: g.label || g.key,
        risk: g.risk,
        horizon: g.horizon,
        amountBand: g.amountBand,
        prob: Math.max(0, Math.min(1, p)),
        // parameters for drawing a pretty gaussian (not to scale)
        draw: { mu: 0, sigma: 1 }, // fixed curve shape for aesthetics
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

            {/* Simple gaussian sketch with shaded success area */}
            <svg viewBox="0 0 280 80" className="mt-2 w-full">
              {/* axis baseline */}
              <line x1="10" y1="65" x2="270" y2="65" stroke="#e5e7eb" strokeWidth="1"/>
              {/* Draw a standard normal-like curve centered at 140 */}
              {(() => {
                const W = 260, H = 50, left = 10, top = 10;
                const cx = left + W / 2;
                const sx = W / 6; // width of the bell
                const pts: string[] = [];
                for (let i = 0; i <= W; i += 2) {
                  const x = left + i;
                  const z = (i - W / 2) / sx;
                  const y = top + H - (normPdf(z, 0, 1) / normPdf(0, 0, 1)) * H;
                  pts.push(`${x},${y}`);
                }
                return (
                  <>
                    {/* success region: shade right half proportionally to probability */}
                    <rect x={cx} y={top} width={(W/2) * r.prob} height={H+10} fill="#e6fce8" />
                    {/* bell curve */}
                    <polyline points={pts.join(" ")} fill="none" stroke="#6b7280" strokeWidth="1.5"/>
                  </>
                );
              })()}
            </svg>

            <div className="mt-1 text-[11px] text-slate-500">
              This is a rough, illustrative estimate (not advice). It assumes simple return/volatility bands by risk and compounds over your horizon.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}