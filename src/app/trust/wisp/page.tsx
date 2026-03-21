import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import { TRUST_EMAIL, LEGAL_LAST_UPDATED, toMailto } from "@/lib/site-config";
import { wispSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "WISP Summary",
  description:
    "Marengo Finance written information security program summary for customer diligence and readiness review.",
  alternates: {
    canonical: "/trust/wisp",
  },
};

export default function TrustWispPage() {
  return (
    <DocPage
      eyebrow="Trust Center"
      title="Written Information Security Program Summary"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This public summary describes the current control themes in the platform and the operational work still required outside the codebase.`}
      sections={[...wispSections]}
      aside={
        <div className="relative z-10 grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
          <div className="text-sm leading-7 text-slate-600">
            Need the full diligence packet or a customer questionnaire response? Request it from{" "}
            <a className="underline" href={toMailto(TRUST_EMAIL, "WISP and diligence request")}>
              {TRUST_EMAIL}
            </a>
            .
          </div>
          <Link className="btn-secondary inline-flex justify-center" href="/trust/soc-readiness">
            View SOC 2 Readiness
          </Link>
        </div>
      }
    />
  );
}
