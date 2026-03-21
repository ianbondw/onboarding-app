import type { Metadata } from "next";
import Link from "next/link";
import {
  LEGAL_EMAIL,
  LEGAL_LAST_UPDATED,
  PRIVACY_EMAIL,
  TRUST_EMAIL,
  toMailto,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Trust Center",
  description:
    "Marengo Finance trust center with security packet documents, privacy workflows, and legal-pack summaries for customer diligence.",
  alternates: {
    canonical: "/trust",
  },
};

const securityDocs = [
  {
    href: "/security",
    title: "Security Overview",
    body: "Current product controls, compliance boundaries, and diligence contacts.",
  },
  {
    href: "/trust/wisp",
    title: "WISP Summary",
    body: "Written information security program summary for the current deployment posture.",
  },
  {
    href: "/trust/incident-response",
    title: "Incident Response Summary",
    body: "Detection, containment, recovery, and notification posture at a glance.",
  },
  {
    href: "/trust/vendors",
    title: "Vendor List",
    body: "Standard deployment vendors and optional integrations used by the platform.",
  },
  {
    href: "/trust/recovery",
    title: "Backup and Recovery Summary",
    body: "Restore path and environment assumptions for business continuity conversations.",
  },
  {
    href: "/trust/soc-readiness",
    title: "SOC 2 Readiness",
    body: "What exists in code today and what still requires operational evidence and audit work.",
  },
];

const legalDocs = [
  {
    href: "/legal/privacy",
    title: "Privacy Policy",
    body: "Collection, use, sharing, minimization, retention, and request handling.",
  },
  {
    href: "/privacy/request",
    title: "Privacy Request Form",
    body: "Self-service intake for access, deletion, and correction requests.",
  },
  {
    href: "/legal/terms",
    title: "Terms of Service",
    body: "Public website and product terms, including regulated-use boundaries.",
  },
  {
    href: "/legal/dpa",
    title: "DPA-Ready Baseline",
    body: "Processor-scope and security-term summary for customer privacy addenda.",
  },
  {
    href: "/legal/msa",
    title: "MSA-Ready Baseline",
    body: "Commercial and risk-allocation summary for contract review cycles.",
  },
];

export default function TrustCenterPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Trust Center
              </div>
              <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
                Security packet, privacy workflows, and legal baselines in one diligence surface.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Last updated {LEGAL_LAST_UPDATED}. This trust center is designed for security
                review, customer diligence, and contract prep. It describes the current product and
                readiness posture without pretending a formal audit has already been issued.
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-white/70 bg-white/72 p-5 text-sm leading-7 text-slate-600 backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Diligence Contacts
              </div>
              <p className="mt-3">
                Trust packet:{" "}
                <a className="underline" href={toMailto(TRUST_EMAIL, "Trust center request")}>
                  {TRUST_EMAIL}
                </a>
              </p>
              <p>
                Legal review:{" "}
                <a className="underline" href={toMailto(LEGAL_EMAIL, "Legal pack request")}>
                  {LEGAL_EMAIL}
                </a>
              </p>
              <p>
                Privacy requests:{" "}
                <a className="underline" href={toMailto(PRIVACY_EMAIL, "Privacy request")}>
                  {PRIVACY_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </div>

        <SectionGrid
          eyebrow="Security Packet"
          title="Documents for technical diligence"
          items={securityDocs}
        />

        <SectionGrid
          eyebrow="Legal Pack"
          title="Documents for privacy and contracting review"
          items={legalDocs}
        />
      </section>
    </main>
  );
}

function SectionGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: { href: string; title: string; body: string }[];
}) {
  return (
    <section className="space-y-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </div>
        <h2 className="display-type mt-2 text-3xl font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="surface-card p-6 transition hover:-translate-y-0.5">
            <div className="relative z-10">
              <h3 className="display-type text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              <div className="mt-5 text-sm font-semibold text-slate-900">Open document</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
