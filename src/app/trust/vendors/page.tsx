import type { Metadata } from "next";
import DocPage from "@/components/DocPage";
import { LEGAL_LAST_UPDATED, TRUST_EMAIL, toMailto } from "@/lib/site-config";
import { vendorSections } from "@/lib/trust-content";

export const metadata: Metadata = {
  title: "Vendor List",
  description:
    "Marengo Finance standard deployment vendors and optional integrations for customer diligence.",
  alternates: {
    canonical: "/trust/vendors",
  },
};

export default function VendorListPage() {
  return (
    <DocPage
      eyebrow="Trust Center"
      title="Standard Vendor and Subprocessor Summary"
      lede={`Last updated ${LEGAL_LAST_UPDATED}. This page describes the normal deployment profile for the product and should be treated as a baseline, not a promise that every customer environment uses the exact same stack.`}
      sections={[...vendorSections]}
      aside={
        <div className="relative z-10 text-sm leading-7 text-slate-600">
          Customer-specific diligence or subprocessor questions can be directed to{" "}
          <a className="underline" href={toMailto(TRUST_EMAIL, "Vendor diligence request")}>
            {TRUST_EMAIL}
          </a>
          .
        </div>
      }
    />
  );
}
