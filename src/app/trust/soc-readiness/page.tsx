import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import { LEGAL_LAST_UPDATED, TRUST_EMAIL, toMailto } from "@/lib/site-config";
import { socReadinessSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "SOC 2 Readiness",
  description:
    "Marengo Finance SOC 2 readiness summary describing current controls and remaining operational work before attestation.",
  alternates: {
    canonical: "/trust/soc-readiness",
  },
};

export default function SocReadinessPage() {
  return (
    <DocPage
      eyebrow="Trust Center"
      title="SOC 2 Readiness Summary"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This page describes readiness progress and explicitly does not claim an issued SOC 2 report.`}
      sections={[...socReadinessSections]}
      aside={
        <div className="relative z-10 grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
          <div className="text-sm leading-7 text-slate-600">
            Readiness questions and diligence requests can be sent to{" "}
            <a className="underline" href={toMailto(TRUST_EMAIL, "SOC readiness request")}>
              {TRUST_EMAIL}
            </a>
            .
          </div>
          <Link className="btn-secondary inline-flex justify-center" href="/trust/wisp">
            View WISP Summary
          </Link>
        </div>
      }
    />
  );
}
