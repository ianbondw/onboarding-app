"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "@/components/CurrencyInput";
import {
  onboardingSchema,
  defaultValues,
  type OnboardingValues,
} from "@/lib/validations";

type Props = { token: string };

// Simple SSN masker for UX only (validation enforces proper format)
function formatSSN(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 9);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 5);
  const c = digits.slice(5, 9);
  let out = a;
  if (b) out += "-" + b;
  if (c) out += "-" + c;
  return out;
}

export default function Wizard({ token }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const methods = useForm<OnboardingValues>({
    // Force resolver to align with our exact form type (fixes unknown vs number/Date mismatch)
    resolver: zodResolver(onboardingSchema) as unknown as Resolver<OnboardingValues, any>,
    // Schema coerces numbers and dob (Date), so defaults are compatible
    defaultValues: defaultValues as any,
    mode: "onBlur", // don't nag while typing
    reValidateMode: "onSubmit",
    shouldUnregister: false,
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = methods;

  const stepFields: (keyof OnboardingValues)[][] = useMemo(
    () => [
      ["fullName", "email", "ssn", "dob", "netWorth"],
      ["income", "investableAssets", "riskTolerance"],
      ["termsAccepted"],
      [], // review has no new inputs
    ],
    []
  );

  async function next() {
    const valid = await trigger(stepFields[step] as any);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: OnboardingValues) {
    // Submit all validated data to API
    const res = await fetch(`/api/onboarding/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.error ?? "Submit failed");
      return;
    }
    router.push(`/onboarding/${token}/done`);
  }

  const current = watch();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Onboarding App</h1>

      {/* Progress pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["1. Client Info", "2. Financial Info", "3. Compliance", "4. Review & Submit"].map(
          (label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid #E2E8F0",
                background: i === step ? "#111827" : "#F1F5F9",
                color: i === step ? "#fff" : "#111827",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          )
        )}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Card */}
          <div
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
              marginBottom: 16,
            }}
          >
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                  Step 1 — Client Info
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {/* Full Name */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Full Name</label>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Legal name as it appears on government ID.
                    </div>
                    <input
                      {...register("fullName")}
                      placeholder="Jane Q. Doe"
                      autoComplete="name"
                      className="input"
                      style={inputStyle(errors.fullName)}
                    />
                    <FieldError msg={errors.fullName?.message} />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Email</label>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      We’ll send document e-sign and status updates here.
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="jane@example.com"
                      autoComplete="email"
                      style={inputStyle(errors.email)}
                    />
                    <FieldError msg={errors.email?.message} />
                  </div>

                  {/* SSN */}
                  <div>
                    <label style={{ fontWeight: 600 }}>SSN (XXX-XX-XXXX)</label>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Used for CIP/KYC; encrypted and stored securely.
                    </div>
                    <input
                      {...register("ssn")}
                      inputMode="numeric"
                      placeholder="123-45-6789"
                      onChange={(e) => setValue("ssn", formatSSN(e.target.value))}
                      style={inputStyle(errors.ssn)}
                    />
                    <FieldError msg={errors.ssn?.message} />
                  </div>

                  {/* DOB */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Date of Birth</label>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      You must be at least 18 years old.
                    </div>
                    <input
                      {...register("dob")}
                      type="date"
                      placeholder="mm/dd/yyyy"
                      style={inputStyle(errors.dob)}
                    />
                    <FieldError msg={errors.dob?.message} />
                  </div>

                  {/* Net Worth — CurrencyInput */}
                  <div style={{ gridColumn: "1 / span 2" }}>
                    <label style={{ fontWeight: 600 }}>Net Worth</label>
                    <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                      Approximate total assets minus liabilities.
                    </div>
                    <Controller
                      control={control}
                      name="netWorth"
                      render={({ field, fieldState }) => (
                        <CurrencyInput
                          id="netWorth"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="e.g., 750,000"
                          aria-invalid={!!fieldState.error}
                        />
                      )}
                    />
                    <FieldError msg={errors.netWorth?.message} />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                  Step 2 — Financial Info
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {/* Income — CurrencyInput */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Income</label>
                    <Controller
                      control={control}
                      name="income"
                      render={({ field, fieldState }) => (
                        <CurrencyInput
                          id="income"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="e.g., 200,000"
                          aria-invalid={!!fieldState.error}
                        />
                      )}
                    />
                    <FieldError msg={errors.income?.message} />
                  </div>

                  {/* Investable Assets — CurrencyInput */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Investable Assets</label>
                    <Controller
                      control={control}
                      name="investableAssets"
                      render={({ field, fieldState }) => (
                        <CurrencyInput
                          id="investableAssets"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="e.g., 100,000"
                          aria-invalid={!!fieldState.error}
                        />
                      )}
                    />
                    <FieldError msg={errors.investableAssets?.message} />
                  </div>

                  {/* Risk Tolerance */}
                  <div style={{ gridColumn: "1 / span 2" }}>
                    <label style={{ fontWeight: 600 }}>Risk Tolerance</label>
                    <select
                      {...register("riskTolerance")}
                      style={{
                        ...inputStyle(errors.riskTolerance),
                        height: 44,
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <FieldError msg={errors.riskTolerance?.message} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                  Step 3 — Compliance & Agreements
                </h2>

                <div style={{ display: "grid", gap: 16 }}>
                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <input type="checkbox" {...register("termsAccepted")} />
                    <span>
                      I confirm the information provided is true and acknowledge the disclosures.
                    </span>
                  </label>
                  <FieldError msg={errors.termsAccepted?.message} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontWeight: 600 }}>Citizenship (optional)</label>
                      <input
                        {...register("kyc.citizenship")}
                        placeholder="US / Non-US"
                        style={inputStyle(undefined)}
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600 }}>Employment Status (optional)</label>
                      <input
                        {...register("kyc.employmentStatus")}
                        placeholder="Employed / Self-employed / Retired"
                        style={inputStyle(undefined)}
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: 600 }}>Source of Funds (optional)</label>
                      <input
                        {...register("kyc.sourceOfFunds")}
                        placeholder="Employment / Inheritance / Other"
                        style={inputStyle(undefined)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                  Step 4 — Review & Submit
                </h2>

                {/* Review blocks */}
                <Section title="Client">
                  <Row label="Full Name" value={current.fullName} />
                  <Row label="Email" value={current.email} />
                  <Row label="SSN" value={current.ssn} />
                  <Row label="DOB" value={String(current.dob)} />
                  <Row label="Net Worth" value={fmtUSD(current.netWorth)} />
                </Section>

                <Section title="Financial">
                  <Row label="Income" value={fmtUSD(current.income)} />
                  <Row label="Investable Assets" value={fmtUSD(current.investableAssets)} />
                  <Row label="Risk Tolerance" value={current.riskTolerance} />
                </Section>

                <Section title="Compliance">
                  <Row label="Confirmed & Acknowledged" value={current.termsAccepted ? "Yes" : "No"} />
                  <Row label="Citizenship" value={current.kyc?.citizenship || "—"} />
                  <Row label="Employment Status" value={current.kyc?.employmentStatus || "—"} />
                  <Row label="Source of Funds" value={current.kyc?.sourceOfFunds || "—"} />
                </Section>

                <p style={{ color: "#64748B", fontSize: 12 }}>
                  Use “Back” to edit any section before submitting.
                </p>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || isSubmitting}
              style={secondaryButtonStyle}
            >
              Back
            </button>

            {step < 3 ? (
              <button type="button" onClick={next} style={primaryButtonStyle}>
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} style={primaryButtonStyle}>
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

/* -------------------------- helpers / tiny UI bits ------------------------- */

function inputStyle(error?: unknown): React.CSSProperties {
  return {
    width: "100%",
    height: 44,
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${error ? "#ef4444" : "#E2E8F0"}`,
    background: "#fff",
    outline: "none",
  };
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{msg}</div>;
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div style={{ paddingTop: 8, marginBottom: 16 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <div style={{ borderTop: "1px solid #E2E8F0" }} />
      <div style={{ display: "grid", gap: 10, paddingTop: 10 }}>{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 8 }}>
      <div style={{ color: "#64748B" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{String(value ?? "—")}</div>
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#F1F5F9",
  color: "#0f172a",
  fontWeight: 600,
  border: "1px solid #E2E8F0",
  cursor: "pointer",
};

function fmtUSD(v: any) {
  const n = typeof v === "string" ? Number(v.replace(/[^\d.-]/g, "")) : Number(v);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}