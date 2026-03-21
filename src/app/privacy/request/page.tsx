import type { Metadata } from "next";
import PrivacyRequestClient from "./PrivacyRequestClient";

export const metadata: Metadata = {
  title: "Privacy Request",
  description:
    "Submit a privacy, deletion, correction, or data-access request for Marengo Finance workflows.",
  alternates: {
    canonical: "/privacy/request",
  },
};

export default function PrivacyRequestPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-shell p-8 md:p-10">
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Privacy Request
            </div>
            <h1 className="display-type mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
              Submit access, deletion, or correction requests without chasing inbox threads.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Use this form to open a privacy workflow request. We may need to verify identity
              before completing it, especially for deletion and access requests.
            </p>
          </div>
        </div>

        <PrivacyRequestClient />
      </section>
    </main>
  );
}
