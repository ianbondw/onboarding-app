import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_LAST_UPDATED, PRIVACY_EMAIL, SECURITY_EMAIL, SITE_ORIGIN, toMailto } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Marengo Finance privacy notice for client onboarding, advisor workspaces, security logging, and data handling.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

const sections = [
  {
    title: "What We Collect",
    body: [
      "We collect information submitted through the onboarding product, business contact information for advisors and buyers, operational events needed to secure the product, and limited device or request data used to prevent abuse and troubleshoot issues.",
      "Sensitive onboarding fields may include identity, contact, financial profile, suitability inputs, and limited compliance-review data. Demo flows are designed to avoid full SSNs and raw document uploads.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use information to provide the onboarding service, provision advisor workspaces, support compliance review workflows, secure accounts and sessions, respond to support requests, and meet legal or contractual obligations.",
      "We also use limited lifecycle and audit data to understand product usage, investigate incidents, and maintain records required for operations and customer oversight.",
    ],
  },
  {
    title: "How We Minimize Sensitive Data",
    body: [
      "The product is designed to avoid retaining more sensitive information than is operationally necessary. Sensitive fields such as SSN last four and date of birth are encrypted for storage when collected, and the system stores a minimized submission snapshot instead of duplicating the full raw intake payload.",
      "Where a downstream identity or compliance provider is configured, the workflow is intended to hand off document review to that provider rather than accepting raw file URLs inside the onboarding form.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We share information only with service providers and subprocessors needed to operate the service, such as hosting, database, email, CRM, and identity or compliance-review integrations that the customer enables.",
      "We may also disclose information when required by law, regulation, court order, or to protect the security and integrity of the service, our customers, or affected individuals.",
    ],
  },
  {
    title: "Security and Access Controls",
    body: [
      "We use HTTPS in transit, encrypted storage for selected sensitive fields, scoped portal sessions, audit logging, and review-state controls to reduce unnecessary access to customer information.",
      "No internet-connected system is perfectly secure. Formal compliance with a customer’s regulatory obligations also depends on contracts, policies, training, incident response, vendor oversight, and legal review outside the codebase itself.",
    ],
  },
  {
    title: "Retention and Deletion",
    body: [
      "We retain information for as long as needed to provide the service, satisfy customer instructions, support security and audit needs, and comply with legal, regulatory, and contractual obligations.",
      "When retention is no longer required, we aim to delete or de-identify data using our normal operational processes, subject to backup, legal hold, and recordkeeping constraints.",
    ],
  },
  {
    title: "Your Requests",
    body: [
      "Requests to access, correct, export, or delete information should be sent to the customer organization that collected the information first. If you need to contact us directly, use the addresses below and include enough detail for us to route the request.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Privacy Notice
            </div>
            <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
              Privacy terms written for diligence, not filler.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Last updated {LEGAL_LAST_UPDATED}. This notice describes how Marengo Finance handles
              information collected through its website, advisor portal, and client onboarding
              workflows.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <section key={section.title} className="surface-card p-6">
              <div className="relative z-10">
                <h2 className="display-type text-2xl font-semibold text-slate-950">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="section-shell p-8">
          <div className="relative z-10 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Contact
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-700">
                Privacy requests:{" "}
                <a className="underline" href={toMailto(PRIVACY_EMAIL, "Privacy request")}>
                  {PRIVACY_EMAIL}
                </a>
              </div>
              <div className="text-sm leading-7 text-slate-700">
                Security issues:{" "}
                <a className="underline" href={toMailto(SECURITY_EMAIL, "Security inquiry")}>
                  {SECURITY_EMAIL}
                </a>
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-600">
                Prefer a workflow instead of an email thread? Use the{" "}
                <Link className="underline" href="/privacy/request">
                  privacy request form
                </Link>
                .
              </div>
            </div>
            <div className="text-sm leading-7 text-slate-600">
              <p>
                This notice supplements, but does not replace, customer contracts, data processing
                terms, or regulator-specific disclosures that may apply to a particular deployment.
              </p>
              <p className="mt-3">
                Supporting trust documents are available in the{" "}
                <Link className="underline" href="/trust">
                  Trust Center
                </Link>
                .
              </p>
              <p className="mt-3">
                Canonical reference:{" "}
                <a className="underline" href={`${SITE_ORIGIN}/legal/privacy`}>
                  {SITE_ORIGIN}/legal/privacy
                </a>
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
