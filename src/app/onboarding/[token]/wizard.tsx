"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  defaultValues,
  type OnboardingValues,
} from "@/lib/validations";

/** ---------- helpers (formatters) ---------- */
const clampDigits = (s: string, max = 12) => s.replace(/\D/g, "").slice(0, max);
const formatSSN = (input: string): string => {
  const d = clampDigits(input, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};
const formatIntWithCommas = (n: number | string): string => {
  const s = String(n ?? "");
  if (!s) return "";
  return s.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const parseCommaNumber = (s: string): number | undefined => {
  const clean = s.replace(/,/g, "").trim();
  if (!clean) return undefined;
  const n = Number(clean);
  return Number.isFinite(n) ? n : undefined;
};

/** ---------- visual tokens ---------- */
const color = {
  text: "#0f172a",
  subtext: "#475569",
  border: "#e5e7eb",
  bg: "#ffffff",
  bgAlt: "#f8fafc",
  accent: "#111827",
  accentText: "#ffffff",
  error: "#b91c1c",
};
const card = {
  border: `1px solid ${color.border}`,
  radius: 12,
  pad: 16,
};

const steps = [
  { key: "client", label: "Client Info" },
  { key: "financial", label: "Financial Info" },
  { key: "compliance", label: "Compliance" },
  { key: "review", label: "Review & Submit" },
];

const stepFieldKeys: Record<number, (keyof OnboardingValues | `kyc.${string}`)[]> = {
  0: ["fullName", "ssn", "dob", "email", "netWorth"],
  1: ["income", "investableAssets", "riskTolerance"],
  2: ["termsAccepted", "kyc.citizenship", "kyc.employmentStatus", "kyc.sourceOfFunds"],
  3: [],
};

/** ---------- UI primitives ---------- */
const Section = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => (
  <section
    style={{
      ...card,
      borderRadius: card.radius,
      padding: card.pad,
      background: color.bg,
    }}
  >
    <div style={{ fontWeight: 700, marginBottom: 12 }}>{title}</div>
    <div style={{ display: "grid", gap: 12 }}>{children}</div>
  </section>
);

const Row = ({ children }: React.PropsWithChildren) => (
  <div
    style={{
      display: "grid",
      gap: 12,
      gridTemplateColumns: "1fr 1fr",
      alignItems: "baseline",
    }}
  >
    {children}
  </div>
);

const Label = ({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div style={{ display: "grid", gap: 4 }}>
    <label htmlFor={htmlFor} style={{ fontSize: 14, color: color.text, fontWeight: 600 }}>
      {children}
    </label>
    {hint ? (
      <div style={{ fontSize: 12, color: color.subtext, lineHeight: 1.4 }}>{hint}</div>
    ) : null}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: `1px solid ${color.border}`,
      outline: "none",
    }}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: `1px solid ${color.border}`,
      background: color.bg,
      outline: "none",
    }}
  />
);

const ErrorText = ({ show, msg }: { show?: boolean; msg?: string }) =>
  show && msg ? (
    <div style={{ color: color.error, fontSize: 12, marginTop: 6 }}>{msg}</div>
  ) : null;

function Segmented({
  value,
  onChange,
  options,
  name,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  name: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${name}-label`}
      style={{
        display: "inline-flex",
        border: `1px solid ${color.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {options.map((o, i) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              padding: "8px 14px",
              border: "none",
              background: active ? color.accent : color.bg,
              color: active ? color.accentText : color.text,
              borderRight: i < options.length - 1 ? `1px solid ${color.border}` : "none",
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** ---------- main component ---------- */
export default function OnboardingWizard() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const methods = useForm<OnboardingValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(onboardingSchema.partial()),
    defaultValues,
    shouldFocusError: true,
    criteriaMode: "firstError",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, touchedFields, isSubmitting },
  } = methods;

  const [activeStep, setActiveStep] = useState(0);
  const [showStepErrors, setShowStepErrors] = useState(false);

  const isLast = activeStep === steps.length - 1;
  const isFirst = activeStep === 0;
  const shouldShow = (name: keyof OnboardingValues) =>
    showStepErrors || Boolean((touchedFields as any)?.[name]);

  const Progress = () => (
    <header style={{ padding: "8px 0 4px 0" }}>
      <h1 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, color: color.text }}>
        Onboarding App
      </h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {steps.map((s, idx) => {
          const active = idx === activeStep;
          const complete = idx < activeStep;
          return (
            <div
              key={s.key}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 13,
                border: `1px solid ${color.border}`,
                background: active ? color.accent : complete ? color.bgAlt : color.bg,
                color: active ? color.accentText : color.text,
              }}
            >
              {idx + 1}. {s.label}
            </div>
          );
        })}
      </div>
    </header>
  );

  const next = async () => {
    const fields = stepFieldKeys[activeStep] ?? [];
    if (fields.length > 0) {
      const ok = await trigger(fields as any);
      if (!ok) {
        setShowStepErrors(true);
        const firstKey = Object.keys(errors)[0];
        if (firstKey) document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setShowStepErrors(false);
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => {
    setShowStepErrors(false);
    setActiveStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    const res = await fetch(`/api/onboarding/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Submission failed" }));
      alert(error || "Submission failed");
      return;
    }
    router.push(`/onboarding/${encodeURIComponent(token)}/done`);
  });

  /** --------- Steps ---------- */
  function Step1() {
    return (
      <Section title="Step 1 — Client Info">
        <Row>
          <div>
            <Label htmlFor="fullName" hint="Legal name as it appears on government ID.">
              Full Name
            </Label>
            <Input id="fullName" {...register("fullName")} placeholder="Jane Q. Doe" />
            <ErrorText show={shouldShow("fullName")} msg={errors.fullName?.message} />
          </div>

          <div>
            <Label htmlFor="email" hint="We’ll send document e-sign and status updates here.">
              Email
            </Label>
            <Input id="email" type="email" {...register("email")} placeholder="jane@example.com" />
            <ErrorText show={shouldShow("email")} msg={errors.email?.message} />
          </div>
        </Row>

        <Row>
          <div>
            <Label htmlFor="ssn" hint="Used for CIP/KYC; encrypted and stored securely.">
              SSN (XXX-XX-XXXX)
            </Label>
            <Controller
              name="ssn"
              control={control}
              render={({ field }) => (
                <Input
                  id="ssn"
                  inputMode="numeric"
                  placeholder="123-45-6789"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(formatSSN(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
            <ErrorText show={shouldShow("ssn")} msg={errors.ssn?.message} />
          </div>

          <div>
            <Label htmlFor="dob" hint="You must be at least 18 years old.">
              Date of Birth
            </Label>
            <Input id="dob" type="date" {...register("dob")} />
            <ErrorText show={shouldShow("dob")} msg={errors.dob?.message} />
          </div>
        </Row>

        <Row>
          <div>
            <Label htmlFor="netWorth" hint="Approximate total assets minus liabilities.">
              Net Worth
            </Label>
            <Controller
              name="netWorth"
              control={control}
              render={({ field }) => {
                const [display, setDisplay] = useState<string>("");
                useEffect(() => {
                  // initialize display from numeric value
                  if (typeof field.value === "number") {
                    setDisplay(field.value ? formatIntWithCommas(field.value) : "");
                  }
                }, []);
                return (
                  <Input
                    id="netWorth"
                    inputMode="numeric"
                    placeholder="e.g., 750,000"
                    value={display}
                    onChange={(e) => {
                      const digits = formatIntWithCommas(e.target.value);
                      setDisplay(digits);
                      const parsed = parseCommaNumber(digits);
                      field.onChange(parsed ?? "");
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />
            <ErrorText show={shouldShow("netWorth")} msg={errors.netWorth?.message} />
          </div>
          <div />
        </Row>
      </Section>
    );
  }

  function Step2() {
    return (
      <Section title="Step 2 — Financial Info">
        <Row>
          <div>
            <Label htmlFor="income" hint="Annual gross income.">
              Income
            </Label>
            <Controller
              name="income"
              control={control}
              render={({ field }) => {
                const [display, setDisplay] = useState<string>("");
                useEffect(() => {
                  if (typeof field.value === "number") {
                    setDisplay(field.value ? formatIntWithCommas(field.value) : "");
                  }
                }, []);
                return (
                  <Input
                    id="income"
                    inputMode="numeric"
                    placeholder="e.g., 200,000"
                    value={display}
                    onChange={(e) => {
                      const d = formatIntWithCommas(e.target.value);
                      setDisplay(d);
                      field.onChange(parseCommaNumber(d) ?? "");
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />
            <ErrorText show={shouldShow("income")} msg={errors.income?.message} />
          </div>

          <div>
            <Label htmlFor="investableAssets" hint="Liquid assets you could transfer (cash, brokerage, etc.).">
              Investable Assets
            </Label>
            <Controller
              name="investableAssets"
              control={control}
              render={({ field }) => {
                const [display, setDisplay] = useState<string>("");
                useEffect(() => {
                  if (typeof field.value === "number") {
                    setDisplay(field.value ? formatIntWithCommas(field.value) : "");
                  }
                }, []);
                return (
                  <Input
                    id="investableAssets"
                    inputMode="numeric"
                    placeholder="e.g., 120,000"
                    value={display}
                    onChange={(e) => {
                      const d = formatIntWithCommas(e.target.value);
                      setDisplay(d);
                      field.onChange(parseCommaNumber(d) ?? "");
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />
            <ErrorText
              show={shouldShow("investableAssets")}
              msg={errors.investableAssets?.message}
            />
          </div>
        </Row>

        <Row>
          <div>
            <Label htmlFor="riskTolerance" hint="Choose the closest fit; you can refine later.">
              Risk Tolerance
            </Label>
            <Controller
              name="riskTolerance"
              control={control}
              render={({ field }) => (
                <Segmented
                  name="riskTolerance"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                />
              )}
            />
            <ErrorText show={shouldShow("riskTolerance")} msg={errors.riskTolerance?.message} />
          </div>
          <div />
        </Row>
      </Section>
    );
  }

  function Step3() {
    return (
      <Section title="Step 3 — Compliance & Agreements">
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <input id="termsAccepted" type="checkbox" {...register("termsAccepted")} />
          <Label htmlFor="termsAccepted" hint="Reg BI / CIP / AML acknowledgment">
            I confirm the information provided is true and acknowledge the disclosures.
          </Label>
        </div>
        <ErrorText
          show={shouldShow("termsAccepted")}
          msg={errors.termsAccepted?.message as string | undefined}
        />

        <div style={{ marginTop: 6, fontSize: 13, color: color.subtext }}>
          Optional KYC (expandable later)
        </div>

        <Row>
          <div>
            <Label htmlFor="kyc.citizenship">Citizenship</Label>
            <Select id="kyc.citizenship" {...register("kyc.citizenship")}>
              <option value="">Select…</option>
              <option value="US">US</option>
              <option value="Non-US">Non-US</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="kyc.employmentStatus">Employment Status</Label>
            <Select id="kyc.employmentStatus" {...register("kyc.employmentStatus")}>
              <option value="">Select…</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Retired">Retired</option>
              <option value="Student">Student</option>
            </Select>
          </div>
        </Row>
        <Row>
          <div>
            <Label htmlFor="kyc.sourceOfFunds">Source of Funds</Label>
            <Select id="kyc.sourceOfFunds" {...register("kyc.sourceOfFunds")}>
              <option value="">Select…</option>
              <option value="Employment">Employment</option>
              <option value="Savings">Savings</option>
              <option value="Business">Business</option>
              <option value="Inheritance">Inheritance</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div />
        </Row>
      </Section>
    );
  }

  function Step4() {
    const v = getValues();
    const Item = ({ label, value }: { label: string; value?: React.ReactNode }) => (
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12 }}>
        <div style={{ color: color.subtext }}>{label}</div>
        <div>{String(value ?? "—")}</div>
      </div>
    );

    return (
      <Section title="Step 4 — Review & Submit">
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ fontWeight: 700 }}>Client</div>
          <Item label="Full Name" value={v.fullName} />
          <Item label="Email" value={v.email} />
          <Item label="SSN" value={v.ssn} />
          <Item label="DOB" value={v.dob} />
          <Item label="Net Worth" value={v.netWorth?.toLocaleString?.() ?? v.netWorth} />

          <div style={{ height: 1, background: color.border }} />

          <div style={{ fontWeight: 700 }}>Financial</div>
          <Item label="Income" value={v.income?.toLocaleString?.() ?? v.income} />
          <Item
            label="Investable Assets"
            value={v.investableAssets?.toLocaleString?.() ?? v.investableAssets}
          />
          <Item label="Risk Tolerance" value={v.riskTolerance} />

          <div style={{ height: 1, background: color.border }} />

          <div style={{ fontWeight: 700 }}>Compliance</div>
          <Item label="Confirmed & Acknowledged" value={v.termsAccepted ? "Yes" : "No"} />
          <Item label="Citizenship" value={v.kyc?.citizenship} />
          <Item label="Employment Status" value={v.kyc?.employmentStatus} />
          <Item label="Source of Funds" value={v.kyc?.sourceOfFunds} />
        </div>

        <div style={{ marginTop: 8, fontSize: 12, color: color.subtext }}>
          Use “Back” to edit any section before submitting.
        </div>
      </Section>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        style={{
          maxWidth: 960,
          margin: "24px auto",
          display: "grid",
          gap: 16,
          padding: "0 16px 88px",
        }}
      >
        <Progress />

        {activeStep === 0 && <Step1 />}
        {activeStep === 1 && <Step2 />}
        {activeStep === 2 && <Step3 />}
        {activeStep === 3 && <Step4 />}

        {/* Sticky footer actions */}
        <div
          style={{
            position: "sticky",
            bottom: 12,
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 8,
          }}
        >
          <button
            type="button"
            onClick={back}
            disabled={isFirst || isSubmitting}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: `1px solid ${color.border}`,
              background: isFirst ? "#f3f4f6" : color.bg,
              color: color.text,
              cursor: isFirst ? "not-allowed" : "pointer",
            }}
          >
            Back
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={next}
              disabled={isSubmitting}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: `1px solid ${color.accent}`,
                background: color.accent,
                color: color.accentText,
                cursor: "pointer",
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: `1px solid ${color.accent}`,
                background: color.accent,
                color: color.accentText,
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}