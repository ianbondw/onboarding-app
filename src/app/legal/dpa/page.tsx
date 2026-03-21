import type { Metadata } from "next";
import DocPage from "@/components/DocPage";
import { LEGAL_EMAIL, LEGAL_LAST_UPDATED, TRUST_EMAIL, toMailto } from "@/lib/site-config";
import { dpaSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "DPA-Ready Baseline",
  description:
    "Marengo Finance DPA-ready baseline for customer privacy review and contract preparation.",
  alternates: {
    canonical: "/legal/dpa",
  },
};

export default function LegalDpaPage() {
  return (
    <DocPage
      eyebrow="Legal Pack"
      title="DPA-Ready Baseline"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This page summarizes the standard processor-facing positions Marengo Finance is prepared to discuss in a customer data processing addendum.`}
      sections={[...dpaSections]}
      aside={
        <div className="relative z-10 text-sm leading-7 text-slate-600">
          For a working draft or customer markup intake, contact{" "}
          <a className="underline" href={toMailto(LEGAL_EMAIL, "DPA draft request")}>
            {LEGAL_EMAIL}
          </a>{" "}
          and copy{" "}
          <a className="underline" href={toMailto(TRUST_EMAIL, "DPA diligence request")}>
            {TRUST_EMAIL}
          </a>
          .
        </div>
      }
    />
  );
}
