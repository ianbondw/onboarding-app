import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import { LEGAL_LAST_UPDATED, SECURITY_EMAIL, TRUST_EMAIL, toMailto } from "@/lib/site-config";
import { incidentResponseSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "Incident Response Summary",
  description:
    "Marengo Finance incident response summary covering detection, containment, recovery, and notification posture.",
  alternates: {
    canonical: "/trust/incident-response",
  },
};

export default function IncidentResponsePage() {
  return (
    <DocPage
      eyebrow="Trust Center"
      title="Incident Response Summary"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This summary outlines the current incident-handling posture for the platform and where customer-specific legal or regulatory obligations still control.`}
      sections={[...incidentResponseSections]}
      aside={
        <div className="relative z-10 grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
          <div className="text-sm leading-7 text-slate-600">
            Use{" "}
            <a className="underline" href={toMailto(SECURITY_EMAIL, "Security incident inquiry")}>
              {SECURITY_EMAIL}
            </a>{" "}
            for security escalation and{" "}
            <a className="underline" href={toMailto(TRUST_EMAIL, "Incident response diligence request")}>
              {TRUST_EMAIL}
            </a>{" "}
            for customer diligence requests.
          </div>
          <Link className="btn-secondary inline-flex justify-center" href="/.well-known/security.txt">
            View security.txt
          </Link>
        </div>
      }
    />
  );
}
