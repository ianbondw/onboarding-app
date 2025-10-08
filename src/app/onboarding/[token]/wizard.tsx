// src/app/onboarding/[token]/wizard.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Step = "basic" | "employment" | "wealth" | "suitability" | "kyc" | "review";

const incomeBands = ["<50k", "50-100k", "100-250k", "250-500k", "500k+"];
const wealthBands = ["<100k", "100-250k", "250-500k", "500k-1M", "1M+"];
const riskOptions = ["conservative", "moderate", "growth", "aggressive"];
const horizon = ["<3y", "3-5y", "5-10y", "10+y"];
const goals = ["retirement", "income", "growth", "education", "legacy", "tax"];

export default function Wizard() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<Step>("basic");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    // Basic
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "US",
    citizenship: "US",
    // Employment
    employmentStatus: "", employerName: "", annualIncomeBand: "", sourceOfFunds: "",
    // Wealth
    liquidAssetsBand: "", illiquidAssetsBand: "", liabilitiesBand: "", netWorthBand: "",
    hasIRA: false, has401k: false, hasTaxable: true, hasCrypto: false, hasRealEstate: false,
    // Suitability
    riskTolerance: "", timeHorizon: "", primaryGoals: [] as string[], liquidityNeeds: "", constraints: [] as string[], investmentExperience: "",
    // KYC
    ssn: "", idDocType: "", idDocUrl: "", proofOfAddressUrl: "", consentAccepted: false,
  });

  function next() {
    setStep((s) =>
      s === "basic" ? "employment" :
      s === "employment" ? "wealth" :
      s === "wealth" ? "suitability" :
      s === "suitability" ? "kyc" :
      s === "kyc" ? "review" : "review"
    );
  }
  function prev() {
    setStep((s) =>
      s === "review" ? "kyc" :
      s === "kyc" ? "suitability" :
      s === "suitability" ? "wealth" :
      s === "wealth" ? "employment" :
      "basic"
    );
  }

  const canContinue = useMemo(() => {
    if (step === "basic") {
      return form.firstName && form.lastName && form.email;
    }
    if (step === "suitability") {
      return form.riskTolerance && form.timeHorizon && (form.primaryGoals?.length > 0);
    }
    if (step === "kyc") {
      return !!form.consentAccepted; // SSN asked late; consent required here
    }
    return true;
  }, [step, form]);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/onboarding/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");

      setMsg("Onboarding submitted. Your advisor will review recommendations shortly.");
      // you could navigate to /onboarding/[token]/done here if you have it
      // router.push(`/onboarding/${token}/done`);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-medium">Client Onboarding</h2>
      <p className="text-sm text-slate-600">
        We ask only what’s needed. Your data is encrypted and used to tailor recommendations.
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs">
        {["basic","employment","wealth","suitability","kyc","review"].map((s) => (
          <span key={s} className={`rounded-full px-2 py-1 ${step===s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>{s}</span>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {step === "basic" && (
          <>
            <Row>
              <Input label="First name" value={form.firstName} onChange={(v)=>setForm({...form, firstName:v})} />
              <Input label="Last name" value={form.lastName} onChange={(v)=>setForm({...form, lastName:v})} />
            </Row>
            <Row>
              <Input label="Email" type="email" value={form.email} onChange={(v)=>setForm({...form, email:v})} />
              <Input label="Phone" value={form.phone} onChange={(v)=>setForm({...form, phone:v})} />
            </Row>
            <Row>
              <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={(v)=>setForm({...form, dateOfBirth:v})} />
              <Input label="Citizenship" value={form.citizenship} onChange={(v)=>setForm({...form, citizenship:v})} />
            </Row>
            <Input label="Address line 1" value={form.addressLine1} onChange={(v)=>setForm({...form, addressLine1:v})} />
            <Input label="Address line 2" value={form.addressLine2} onChange={(v)=>setForm({...form, addressLine2:v})} />
            <Row>
              <Input label="City" value={form.city} onChange={(v)=>setForm({...form, city:v})} />
              <Input label="State" value={form.state} onChange={(v)=>setForm({...form, state:v})} />
              <Input label="Postal code" value={form.postalCode} onChange={(v)=>setForm({...form, postalCode:v})} />
            </Row>
          </>
        )}

        {step === "employment" && (
          <>
            <Select label="Employment status" value={form.employmentStatus} onChange={(v)=>setForm({...form, employmentStatus:v})}
              options={["employed","self_employed","student","retired","unemployed"]}/>
            <Input label="Employer name" value={form.employerName} onChange={(v)=>setForm({...form, employerName:v})} />
            <Select label="Annual income (range)" value={form.annualIncomeBand} onChange={(v)=>setForm({...form, annualIncomeBand:v})}
              options={incomeBands}/>
            <Select label="Source of funds" value={form.sourceOfFunds} onChange={(v)=>setForm({...form, sourceOfFunds:v})}
              options={["salary","business","inheritance","asset_sale","other"]}/>
          </>
        )}

        {step === "wealth" && (
          <>
            <Select label="Liquid assets (range)" value={form.liquidAssetsBand} onChange={(v)=>setForm({...form, liquidAssetsBand:v})}
              options={wealthBands}/>
            <Select label="Illiquid assets (range)" value={form.illiquidAssetsBand} onChange={(v)=>setForm({...form, illiquidAssetsBand:v})}
              options={wealthBands}/>
            <Select label="Liabilities (range)" value={form.liabilitiesBand} onChange={(v)=>setForm({...form, liabilitiesBand:v})}
              options={wealthBands}/>
            <Select label="Estimated net worth (range)" value={form.netWorthBand} onChange={(v)=>setForm({...form, netWorthBand:v})}
              options={wealthBands}/>
            <Row>
              <Checkbox label="Has IRA" checked={form.hasIRA} onChange={(v)=>setForm({...form, hasIRA:v})}/>
              <Checkbox label="Has 401k" checked={form.has401k} onChange={(v)=>setForm({...form, has401k:v})}/>
              <Checkbox label="Taxable account" checked={form.hasTaxable} onChange={(v)=>setForm({...form, hasTaxable:v})}/>
              <Checkbox label="Crypto" checked={form.hasCrypto} onChange={(v)=>setForm({...form, hasCrypto:v})}/>
              <Checkbox label="Real estate" checked={form.hasRealEstate} onChange={(v)=>setForm({...form, hasRealEstate:v})}/>
            </Row>
          </>
        )}

        {step === "suitability" && (
          <>
            <Select label="Risk tolerance" value={form.riskTolerance} onChange={(v)=>setForm({...form, riskTolerance:v})} options={riskOptions}/>
            <Select label="Time horizon" value={form.timeHorizon} onChange={(v)=>setForm({...form, timeHorizon:v})} options={horizon}/>
            <Multi label="Primary goals" value={form.primaryGoals} onChange={(v)=>setForm({...form, primaryGoals:v})} options={goals}/>
            <Select label="Liquidity needs" value={form.liquidityNeeds} onChange={(v)=>setForm({...form, liquidityNeeds:v})}
              options={["none","some","high"]}/>
            <Multi label="Constraints" value={form.constraints} onChange={(v)=>setForm({...form, constraints:v})}
              options={["no_leverage","esg_only"]}/>
            <Select label="Investment experience" value={form.investmentExperience} onChange={(v)=>setForm({...form, investmentExperience:v})}
              options={["none","basic","intermediate","advanced"]}/>
          </>
        )}

        {step === "kyc" && (
          <>
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
              <strong>Why we ask for SSN/ID:</strong> to verify your identity and fulfill tax and regulatory obligations.
            </div>
            <Input label="SSN (9 digits)" value={form.ssn} maxLength={11}
              placeholder="***-**-****" onChange={(v)=>setForm({...form, ssn:v})}/>
            <Select label="ID document type" value={form.idDocType} onChange={(v)=>setForm({...form, idDocType:v})}
              options={["driver_license","passport","other"]}/>
            <Input label="ID document URL (optional for demo)" value={form.idDocUrl} onChange={(v)=>setForm({...form, idDocUrl:v})}/>
            <Input label="Proof of address URL (optional for demo)" value={form.proofOfAddressUrl} onChange={(v)=>setForm({...form, proofOfAddressUrl:v})}/>
            <Row>
              <Checkbox label="I consent to data processing & e-signature" checked={form.consentAccepted}
                onChange={(v)=>setForm({...form, consentAccepted:v})}/>
            </Row>
          </>
        )}

        {step === "review" && (
          <div className="rounded-lg border p-4 text-sm">
            <p className="mb-2 text-slate-700">Review your info. When you submit, we’ll generate advisor-ready recommendations.</p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-slate-50 p-3">{JSON.stringify(form, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        {step !== "basic" && (
          <button onClick={prev} className="rounded-md border px-4 py-2 text-sm">Back</button>
        )}
        {step !== "review" && (
          <button
            onClick={next}
            disabled={!canContinue}
            className={`rounded-md px-4 py-2 text-sm ${canContinue ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
          >
            Continue
          </button>
        )}
        {step === "review" && (
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>

      {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
function Input({
  label, value, onChange, type = "text", placeholder, maxLength,
}: { label: string; value: string; onChange: (v: string)=>void; type?: string; placeholder?: string; maxLength?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
      />
    </label>
  );
}
function Select({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string)=>void; options: string[] }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Checkbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean)=>void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
function Multi({
  label, value, onChange, options,
}: { label: string; value: string[]; onChange: (v: string[])=>void; options: string[] }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const active = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={()=>onChange(active ? value.filter(v=>v!==o) : [...value, o])}
              className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-slate-900 text-white" : "bg-white"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </label>
  );
}