// src/app/onboarding/[token]/wizard.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import GoalEditor from "@/components/GoalEditor";
import GoalFeasibility from "@/components/GoalFeasibility";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** ---- helpers for amount <-> band mapping ---- **/
const MONEY_BANDS = ["<100k","100-250k","250-500k","500k-1M","1-3M","3M+"] as const;

function toNumberUSD(s: string) {
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
function combineTwo(a?: string, b?: string) {
  const ranks = MONEY_BANDS;
  const ra = ranks.indexOf((a || "") as any);
  const rb = ranks.indexOf((b || "") as any);
  const idx = Math.max(ra, rb);
  return idx >= 0 ? ranks[idx] : "";
}
function normalize(label: string): string {
  if (!label) return "";
  return label
    .replace(/[–—]/g, "-")
    .replace(/\s*\(\S.*?\)\s*/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w+-]/g, "")
    .toLowerCase();
}
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

/** ---- amount or range input ---- **/
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

  // Assets (bands)
  const [cashBand, setCashBand]                 = useState<string>("");
  const [investmentsBand, setInvestmentsBand]   = useState<string>("");
  const [retirementBand, setRetirementBand]     = useState<string>("");
  const [realEstateBand, setRealEstateBand]     = useState<string>("");
  const [otherAssetsBand, setOtherAssetsBand]   = useState<string>("");
  const [debtsBand, setDebtsBand]               = useState<string>("");

  const [accounts, setAccounts] = useState<string[]>([]); // multi

  // Overall goals (per-goal risk/horizon handled next step)
  const [riskTolerance, setRiskTolerance] = useState<string>(""); // kept for defaults/back-compat
  const [timeHorizon, setTimeHorizon]     = useState<string>(""); // kept for defaults/back-compat
  const [primaryGoals, setPrimaryGoals]   = useState<string[]>([]);
  const [liquidityNeeds, setLiquidity]    = useState<string>(""); // optional overall
  const [constraints, setConstraints]     = useState<string[]>([]);
  const [investmentExperience, setExperience] = useState<string>("");

  // Per-goal detail
  type GoalDetail = { risk?: string; horizon?: string; liquidity?: string; amountBand?: string; priority?: boolean };
  const [goalsDetail, setGoalsDetail] = useState<Record<string, GoalDetail>>({});

  // Identity (demo)
  const [dateOfBirth, setDateOfBirth]     = useState("");
  const [ssn, setSSN]                     = useState("");
  const [idDocType, setIdDocType]         = useState<string>("");
  const [consentAccepted, setConsent]     = useState(false);

  // Topics
  const PRESET_TOPICS = [
    "Walk through my investments",
    "Retirement readiness check",
    "Taxes & liquidity planning",
    "Education/529 plan",
    "Estate & beneficiaries",
    "Something else (I’ll type it)",
  ];
  const [topicChips, setTopicChips] = useState<string[]>([]);
  const [topicFree, setTopicFree]   = useState("");
  const [concernsNarrative, setConcernsNarrative] = useState("");

  // Keep goalsDetail keys in sync with selected goals
  useEffect(() => {
    setGoalsDetail(prev => {
      const next = { ...prev };
      for (const g of primaryGoals) {
        if (!next[g]) next[g] = {
          risk: normalize(riskTolerance) || "moderate",
          horizon: normalize(timeHorizon) || "5-10y",
          liquidity: normalize(liquidityNeeds) || "some",
        };
      }
      for (const k of Object.keys(next)) {
        if (!primaryGoals.includes(k)) delete (next as any)[k];
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryGoals]);

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

  const liquidAssetsBand   = useMemo(() => combineTwo(cashBand, investmentsBand), [cashBand, investmentsBand]);
  const illiquidAssetsBand = useMemo(() => combineTwo(realEstateBand, otherAssetsBand), [realEstateBand, otherAssetsBand]);

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function trackEvent(eventType: string, extra?: Record<string, unknown>) {
    if (!token) return;
    try {
      await fetch(`/api/onboarding/${encodeURIComponent(token)}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          eventType,
          step,
          email,
          ...(extra || {}),
        }),
      });
    } catch {
      // analytics must not block onboarding
    }
  }

  useEffect(() => {
    void trackEvent("opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    void trackEvent("step_viewed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function toggleMulti(list: string[], value: string, setter: (v: string[]) => void) {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else setter([...list, value]);
  }

  async function onSubmit() {
    setErr("");

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

      // Topics: chips + free-text + notes → single narrative string
      const mergedTopics = [
        ...topicChips,
        ...(topicFree.trim() ? [topicFree.trim()] : []),
      ].join(", ");
      const concernsOut =
        [mergedTopics, concernsNarrative].filter(Boolean).join("\n\n") || null;

      // If some goals are marked priority, derive primaryGoals from them (back-compat)
      const derivedPrimary = Object.entries(goalsDetail)
        .filter(([, g]) => g?.priority)
        .map(([k]) => k);

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

        // goals (overall risk/horizon optional; per-goal = source of truth)
        riskTolerance: riskTolerance ? normalize(riskTolerance) : undefined,
        timeHorizon: timeHorizon ? normalize(timeHorizon) : undefined,
        primaryGoals: (derivedPrimary.length > 0 ? derivedPrimary : primaryGoals).map(normalize),
        liquidityNeeds: liquidityNeeds ? normalize(liquidityNeeds) : undefined,
        constraints: constraints.map(normalize),
        investmentExperience: normalize(investmentExperience),

        // per-goal detail
        goalsDetail,

        // identity (demo)
        dateOfBirth: dateOfBirth || undefined,
        ssn,
        idDocType: normalize(idDocType) || null,

        // narrative (topics + notes)
        concernsNarrative: concernsOut,

        consentAccepted,
      };

      const res = await fetch(`/api/onboarding/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify(body),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(j?.error || `Submission failed (${res.status}).`);
      }

      await trackEvent("submitted");
      window.location.href = j?.nextUrl || `/onboarding/${encodeURIComponent(token)}/done`;
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <Stepper step={step} />

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
            <AmountOrSelect label={ASSET_BUCKETS.cash}        valueBand={cashBand}        setValueBand={setCashBand}        tooltip="Checking/savings." />
            <AmountOrSelect label={ASSET_BUCKETS.investments} valueBand={investmentsBand} setValueBand={setInvestmentsBand} tooltip="Brokerage, ETFs, stocks, bonds." />
            <AmountOrSelect label={ASSET_BUCKETS.retirement}  valueBand={retirementBand}  setValueBand={setRetirementBand}  tooltip="401(k), IRA, etc." />
            <AmountOrSelect label={ASSET_BUCKETS.realEstate}  valueBand={realEstateBand}  setValueBand={setRealEstateBand}  tooltip="Estimate equity (value minus mortgage)." />
            <AmountOrSelect label={ASSET_BUCKETS.otherAssets} valueBand={otherAssetsBand} setValueBand={setOtherAssetsBand} tooltip="Private investments, collectibles, vested options, etc." />
            <AmountOrSelect label={ASSET_BUCKETS.debts}       valueBand={debtsBand}       setValueBand={setDebtsBand}       tooltip="Mortgage balance, student/auto loans, cards." />
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
        <Card title="Goals">
          <div className="grid gap-3 sm:grid-cols-2">
            <Multi
              label="Primary goals (select all that apply)"
              values={primaryGoals}
              onToggle={(v)=>toggleMulti(primaryGoals, v, setPrimaryGoals)}
              options={PRIMARY_GOALS}
            />

            {/* Removed empty dropdown. Keep real prefs below */}
            <div className="sm:col-span-2">
              <Multi
                label="Preferences & restrictions (optional)"
                values={constraints}
                onToggle={(v)=>toggleMulti(constraints, v, setConstraints)}
                options={CONSTRAINTS}
              />
              <div className="-mt-2">
                <FlagThisField token={token} email={email} fieldKey="constraints" className="mt-1" />
              </div>
            </div>

            <Select
              label="Investment experience"
              value={investmentExperience}
              onChange={setExperience}
              options={EXPERIENCE}
            />
          </div>

          {/* Topics for next meeting (consistent font) */}
          <div className="mt-4">
            <div className="mb-1 text-sm font-medium text-slate-900">Topics for our next meeting</div>
            <div className="mb-2 flex flex-wrap gap-2">
              {PRESET_TOPICS.map((t) => {
                const active = topicChips.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-sm ${active ? "bg-black text-white" : "bg-white hover:bg-gray-50"}`}
                    onClick={() =>
                      setTopicChips((prev) =>
                        prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                      )
                    }
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <input
              className="mb-2 w-full rounded-md border px-3 py-2 text-sm"
              placeholder='Enter a topic not listed (e.g., "Equity comp")'
              value={topicFree}
              onChange={(e)=>setTopicFree(e.target.value)}
            />
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={4}
              value={concernsNarrative}
              onChange={(e)=>setConcernsNarrative(e.target.value)}
              placeholder="Anything else on your mind?"
            />
          </div>

          <Nav step={step} setStep={setStep} canNext />
        </Card>
      )}

      {step === 4 && (
        <Card title="Goal details (per goal)">
          <div className="space-y-4">
            <GoalEditor value={goalsDetail as any} onChange={setGoalsDetail as any} token={token} email={email} />

            {/* NEW: rough feasibility visualization */}
            <GoalFeasibility
              items={Object.entries(goalsDetail).map(([key, d]) => ({
                key,
                label: key,
                risk: d?.risk,
                horizon: d?.horizon,
                liquidity: d?.liquidity,
                amountBand: d?.amountBand,
              }))}
              cashBand={cashBand}
              investmentsBand={investmentsBand}
              retirementBand={retirementBand}
            />
          </div>
          <Nav step={step} setStep={setStep} canNext />
        </Card>
      )}

      {step === 5 && (
        <Card title="Identity (demo)">
          <p className="mb-3 text-sm text-gray-600">
            Submit only the minimum needed for review. For demo, SSN <strong>last four</strong>
            is enough and document type is optional.
          </p>
          <div className="mb-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Secure verification is requested after submit. Do not paste document links, uploads,
            or full SSNs into this form.
          </div>
          <Grid>
            <Input label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
            <Input
              label="SSN (last four)"
              value={ssn}
              onChange={setSSN}
              maxLength={4}
              inputMode="numeric"
              pattern="\\d{4}"
              autoComplete="off"
              placeholder="1234"
            />
            <Select label="ID document type (optional)" value={idDocType} onChange={setIdDocType} options={ID_DOC_TYPES} />
          </Grid>

          <label className="mt-4 flex items-start gap-2 text-sm">
            <input type="checkbox" checked={consentAccepted} onChange={e=>setConsent(e.target.checked)} />
            <span>
              I consent to processing of the information I submit for onboarding, identity review,
              and follow-up. I have reviewed the{" "}
              <Link className="underline" href="/legal/privacy">
                Privacy Policy
              </Link>
              ,{" "}
              <Link className="underline" href="/security">
                Security
              </Link>
              , and{" "}
              <Link className="underline" href="/legal/terms">
                Terms
              </Link>
              .
            </span>
          </label>

          <Nav step={step} setStep={setStep} canNext={consentAccepted} />
        </Card>
      )}

      {step === 6 && (
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
                title: "Goals",
                rows: [
                  ["Primary goals", (primaryGoals.length ? primaryGoals : Object.keys(goalsDetail)).join(", ") || "—"],
                  ["Preferences / restrictions", constraints.join(", ") || "—"],
                  ["Experience", investmentExperience || "—"],
                ],
              },
              {
                title: "Per-goal details",
                rows: Object.keys(goalsDetail).map((g) => ([
                  g,
                  `${goalsDetail[g]?.risk || "(default)"} × ${goalsDetail[g]?.horizon || "(default)"}${
                    goalsDetail[g]?.liquidity ? ` · ${goalsDetail[g]?.liquidity}` : ""
                  }${goalsDetail[g]?.amountBand ? ` · ${goalsDetail[g]?.amountBand}` : ""}${
                    goalsDetail[g]?.priority ? " · priority" : ""
                  }`
                ] as [string, string])),
              },
              {
                title: "Topics for next meeting",
                rows: [
                  ["Selected topics", [...topicChips, ...(topicFree.trim()? [topicFree.trim()]: [])].join(", ") || "—"],
                  ["Notes", concernsNarrative || "—"],
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
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
  inputMode,
  pattern,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  autoComplete?: string;
  placeholder?: string;
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
        inputMode={inputMode}
        pattern={pattern}
        autoComplete={autoComplete}
        placeholder={placeholder}
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
  const steps = ["About you","Work & income","Assets & accounts","Goals","Goal details","Identity verify","Review & submit"];
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
