// src/app/onboarding/[token]/wizard.tsx
"use client";

import { useMemo, useState } from "react";
import {
  EMPLOYMENT_OPTIONS,
  INCOME_RANGE,
  ASSET_BUCKETS,
  RANGE_STD,
  SOURCE_OF_FUNDS,
  ACCOUNT_TYPES,
  RISK_OPTIONS,
  TIME_HORIZON,
  LIQUIDITY_NEEDS,
  PRIMARY_GOALS,
  CONSTRAINTS,
  EXPERIENCE,
  ID_DOC_TYPES,
  computeNetWorthBand,
} from "@/lib/validations";
import FlagThisField from "@/components/FlagThisField";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

/** ---- helpers for amount <-> band mapping ---- **/
const MONEY_BANDS = ["<100k","100-250k","250-500k","500k-1M","1-3M","3M+"] as const;

function toNumberUSD(s: string) {
  // "250000" or "$250,000" → 250000
  const n = Number(String(s).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function amountToBand(v: number): string {
  if (v <= 0) return "";
  if (v < 100_000) return "<100k";
  if (v < 250_000) return "100-250k";
  if (v < 500_000) return "250-500k";
  if (v < 1_000_000) return "500k-1M";
  if (v < 3_000_000) return "1-3M";
  return "3M+";
}
function bandToExample(band: string) {
  switch (band) {
    case "<100k": return "$0–$100k";
    case "100-250k": return "$100k–$250k";
    case "250-500k": return "$250k–$500k";
    case "500k-1M": return "$500k–$1M";
    case "1-3M": return "$1M–$3M";
    case "3M+": return "$3M+";
    default: return "—";
  }
}
// Combine two range labels into one rough band (pick the larger bucket).
function combineTwo(a?: string, b?: string) {
  const ranks = MONEY_BANDS;
  const ra = ranks.indexOf((a || "") as any);
  const rb = ranks.indexOf((b || "") as any);
  const idx = Math.max(ra, rb);
  return idx >= 0 ? ranks[idx] : "";
}
// Normalize to lower_snake-ish strings
function normalize(label: string): string {
  if (!label) return "";
  return label
    .replace(/[–—]/g, "-")
    .replace(/\s*\(\S.*?\)\s*/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w+-]/g, "")
    .toLowerCase();
}
// Convert "100-250k" -> "$100–250k", "<100k" -> "<$100k"
function formatMoney(band: string) {
  if (!band) return "";
  const s = band.replace(/-/g, "–");
  if (s.startsWith("<")) return "<$" + s.slice(1);
  if (/^\$/.test(s)) return s;
  if (/^\d/.test(s)) return "$" + s;
  return s;
}
function moneyify(band: string) {
  return band ? formatMoney(band) : "—";
}

/** ---- tiny widget that lets users enter an amount or pick a band ---- **/
function AmountOrSelect({
  label,
  valueBand,
  setValueBand,
  tooltip,
}: {
  label: string;
  valueBand: string;
  setValueBand: (v: string) => void;
  tooltip?: string;
}) {
  const [useAmount, setUseAmount] = useState(false);
  const [amount, setAmount] = useState("");

  function applyAmount(v: string) {
    setAmount(v);
    const band = amountToBand(toNumberUSD(v));
    setValueBand(band);
  }

  return (
    <div className="text-sm">
      <div className="mb-1 flex items-center justify-between text-slate-700">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {tooltip ? <span title={tooltip} className="cursor-help text-xs text-slate-500">ⓘ</span> : null}
        </div>
        <button type="button" className="text-xs underline" onClick={()=>setUseAmount(!useAmount)}>
          {useAmount ? "Choose range" : "Enter amount"}
        </button>
      </div>

      {!useAmount ? (
        <select
          className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
          value={valueBand}
          onChange={e=>setValueBand(e.target.value)}
        >
          <option value="">Select…</option>
          {RANGE_STD.map((o)=> (
            <option key={o} value={o}>
              {formatMoney(o)}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric"
            placeholder="$250,000"
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={amount}
            onChange={(e)=>applyAmount(e.target.value)}
          />
          <div className="whitespace-nowrap text-xs text-slate-500">
            → {valueBand ? bandToExample(valueBand) : "—"}
          </div>
        </div>
      )}
    </div>
  );
}

/** ---- Live risk × time 9-box (no deps) ---- **/
function RiskHorizonNineBox({ risk, horizon }: { risk: string; horizon: string }) {
  const riskIdx = ["conservative","moderate","growth","aggressive"].indexOf(normalize(risk));
  const horIdx  = ["<3y","3-5y","5-10y","10+y"].indexOf(normalize(horizon));
  const x = Math.max(0, riskIdx);
  const y = Math.max(0, horIdx);

  return (
    <div className="sm:col-span-2 mt-2">
      <div className="text-sm font-medium mb-1">Your balance of risk & time</div>
      <div className="relative grid grid-cols-4 grid-rows-4 gap-[2px] bg-slate-200 p-[2px] rounded-md w-full max-w-md">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-10 bg-white" />
        ))}
        <div
          className="absolute size-3 rounded-full bg-black"
          style={{
            // 4 cols/rows -> cell size approx 25%
            left: `calc(${(x + 0.5) * 25}% - 6px)`,
            top: `calc(${(y + 0.5) * 25}% - 6px)`,
          }}
          title={`${risk || "—"} × ${horizon || "—"}`}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500 max-w-md">
        <span>Conservative</span><span>Moderate</span><span>Growth</span><span>Aggressive</span>
      </div>
    </div>
  );
}

export default function Wizard({ token }: { token: string }) {
  const [step, setStep] = useState<Step>(0);

  // ---- Form state ----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");

  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [employerName, setEmployerName]         = useState("");
  const [annualIncomeBand, setAnnualIncomeBand] = useState<string>("");
  const [sourceOfFunds, setSourceOfFunds]       = useState<string[]>([]); // multi

  // Assets in plain English (bands)
  const [cashBand, setCashBand]                 = useState<string>("");
  const [investmentsBand, setInvestmentsBand]   = useState<string>("");
  const [retirementBand, setRetirementBand]     = useState<string>("");
  const [realEstateBand, setRealEstateBand]     = useState<string>("");
  const [otherAssetsBand, setOtherAssetsBand]   = useState<string>("");
  const [debtsBand, setDebtsBand]               = useState<string>("");

  const [accounts, setAccounts] = useState<string[]>([]); // multi

  const [riskTolerance, setRiskTolerance] = useState<string>("");
  const [timeHorizon, setTimeHorizon]     = useState<string>("");
  const [primaryGoals, setPrimaryGoals]   = useState<string[]>([]);
  const [liquidityNeeds, setLiquidity]    = useState<string>("");
  const [constraints, setConstraints]     = useState<string[]>([]);
  const [investmentExperience, setExperience] = useState<string>("");

  // Identity (demo-friendly)
  const [ssn, setSSN]                     = useState("");
  const [idDocType, setIdDocType]         = useState<string>("");
  const [idDocUrl, setIdDocUrl]           = useState("");
  const [consentAccepted, setConsent]     = useState(false);

  // --- Next conversation topic ---
  const NEXT_TOPIC_PRESETS = [
    "Walk through my investments",
    "Retirement readiness check",
    "Taxes & liquidity planning",
    "Education/529 plan",
    "Estate & beneficiaries",
    "Something else (I’ll type it)",
  ];
  const [nextTopicPreset, setNextTopicPreset] = useState("");
  const [nextTopicText, setNextTopicText]     = useState("");

  const netWorthBand = useMemo(
    () =>
      computeNetWorthBand({
        cash: cashBand,
        investments: investmentsBand,
        retirement: retirementBand,
        realEstate: realEstateBand,
        otherAssets: otherAssetsBand,
        debts: debtsBand,
      }),
    [cashBand, investmentsBand, retirementBand, realEstateBand, otherAssetsBand, debtsBand]
  );

  // Derived legacy fields for your API
  const liquidAssetsBand   = useMemo(() => combineTwo(cashBand, investmentsBand), [cashBand, investmentsBand]);
  const illiquidAssetsBand = useMemo(() => combineTwo(realEstateBand, otherAssetsBand), [realEstateBand, otherAssetsBand]);

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleMulti(list: string[], value: string, setter: (v: string[]) => void) {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else setter([...list, value]);
  }

  async function onSubmit() {
    setErr("");

    // ✅ Bulletproofing: require token and minimal identifiers before POST
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      setErr("Missing intake token in URL. Please use your personalized link.");
      return;
    }
    if (!firstName && !lastName && !email) {
      setErr("Please provide at least a name or an email.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      const conversation = nextTopicPreset === "Something else (I’ll type it)"
        ? nextTopicText
        : nextTopicPreset;

      const body = {
        // identifiers
        fullName, firstName, lastName, email, phone,

        // employment & income
        employmentStatus: normalize(employmentStatus),
        employerName,
        annualIncomeBand: normalize(annualIncomeBand),
        sourceOfFunds: sourceOfFunds.join(", "),

        // assets/liabilities & derived bands
        liquidAssetsBand,
        illiquidAssetsBand,
        liabilitiesBand: normalize(debtsBand),
        netWorthBand,

        // account flags
        hasIRA: accounts.some(a => ["Roth IRA", "Traditional IRA"].includes(a)),
        has401k: accounts.includes("401(k)"),
        hasTaxable: accounts.includes("Brokerage"),
        hasCrypto: accounts.includes("Crypto"),
        hasRealEstate: accounts.includes("Real Estate"),

        // goals & risk
        riskTolerance: normalize(riskTolerance),
        timeHorizon: normalize(timeHorizon),
        primaryGoals: primaryGoals.map(normalize),
        liquidityNeeds: normalize(liquidityNeeds),
        constraints: constraints.map(normalize),
        investmentExperience: normalize(investmentExperience),

        // identity (demo)
        ssn, // last-4 for demo
        idDocType: normalize(idDocType) || null,
        idDocUrl: idDocUrl || null,

        // store “next conversation topic” into concernsNarrative (no schema change)
        concernsNarrative: conversation?.trim() || null,

        consentAccepted,
      };

      const res = await fetch(`/api/onboarding/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Submission failed (${res.status}).`);
      }

      alert("Submitted! Thanks.");
      window.location.href = "/";
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <Stepper step={step} />

      {/* Hard fail visible if token is absent */}
      {!token && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Error: No intake token detected. Please use the personalized link from your advisor.
        </div>
      )}

      {step === 0 && (
        <Card title="About you">
          <Grid>
            <Input label="First name" value={firstName} onChange={setFirstName} required />
            <Input label="Last name"  value={lastName}  onChange={setLastName} required />
            <Input label="Email"      value={email}     onChange={setEmail} type="email" required />
            <Input label="Phone"      value={phone}     onChange={setPhone} />
          </Grid>
          <Nav step={step} setStep={setStep} canNext={!!(firstName && lastName && email)} />
        </Card>
      )}

      {step === 1 && (
        <Card title="Work & income">
          <Grid>
            <Select
              label="Employment status"
              value={employmentStatus}
              onChange={setEmploymentStatus}
              options={EMPLOYMENT_OPTIONS}
              required
              tooltip="Your current work situation."
            />
            <div className="sm:col-span-2 -mt-2">
              <FlagThisField token={token} email={email} fieldKey="employmentStatus" className="mt-1" />
            </div>

            <Input  label="Employer name" value={employerName} onChange={setEmployerName} />

            <Select
              label="Annual income (range)"
              value={annualIncomeBand}
              onChange={setAnnualIncomeBand}
              options={INCOME_RANGE}
              money
              required
            />
            <div className="sm:col-span-2 -mt-2">
              <FlagThisField token={token} email={email} fieldKey="annualIncomeBand" className="mt-1" />
            </div>

            <Multi
              label="Source of funds (select all that apply)"
              values={sourceOfFunds}
              onToggle={(v)=>toggleMulti(sourceOfFunds, v, setSourceOfFunds)}
              options={SOURCE_OF_FUNDS}
            />
          </Grid>
          <Nav step={step} setStep={setStep} canNext={!!(employmentStatus && annualIncomeBand)} />
        </Card>
      )}

      {step === 2 && (
        <Card title="Assets & accounts">
          <Grid>
            <AmountOrSelect
              label={ASSET_BUCKETS.cash}
              valueBand={cashBand}
              setValueBand={setCashBand}
              tooltip="Checking/savings."
            />
            <AmountOrSelect
              label={ASSET_BUCKETS.investments}
              valueBand={investmentsBand}
              setValueBand={setInvestmentsBand}
              tooltip="Brokerage, ETFs, stocks, bonds."
            />
            <AmountOrSelect
              label={ASSET_BUCKETS.retirement}
              valueBand={retirementBand}
              setValueBand={setRetirementBand}
              tooltip="401(k), IRA, etc."
            />
            <AmountOrSelect
              label={ASSET_BUCKETS.realEstate}
              valueBand={realEstateBand}
              setValueBand={setRealEstateBand}
              tooltip="Estimate equity (value minus mortgage)."
            />
            <AmountOrSelect
              label={ASSET_BUCKETS.otherAssets}
              valueBand={otherAssetsBand}
              setValueBand={setOtherAssetsBand}
              tooltip="Private investments, collectibles, vested options, etc."
            />
            <AmountOrSelect
              label={ASSET_BUCKETS.debts}
              valueBand={debtsBand}
              setValueBand={setDebtsBand}
              tooltip="Mortgage balance, student/auto loans, cards."
            />
          </Grid>

          <div className="mt-4 rounded-md border p-3 text-sm">
            <div className="font-medium">Estimated Net Worth (auto)</div>
            <div className="mt-1">
              Band: <span className="font-mono">{formatMoney(netWorthBand)}</span>
            </div>
          </div>

          <div className="mt-4">
            <Multi label="Accounts (select all that apply)" values={accounts} onToggle={(v)=>toggleMulti(accounts, v, setAccounts)} options={ACCOUNT_TYPES} />
          </div>

          <Nav step={step} setStep={setStep} canNext />
        </Card>
      )}

      {step === 3 && (
        <Card title="Goals & risk">
          <Grid>
            <Select label="Risk tolerance"  value={riskTolerance} onChange={setRiskTolerance} options={RISK_OPTIONS} required />
            <Select label="Time horizon"    value={timeHorizon}   onChange={setTimeHorizon}   options={TIME_HORIZON} required tooltip="When you expect to use this money." />
            <RiskHorizonNineBox risk={riskTolerance} horizon={timeHorizon} />

            <Multi  label="Primary goals (select all that apply)" values={primaryGoals} onToggle={(v)=>toggleMulti(primaryGoals, v, setPrimaryGoals)} options={PRIMARY_GOALS} />

            <Select label="Liquidity needs" value={liquidityNeeds} onChange={setLiquidity} options={LIQUIDITY_NEEDS} tooltip="How quickly you might need cash without large losses." />
            <div className="sm:col-span-2 -mt-2">
              <FlagThisField token={token} email={email} fieldKey="liquidityNeeds" className="mt-1" />
            </div>

            <Multi  label="Preferences & restrictions (optional)" values={constraints} onToggle={(v)=>toggleMulti(constraints, v, setConstraints)} options={CONSTRAINTS} />
            <div className="sm:col-span-2 -mt-2">
              <FlagThisField token={token} email={email} fieldKey="constraints" className="mt-1" />
            </div>

            <Select label="Investment experience" value={investmentExperience} onChange={setExperience} options={EXPERIENCE} />

            {/* Next conversation topic */}
            <div className="sm:col-span-2">
              <div className="mb-1 text-slate-700 text-sm">What would you like to discuss next?</div>
              <select
                className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={nextTopicPreset}
                onChange={(e)=>setNextTopicPreset(e.target.value)}
              >
                <option value="">Select…</option>
                {NEXT_TOPIC_PRESETS.map((o)=> <option key={o} value={o}>{o}</option>)}
              </select>
              {nextTopicPreset === "Something else (I’ll type it)" && (
                <textarea
                  className="mt-2 w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  rows={3}
                  placeholder="Tell your advisor what you’d like to cover…"
                  value={nextTopicText}
                  onChange={(e)=>setNextTopicText(e.target.value)}
                />
              )}
            </div>
          </Grid>
          <Nav step={step} setStep={setStep} canNext />
        </Card>
      )}

      {step === 4 && (
        <Card title="Identity (demo)">
          <p className="mb-3 text-sm text-gray-600">
            For demo, SSN <strong>last-4</strong> is fine. Document field is optional. (In production, we’ll use a KYC provider and never store files directly.)
          </p>
          <Grid>
            <Input label="SSN (last-4)" value={ssn} onChange={setSSN} maxLength={4} />
            <Select label="ID document type (optional)" value={idDocType} onChange={setIdDocType} options={ID_DOC_TYPES} />
            <Input label="ID document URL (optional)" value={idDocUrl} onChange={setIdDocUrl} />
          </Grid>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={consentAccepted} onChange={e=>setConsent(e.target.checked)} />
            <span>I consent to data processing & e-signature.</span>
          </label>

          <Nav step={step} setStep={setStep} canNext={consentAccepted} />
        </Card>
      )}

      {step === 5 && (
        <Card title="Review & submit">
          <Summary
            sections={[
              {
                title: "About you",
                rows: [
                  ["Name", `${firstName} ${lastName}`.trim() || "—"],
                  ["Email", email || "—"],
                  ["Phone", phone || "—"],
                ],
              },
              {
                title: "Work & income",
                rows: [
                  ["Employment", employmentStatus || "—"],
                  ["Employer", employerName || "—"],
                  ["Income", moneyify(annualIncomeBand)],
                  ["Source of funds", sourceOfFunds.join(", ") || "—"],
                ],
              },
              {
                title: "Assets & accounts",
                rows: [
                  [ASSET_BUCKETS.cash,        moneyify(cashBand)],
                  [ASSET_BUCKETS.investments, moneyify(investmentsBand)],
                  [ASSET_BUCKETS.retirement,  moneyify(retirementBand)],
                  [ASSET_BUCKETS.realEstate,  moneyify(realEstateBand)],
                  [ASSET_BUCKETS.otherAssets, moneyify(otherAssetsBand)],
                  [ASSET_BUCKETS.debts,       moneyify(debtsBand)],
                  ["Estimated net worth", formatMoney(netWorthBand)],
                  ["Accounts", accounts.join(", ") || "—"],
                ],
              },
              {
                title: "Goals & risk",
                rows: [
                  ["Risk tolerance", riskTolerance || "—"],
                  ["Time horizon", timeHorizon || "—"],
                  ["Primary goals", primaryGoals.join(", ") || "—"],
                  ["Liquidity needs", liquidityNeeds || "—"],
                  ["Preferences / restrictions", constraints.join(", ") || "—"],
                  ["Experience", investmentExperience || "—"],
                ],
              },
              {
                title: "Next conversation",
                rows: [
                  ["Topic", (nextTopicPreset === "Something else (I’ll type it)" ? nextTopicText : nextTopicPreset) || "—"],
                ],
              },
            ]}
          />

          {err && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button className="btn-secondary" onClick={()=>setStep((s)=>((s-1) as Step))}>Back</button>
            <button className="btn-primary" onClick={onSubmit} disabled={submitting || !token}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ================= UI bits ================= */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-base font-medium text-slate-900">{title}</div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Input({
  label, value, onChange, type="text", required, maxLength
}: {
  label: string; value: string; onChange: (v: string)=>void; type?: string; required?: boolean; maxLength?: number;
}) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-slate-700">{label}{required ? " *" : ""}</div>
      <input
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
        value={value}
        onChange={e=>onChange(e.target.value)}
        type={type}
        required={required}
        maxLength={maxLength}
      />
    </label>
  );
}

function Select({
  label, value, onChange, options, required, tooltip, money
}: {
  label: string; value: string; onChange: (v: string)=>void; options: string[]; required?: boolean; tooltip?: string; money?: boolean;
}) {
  return (
    <label className="text-sm">
      <div className="mb-1 flex items-center gap-2 text-slate-700">
        <span>{label}{required ? " *" : ""}</span>
        {tooltip ? <span title={tooltip} className="cursor-help text-xs text-slate-500">ⓘ</span> : null}
      </div>
      <select
        className="w-full rounded-md border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
        value={value}
        onChange={e=>onChange(e.target.value)}
        required={required}
      >
        <option value="">Select…</option>
        {options.map((o)=> (
          <option key={o} value={o}>
            {money ? formatMoney(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Multi({
  label, values, onToggle, options
}: {
  label: string; values: string[]; onToggle: (v: string)=>void; options: string[];
}) {
  return (
    <div className="text-sm sm:col-span-2">
      <div className="mb-1 text-slate-700">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={()=>onToggle(o)}
              className={`rounded-full border px-3 py-1 ${active ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Nav({ step, setStep, canNext }: { step: Step; setStep: (s: Step)=>void; canNext: boolean }) {
  return (
    <div className="mt-4 flex gap-2">
      {step > 0 && <button className="btn-secondary" onClick={()=>setStep(((step-1) as Step))}>Back</button>}
      <button className="btn-primary disabled:opacity-50" disabled={!canNext} onClick={()=>setStep(((step+1) as Step))}>
        Continue
      </button>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["About you","Work & income","Assets & accounts","Goals & risk","Identity verify","Review & submit"];
  return (
    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
      {steps.map((s, i)=> (
        <span key={s} className={`rounded-full px-2 py-1 ${i === step ? "bg-black text-white" : "bg-gray-100"}`}>{s}</span>
      ))}
    </div>
  );
}

function Summary({ sections }: { sections: { title: string; rows: [string,string][] }[] }) {
  return (
    <div className="space-y-4">
      {sections.map((sec) => (
        <div key={sec.title} className="rounded-xl border p-4">
          <div className="mb-2 text-sm font-medium">{sec.title}</div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {sec.rows.map(([k,v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-slate-600">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}