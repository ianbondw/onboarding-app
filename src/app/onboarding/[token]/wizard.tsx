"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Step = "basic" | "employment" | "wealth" | "suitability" | "kyc" | "review";

const incomeBands = ["<50k", "50-100k", "100-250k", "250-500k", "500k+"];
const wealthBands  = ["<100k", "100-250k", "250-500k", "500k-1M", "1M+"];
const riskOptions  = ["conservative", "moderate", "growth", "aggressive"];
const horizon      = ["<3y", "3-5y", "5-10y", "10+y"];
const goals        = ["retirement", "income", "growth", "education", "legacy", "tax"];

export default function Wizard() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState<Step>("basic");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    firstName:"", lastName:"", email:"", phone:"",
    dateOfBirth:"", addressLine1:"", addressLine2:"", city:"", state:"", postalCode:"", country:"US", citizenship:"US",
    employmentStatus:"", employerName:"", annualIncomeBand:"", sourceOfFunds:"",
    liquidAssetsBand:"", illiquidAssetsBand:"", liabilitiesBand:"", netWorthBand:"",
    hasIRA:false, has401k:false, hasTaxable:true, hasCrypto:false, hasRealEstate:false,
    riskTolerance:"", timeHorizon:"", primaryGoals:[] as string[], liquidityNeeds:"", constraints:[] as string[], investmentExperience:"",
    ssn:"", idDocType:"", idDocUrl:"", proofOfAddressUrl:"", consentAccepted:false,
  });

  function next() {
    setStep(s => s==="basic"?"employment": s==="employment"?"wealth": s==="wealth"?"suitability": s==="suitability"?"kyc":"review");
  }
  function prev() {
    setStep(s => s==="review"?"kyc": s==="kyc"?"suitability": s==="suitability"?"wealth": s==="wealth"?"employment":"basic");
  }

  const canContinue = useMemo(() => {
    if (step === "basic") return form.firstName && form.lastName && form.email;
    if (step === "suitability") return form.riskTolerance && form.timeHorizon && (form.primaryGoals?.length > 0);
    if (step === "kyc") return !!form.consentAccepted;
    return true;
  }, [step, form]);

  async function submit() {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch(`/api/onboarding/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");
      setMsg("Submitted. Your advisor will review recommendations shortly.");
    } catch (e:any) { setMsg(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-3xl">
        {/* Stepper */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          {(["basic","employment","wealth","suitability","kyc","review"] as Step[]).map((s) => (
            <span key={s}
              className={`rounded-full px-3 py-1 ${step===s ? "bg-slate-900 text-white" : "bg-white text-slate-700 border"}`}>
              {s}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-card">
          <h2 className="text-xl font-medium">Client Onboarding</h2>
          <p className="mt-1 text-sm text-slate-600">We ask only what’s needed. Your data is encrypted and used to tailor recommendations.</p>

          <div className="mt-6 space-y-4">
            {step === "basic" && (
              <>
                <Row>
                  <Input label="First name" v={form.firstName} set={(v)=>setForm({...form, firstName:v})}/>
                  <Input label="Last name"  v={form.lastName}  set={(v)=>setForm({...form, lastName:v})}/>
                </Row>
                <Row>
                  <Input label="Email" type="email" v={form.email} set={(v)=>setForm({...form, email:v})}/>
                  <Input label="Phone" v={form.phone} set={(v)=>setForm({...form, phone:v})}/>
                </Row>
                <Row>
                  <Input label="Date of birth" type="date" v={form.dateOfBirth} set={(v)=>setForm({...form, dateOfBirth:v})}/>
                  <Input label="Citizenship" v={form.citizenship} set={(v)=>setForm({...form, citizenship:v})}/>
                </Row>
                <Input label="Address line 1" v={form.addressLine1} set={(v)=>setForm({...form, addressLine1:v})}/>
                <Input label="Address line 2" v={form.addressLine2} set={(v)=>setForm({...form, addressLine2:v})}/>
                <Row>
                  <Input label="City" v={form.city} set={(v)=>setForm({...form, city:v})}/>
                  <Input label="State" v={form.state} set={(v)=>setForm({...form, state:v})}/>
                  <Input label="Postal code" v={form.postalCode} set={(v)=>setForm({...form, postalCode:v})}/>
                </Row>
              </>
            )}

            {step === "employment" && (
              <>
                <Select label="Employment status" v={form.employmentStatus} set={(v)=>setForm({...form, employmentStatus:v})}
                        opts={["employed","self_employed","student","retired","unemployed"]}/>
                <Input label="Employer name" v={form.employerName} set={(v)=>setForm({...form, employerName:v})}/>
                <Select label="Annual income (range)" v={form.annualIncomeBand} set={(v)=>setForm({...form, annualIncomeBand:v})} opts={incomeBands}/>
                <Select label="Source of funds" v={form.sourceOfFunds} set={(v)=>setForm({...form, sourceOfFunds:v})}
                        opts={["salary","business","inheritance","asset_sale","other"]}/>
              </>
            )}

            {step === "wealth" && (
              <>
                <Select label="Liquid assets (range)" v={form.liquidAssetsBand} set={(v)=>setForm({...form, liquidAssetsBand:v})} opts={wealthBands}/>
                <Select label="Illiquid assets (range)" v={form.illiquidAssetsBand} set={(v)=>setForm({...form, illiquidAssetsBand:v})} opts={wealthBands}/>
                <Select label="Liabilities (range)" v={form.liabilitiesBand} set={(v)=>setForm({...form, liabilitiesBand:v})} opts={wealthBands}/>
                <Select label="Estimated net worth (range)" v={form.netWorthBand} set={(v)=>setForm({...form, netWorthBand:v})} opts={wealthBands}/>
                <Row>
                  <Check label="Has IRA"         c={form.hasIRA}        set={(v)=>setForm({...form, hasIRA:v})}/>
                  <Check label="Has 401k"        c={form.has401k}       set={(v)=>setForm({...form, has401k:v})}/>
                  <Check label="Taxable account" c={form.hasTaxable}    set={(v)=>setForm({...form, hasTaxable:v})}/>
                  <Check label="Crypto"          c={form.hasCrypto}     set={(v)=>setForm({...form, hasCrypto:v})}/>
                  <Check label="Real estate"     c={form.hasRealEstate} set={(v)=>setForm({...form, hasRealEstate:v})}/>
                </Row>
              </>
            )}

            {step === "suitability" && (
              <>
                <Select label="Risk tolerance" v={form.riskTolerance} set={(v)=>setForm({...form, riskTolerance:v})} opts={riskOptions}/>
                <Select label="Time horizon"   v={form.timeHorizon}   set={(v)=>setForm({...form, timeHorizon:v})}   opts={horizon}/>
                <Multi  label="Primary goals"  arr={form.primaryGoals} setArr={(v)=>setForm({...form, primaryGoals:v})} opts={goals}/>
                <Select label="Liquidity needs" v={form.liquidityNeeds} set={(v)=>setForm({...form, liquidityNeeds:v})} opts={["none","some","high"]}/>
                <Multi  label="Constraints"     arr={form.constraints}  setArr={(v)=>setForm({...form, constraints:v})}  opts={["no_leverage","esg_only"]}/>
                <Select label="Investment experience" v={form.investmentExperience} set={(v)=>setForm({...form, investmentExperience:v})}
                        opts={["none","basic","intermediate","advanced"]}/>
              </>
            )}

            {step === "kyc" && (
              <>
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <strong>Why we ask for SSN/ID:</strong> to verify identity and fulfill tax/reg obligations.
                </div>
                <Input label="SSN (9 digits)" placeholder="***-**-****" v={form.ssn} set={(v)=>setForm({...form, ssn:v})}/>
                <Select label="ID document type" v={form.idDocType} set={(v)=>setForm({...form, idDocType:v})} opts={["driver_license","passport","other"]}/>
                <Input label="ID document URL (optional for demo)" v={form.idDocUrl} set={(v)=>setForm({...form, idDocUrl:v})}/>
                <Input label="Proof of address URL (optional for demo)" v={form.proofOfAddressUrl} set={(v)=>setForm({...form, proofOfAddressUrl:v})}/>
                <div className="mt-1">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" className="chk" checked={form.consentAccepted} onChange={(e)=>setForm({...form, consentAccepted:e.target.checked})}/>
                    <span>I consent to data processing & e-signature.</span>
                  </label>
                </div>
              </>
            )}

            {step === "review" && (
              <div className="rounded-lg border p-4 text-sm">
                <p className="mb-2 text-slate-700">Review your info. When you submit, we’ll generate advisor-ready recommendations.</p>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-slate-50 p-3">{JSON.stringify(form, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            {step !== "basic" && <button onClick={prev} className="btn-secondary">Back</button>}
            {step !== "review" && (
              <button onClick={next} disabled={!canContinue}
                className={`btn-primary ${!canContinue ? "opacity-60 cursor-not-allowed" : ""}`}>
                Continue
              </button>
            )}
            {step === "review" && (
              <button onClick={submit} disabled={loading} className="btn-primary">
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>

          {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
function Input({ label, v, set, type="text", placeholder }:{
  label:string; v:string; set:(s:string)=>void; type?:string; placeholder?:string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <input className="input" type={type} value={v} placeholder={placeholder} onChange={(e)=>set(e.target.value)} />
    </label>
  );
}
function Select({ label, v, set, opts }:{
  label:string; v:string; set:(s:string)=>void; opts:string[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <select className="select" value={v} onChange={(e)=>set(e.target.value)}>
        <option value="">Select…</option>
        {opts.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Check({ label, c, set }:{ label:string; c:boolean; set:(b:boolean)=>void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" className="chk" checked={c} onChange={(e)=>set(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
function Multi({ label, arr, setArr, opts }:{
  label:string; arr:string[]; setArr:(v:string[])=>void; opts:string[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 inline-block text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {opts.map(o=>{
          const active = arr.includes(o);
          return (
            <button key={o} type="button"
              onClick={()=>setArr(active ? arr.filter(v=>v!==o) : [...arr, o])}
              className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-slate-900 text-white" : "bg-white"}`}>
              {o}
            </button>
          );
        })}
      </div>
    </label>
  );
}