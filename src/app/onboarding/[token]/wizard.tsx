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

type Step = 0 | 1 | 2 | 3 | 4 | 5;

export default function Wizard({ token }: { token: string }) {
  const [step, setStep] = useState<Step>(0);

  // ---- Form state (simple) ----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");

  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [employerName, setEmployerName]         = useState("");
  const [annualIncomeBand, setAnnualIncomeBand] = useState<string>("");
  const [sourceOfFunds, setSourceOfFunds]       = useState<string[]>([]); // multi

  // Assets in plain English
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
  const [ssn, setSSN]                     = useState(""); // last-4 ok
  const [idDocType, setIdDocType]         = useState<string>("");
  const [idDocUrl, setIdDocUrl]           = useState("");
  const [proofOfAddressUrl, setPoAUrl]    = useState("");
  const [consentAccepted, setConsent]     = useState(false);

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

  // Derived legacy fields to fit your API without DB changes
  const liquidAssetsBand   = useMemo(() => combineTwo(cashBand, investmentsBand), [cashBand, investmentsBand]);
  const illiquidAssetsBand = useMemo(() => combineTwo(realEstateBand, otherAssetsBand), [realEstateBand, otherAssetsBand]);

  const [err, setErr] = useState("");

  function toggleMulti(list: string[], value: string, setter: (v: string[]) => void) {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else setter([...list, value]);
  }

  async function onSubmit() {
    setErr("");
    try {
      const body = {
        firstName,
        lastName,
        email,
        phone,

        // employment / funds (join multi for now)
        employmentStatus: normalize(employmentStatus),
        employerName,
        annualIncomeBand: normalize(annualIncomeBand),
        sourceOfFunds: sourceOfFunds.join(", "), // keep as string for now

        // assets mapped back to legacy names your API expects
        liquidAssetsBand,
        illiquidAssetsBand,
        liabilitiesBand: normalize(debtsBand),
        netWorthBand,

        // account presence booleans derived from multi
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

        // identity (demo-friendly)
        ssn, // last-4 is fine; API encrypts or just stores nulls if key missing
        idDocType: normalize(idDocType) || null,
        idDocUrl: idDocUrl || null,
        proofOfAddressUrl: proofOfAddressUrl || null,

        consentAccepted,
      };

      const res = await fetch(`/api/onboarding/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Submission failed");
      }

      const j = await res.json();
      // simple success state
      alert("Submitted! Thanks.");
      window.location.href = "/"; // or a success page
    } catch (e: any) {
      setErr(e?.message || String(e));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <Stepper step={step} />
      {step === 0 && (
        <Card title="About you">
          <Grid>
            <Input label="First name" value={firstName} onChange={setFirstName} required />
            <Input label="Last name"  value={lastName}  onChange={setLastName} required />
            <Input label="Email"      value={email}     onChange={setEmail} type="email" required />
            <Input label="Phone"      value={phone}     onChange={setPhone} />
          </Grid>
          <Nav step={step} setStep={setStep} canNext={!!firstName && !!lastName && !!email} />
        </Card>
      )}

      {step === 1 && (
        <Card title="Work & income">
          <Grid>
            <Select label="Employment status" value={employmentStatus} onChange={setEmploymentStatus} options={EMPLOYMENT_OPTIONS} required tooltip="Current work situation." />
            <Input  label="Employer name" value={employerName} onChange={setEmployerName} />
            <Select label="Annual income (range)" value={annualIncomeBand} onChange={setAnnualIncomeBand} options={INCOME_RANGE} required />
            <Multi label="Source of funds (select all that apply)" values={sourceOfFunds} onToggle={(v)=>toggleMulti(sourceOfFunds, v, setSourceOfFunds)} options={SOURCE_OF_FUNDS} />
          </Grid>
          <Nav step={step} setStep={setStep} canNext={!!employmentStatus && !!annualIncomeBand} />
        </Card>
      )}

      {step === 2 && (
        <Card title="Assets & accounts">
          <Grid>
            <Select label={ASSET_BUCKETS.cash}        value={cashBand}        onChange={setCashBand}        options={RANGE_STD} tooltip="Checking/savings." />
            <Select label={ASSET_BUCKETS.investments} value={investmentsBand} onChange={setInvestmentsBand} options={RANGE_STD} tooltip="Brokerage, ETFs, stocks, bonds." />
            <Select label={ASSET_BUCKETS.retirement}  value={retirementBand}  onChange={setRetirementBand}  options={RANGE_STD} tooltip="401(k), IRA, etc." />
            <Select label={ASSET_BUCKETS.realEstate}  value={realEstateBand}  onChange={setRealEstateBand}  options={RANGE_STD} tooltip="Estimate equity, not market value." />
            <Select label={ASSET_BUCKETS.otherAssets} value={otherAssetsBand} onChange={setOtherAssetsBand} options={RANGE_STD} />
            <Select label={ASSET_BUCKETS.debts}       value={debtsBand}       onChange={setDebtsBand}       options={RANGE_STD} tooltip="Mortgage balance, loans, credit cards." />
          </Grid>

          <div className="mt-4 rounded-md border p-3 text-sm">
            <div className="font-medium">Estimated Net Worth (auto)</div>
            <div className="mt-1">Net Worth Band: <span className="font-mono">{netWorthBand}</span></div>
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
            <Multi  label="Primary goals (select all that apply)" values={primaryGoals} onToggle={(v)=>toggleMulti(primaryGoals, v, setPrimaryGoals)} options={PRIMARY_GOALS} />
            <Select label="Liquidity needs" value={liquidityNeeds} onChange={setLiquidity} options={LIQUIDITY_NEEDS} tooltip="How quickly you might need cash without large losses." />
            <Multi  label="Constraints / preferences" values={constraints} onToggle={(v)=>toggleMulti(constraints, v, setConstraints)} options={CONSTRAINTS} />
            <Select label="Investment experience" value={investmentExperience} onChange={setExperience} options={EXPERIENCE} />
          </Grid>
          <Nav step={step} setStep={setStep} canNext />
        </Card>
      )}

      {step === 4 && (
        <Card title="Identity (demo)">
          <p className="mb-3 text-sm text-gray-600">
            For demo, SSN <strong>last-4</strong> is fine. Document fields are optional.
          </p>
          <Grid>
            <Input label="SSN (last-4)" value={ssn} onChange={setSSN} maxLength={4} />
            <Select label="ID document type (optional)" value={idDocType} onChange={setIdDocType} options={ID_DOC_TYPES} />
            <Input label="ID document URL (optional)" value={idDocUrl} onChange={setIdDocUrl} />
            <Input label="Proof of address URL (optional)" value={proofOfAddressUrl} onChange={setPoAUrl} />
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
          <div className="rounded-md border bg-white p-3 text-sm">
            <pre className="max-h-96 whitespace-pre-wrap">{JSON.stringify({
              firstName, lastName, email, phone,
              employmentStatus, employerName, annualIncomeBand, sourceOfFunds,
              cashBand, investmentsBand, retirementBand, realEstateBand, otherAssetsBand, debtsBand,
              netWorthBand, accounts,
              riskTolerance, timeHorizon, primaryGoals, liquidityNeeds, constraints, investmentExperience,
              ssn, idDocType, idDocUrl, proofOfAddressUrl, consentAccepted,
            }, null, 2)}</pre>
          </div>

          {err && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button className="btn-secondary" onClick={()=>setStep((s)=>((s-1) as Step))}>Back</button>
            <button className="btn-primary" onClick={onSubmit}>Submit</button>
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
  label, value, onChange, options, required, tooltip
}: {
  label: string; value: string; onChange: (v: string)=>void; options: string[]; required?: boolean; tooltip?: string;
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
        {options.map((o)=> <option key={o} value={o}>{o}</option>)}
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

/* ============ Helpers ============ */

// Combine two user-facing range labels into one rough band (pick the larger bucket).
function combineTwo(a?: string, b?: string) {
  const ranks = ["<100k","100-250k","250-500k","500k-1M","1-3M","3M+"];
  const ra = ranks.indexOf(a || "");
  const rb = ranks.indexOf(b || "");
  const idx = Math.max(ra, rb);
  return idx >= 0 ? ranks[idx] : "";
}

// Normalize to lower_snake-ish strings the API used previously (safe/no-op if you later not need it)
function normalize(label: string): string {
  if (!label) return "";
  return label
    .replace(/[–—]/g, "-")
    .replace(/\s*\(\S.*?\)\s*/g, "")   // strip parenthetical hints
    .replace(/\s+/g, "_")
    .replace(/[^\w+-]/g, "")
    .toLowerCase();
}