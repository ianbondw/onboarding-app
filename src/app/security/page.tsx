import type { Metadata } from "next";
import Link from "next/link";
import {
  LEGAL_LAST_UPDATED,
  SECURITY_EMAIL,
  SITE_ORIGIN,
  TRUST_EMAIL,
  toMailto,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Marengo Finance security overview covering PII handling, session controls, audit logging, and compliance boundaries.",
  alternates: {
    canonical: "/security",
  },
};

const controlAreas = [
  {
    title: "PII Handling",
    body:
      "Sensitive identity values are collected sparingly, encrypted when stored, and no longer duplicated into full raw-intake snapshots. Demo flows are designed around minimum necessary data instead of full credential collection.",
  },
  {
    title: "Access Controls",
    body:
      "Portal access is session-scoped, role-aware, and cookie-protected. Sessions now use stricter cookie attributes, shorter lifetimes, and idle timeout enforcement to reduce stale privileged access.",
  },
  {
    title: "Auditability",
    body:
      "The product maintains audit logs, lifecycle events, and review-state changes for operational traceability. This supports customer oversight and helps firms evidence key workflow events during diligence.",
  },
  {
    title: "Secure Review Workflow",
    body:
      "The onboarding flow pushes identity review toward dedicated compliance tooling when configured, instead of encouraging raw document links inside the form itself. Admin views show whether data exists without unnecessarily rendering plaintext sensitive values.",
  },
];

const caveats = [
  "Code hardening is not the same thing as a completed SOC 2 examination. Formal attestation requires an auditor, a defined control environment, evidence collection, and operating effectiveness over time.",
  "Product features do not make any customer automatically compliant with SEC, FTC, FINRA, state privacy, or breach-notification requirements. Customers still need contracts, notices, policies, training, vendor oversight, and legal review.",
  "No software vendor can make a regulated workflow immune from lawsuits. The realistic goal is stronger controls, clearer disclosures, and better evidence when something is reviewed.",
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Trust and Security
            </div>
            <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
              Security posture that stands up better in diligence and regulator conversations.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Last updated {LEGAL_LAST_UPDATED}. This page explains the practical security controls
              built into the current product and where customer-side governance or formal audit work
              is still required.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {controlAreas.map((area) => (
            <div key={area.title} className="surface-card p-6">
              <div className="relative z-10">
                <h2 className="display-type text-2xl font-semibold text-slate-950">
                  {area.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{area.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="spotlight-card p-8 text-white">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Compliance Boundary
            </div>
            <h2 className="display-type mt-3 text-3xl font-semibold">
              Stronger controls, not fake guarantees.
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
              {caveats.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell p-8">
          <div className="relative z-10 grid gap-6 md:grid-cols-[1.05fr,0.95fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Diligence Contacts
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-700">
                Security:{" "}
                <a className="underline" href={toMailto(SECURITY_EMAIL, "Security diligence request")}>
                  {SECURITY_EMAIL}
                </a>
              </div>
              <div className="text-sm leading-7 text-slate-700">
                Trust and diligence:{" "}
                <a className="underline" href={toMailto(TRUST_EMAIL, "Trust and diligence request")}>
                  {TRUST_EMAIL}
                </a>
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-600">
                Use the contact above for security questionnaires, architecture reviews, and vendor
                diligence requests.
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/70 bg-white/72 p-5 text-sm leading-7 text-slate-600 backdrop-blur">
              <p>
                Looking for the privacy and contractual side too? Review the{" "}
                <Link className="underline" href="/legal/privacy">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link className="underline" href="/legal/terms">
                  Terms
                </Link>
                .
              </p>
              <p className="mt-3">
                Canonical reference:{" "}
                <a className="underline" href={`${SITE_ORIGIN}/security`}>
                  {SITE_ORIGIN}/security
                </a>
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
