import type { Metadata } from "next";
import DocPage from "@/components/DocPage";
import { LEGAL_EMAIL, LEGAL_LAST_UPDATED, toMailto } from "@/lib/site-config";
import { msaSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "MSA-Ready Baseline",
  description:
    "Marengo Finance MSA-ready baseline for customer legal review and commercial contracting.",
  alternates: {
    canonical: "/legal/msa",
  },
};

export default function LegalMsaPage() {
  return (
    <DocPage
      eyebrow="Legal Pack"
      title="MSA-Ready Baseline"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This page summarizes the commercial and risk-allocation themes used to prepare a working master services agreement.`}
      sections={[...msaSections]}
      aside={
        <div className="relative z-10 text-sm leading-7 text-slate-600">
          For a working draft or redlines, contact{" "}
          <a className="underline" href={toMailto(LEGAL_EMAIL, "MSA draft request")}>
            {LEGAL_EMAIL}
          </a>
          .
        </div>
      }
    />
  );
}
