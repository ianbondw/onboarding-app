// src/app/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <main className="space-y-10">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold leading-tight">
              Modern, compliant onboarding that produces insight
            </h1>
            <p className="mt-3 text-slate-600">
              Progressive, client-friendly data capture (KYC/CIP + suitability) that turns into
              advisor-useful recommendations — not just forms.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Use /onboarding/new to avoid 404 and generate a token */}
              <Link href="/onboarding/new" className="btn-primary">
                Start client onboarding →
              </Link>
              <Link href="/admin/clients" className="btn-plain">
                View recent submissions
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm shrink-0 rounded-xl border bg-slate-50 p-5 text-sm text-slate-700">
            <div className="font-medium text-slate-900">What’s included</div>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>KYC/CIP + suitability with progressive steps</li>
              <li>Smart product/strategy suggestions for advisors</li>
              <li>Admin list + CSV export</li>
              <li>Optional SSN encryption at rest</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Feature
          title="Client-first flow"
          desc="Clear steps, inline tips, and only the fields that matter. Higher completion, less friction."
        />
        <Feature
          title="Advisor outcomes"
          desc="Answers map to suggested solutions — retirement, income, growth, tax-aware — with rationale."
        />
        <Feature
          title="Enterprise posture"
          desc="Compliance-ready fields, audit-friendly storage, and a clean, credible UI."
        />
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="text-base font-medium">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}