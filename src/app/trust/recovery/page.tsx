import type { Metadata } from "next";
import DocPage from "@/components/DocPage";
import { LEGAL_LAST_UPDATED, TRUST_EMAIL, toMailto } from "@/lib/site-config";
import { recoverySections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "Backup and Recovery Summary",
  description:
    "Marengo Finance backup and recovery summary for customer diligence and business continuity review.",
  alternates: {
    canonical: "/trust/recovery",
  },
};

export default function RecoveryPage() {
  return (
    <DocPage
      eyebrow="Trust Center"
      title="Backup and Recovery Summary"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This public summary explains the recovery path for a standard deployment and where binding recovery commitments must still come from infrastructure configuration or contract terms.`}
      sections={[...recoverySections]}
      aside={
        <div className="relative z-10 text-sm leading-7 text-slate-600">
          If a customer needs environment-specific recovery objectives or diligence responses, use{" "}
          <a className="underline" href={toMailto(TRUST_EMAIL, "Recovery diligence request")}>
            {TRUST_EMAIL}
          </a>
          .
        </div>
      }
    />
  );
}
