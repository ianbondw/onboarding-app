import type { Metadata } from "next";
import { LEGAL_EMAIL, LEGAL_LAST_UPDATED, SITE_ORIGIN, toMailto } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Marengo Finance terms for use of the website, trial workspaces, advisor portal, and onboarding product.",
  alternates: {
    canonical: "/legal/terms",
  },
};

const sections = [
  {
    title: "Service Scope",
    body: [
      "Marengo Finance provides website content, trial workspaces, advisor portal access, client onboarding workflows, and related implementation or support services.",
      "Features, integrations, and compliance workflows may vary by plan, environment, and customer configuration.",
    ],
  },
  {
    title: "Customer Responsibilities",
    body: [
      "Customers are responsible for the accuracy of the information they submit, the credentials and permissions they assign to their personnel, and their own supervisory, compliance, legal, and recordkeeping obligations.",
      "Customers must not use the service to collect or process information they are not authorized to handle, or to upload unlawful, deceptive, infringing, or malicious content.",
    ],
  },
  {
    title: "Regulated Use",
    body: [
      "The product can support regulated onboarding and review workflows, but the software itself does not replace legal advice, written supervisory procedures, privacy notices, customer agreements, incident response planning, or other obligations imposed by law or by a regulator.",
      "No statement on this website should be interpreted as a guarantee that any customer has satisfied every requirement applicable to its business, jurisdiction, or registration status.",
    ],
  },
  {
    title: "Security and Availability",
    body: [
      "We work to operate the service with reasonable administrative, technical, and physical safeguards, but we do not promise uninterrupted availability or perfect security.",
      "Customers should maintain their own business continuity, export, review, and incident-response processes appropriate to the sensitivity of their data and operations.",
    ],
  },
  {
    title: "Intellectual Property and Acceptable Use",
    body: [
      "The service, software, and related materials remain the property of Marengo Finance or its licensors except for customer-submitted data and customer-owned branding or content.",
      "You may not reverse engineer, interfere with, probe, or misuse the service in a way that degrades security, bypasses access controls, or harms other users.",
    ],
  },
  {
    title: "Disclaimers and Liability",
    body: [
      "The service is provided on an as-available basis except to the extent otherwise stated in a signed agreement. Nothing on the site is investment, legal, tax, or compliance advice.",
      "To the fullest extent permitted by law, Marengo Finance disclaims implied warranties and will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from use of the site or service.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Terms of Service
            </div>
            <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
              Terms calibrated for a real product, not placeholder copy.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Last updated {LEGAL_LAST_UPDATED}. These terms govern use of the Marengo Finance
              website, trial workspaces, advisor portal, and onboarding product unless a separate
              written agreement controls.
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
            <div className="text-sm leading-7 text-slate-700">
              Legal contact:{" "}
              <a className="underline" href={toMailto(LEGAL_EMAIL, "Legal inquiry")}>
                {LEGAL_EMAIL}
              </a>
            </div>
            <div className="text-sm leading-7 text-slate-600">
              Canonical reference:{" "}
              <a className="underline" href={`${SITE_ORIGIN}/legal/terms`}>
                {SITE_ORIGIN}/legal/terms
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
