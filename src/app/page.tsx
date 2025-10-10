// src/app/page.tsx
// High-conviction marketing page for Client Onboarding (Next.js App Router)

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* NAV */}
      <header className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-black" />
          <span className="font-semibold">Client Onboarding</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#how" className="hover:text-gray-900">How it works</a>
          <a href="#security" className="hover:text-gray-900">Security</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
          <a href="#faq" className="hover:text-gray-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/admin/clients" className="rounded-xl px-4 py-2 text-sm font-medium border">Admin</Link>
          <Link href="/onboarding" className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white">Try Demo</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Client onboarding that advisors don’t hate.
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            A clean, compliant intake that captures KYC, risk, and documents in minutes —
            with per-advisor analytics baked in. Eliminate back-and-forth, increase conversion,
            and get clients funded faster.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-xl px-5 py-3 text-sm font-medium bg-gray-900 text-white">Start Interactive Demo</Link>
            <a href="#book" className="rounded-xl px-5 py-3 text-sm font-medium border">Request Pilot</a>
          </div>
          <div className="mt-4 text-xs text-gray-500">No credit card • SOC2-friendly architecture • Works on desktop & mobile</div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-3">What you’ll see</div>
          <ul className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="rounded-xl border p-3">KYC / CIP basics</li>
            <li className="rounded-xl border p-3">Risk tolerance</li>
            <li className="rounded-2xl border p-3">Income & net worth</li>
            <li className="rounded-2xl border p-3">Document upload</li>
            <li className="rounded-2xl border p-3">Per-advisor analytics</li>
            <li className="rounded-2xl border p-3">Email notifications</li>
          </ul>
        </div>
      </section>

      {/* PROOF BAR */}
      <section className="border-y bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center gap-6 justify-between">
          <p className="text-sm text-gray-600">Built for RIAs, broker-dealers, and wealth teams modernizing client intake.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="rounded-full border px-3 py-1">Faster conversion</span>
            <span className="rounded-full border px-3 py-1">Cleaner data</span>
            <span className="rounded-full border px-3 py-1">Lower NIGO</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-5 bg-white">
            <div className="text-sm font-semibold">1) Share a link</div>
            <p className="mt-2 text-sm text-gray-600">Each advisor gets a unique URL. Track usage by advisor or even per person with <code>?contact=</code> tags.</p>
          </div>
          <div className="rounded-2xl border p-5 bg-white">
            <div className="text-sm font-semibold">2) Client completes guided intake</div>
            <p className="mt-2 text-sm text-gray-600">KYC/CIP essentials, risk score, income/net worth and documents — mobile friendly.</p>
          </div>
          <div className="rounded-2xl border p-5 bg-white">
            <div className="text-sm font-semibold">3) Review in Admin</div>
            <p className="mt-2 text-sm text-gray-600">See weekly submissions, completion rates, and averages. Export or push downstream.</p>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        <h2 className="text-2xl font-semibold">Security & compliance first</h2>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
          <li className="rounded-xl border p-4 bg-white">JWT + HttpOnly cookies; scoped access per advisor</li>
          <li className="rounded-xl border p-4 bg-white">Minimal PII collection; no SSNs by default</li>
          <li className="rounded-xl border p-4 bg-white">Neon Postgres with PITR; Prisma row-level scoping</li>
          <li className="rounded-xl border p-4 bg-white">Email alerts via Resend; no sensitive payloads</li>
        </ul>
      </section>

      {/* PRICING (Hybrid) */}
      <section id="pricing" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-6 bg-white">
            <div className="text-sm font-semibold">Starter</div>
            <div className="mt-2 text-3xl font-bold">$99<span className="text-base font-medium">/advisor/mo</span></div>
            <p className="mt-2 text-sm text-gray-600">
              Includes <strong>25</strong> completed intakes per advisor/month. Then <strong>$10</strong> per additional intake.
            </p>
            <Link href="/onboarding" className="mt-4 inline-block rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white">
              Start demo
            </Link>
          </div>

          <div className="rounded-2xl border p-6 bg-white">
            <div className="text-sm font-semibold">Team</div>
            <div className="mt-2 text-3xl font-bold">$399<span className="text-base font-medium">/mo</span></div>
            <p className="mt-2 text-sm text-gray-600">
              Up to <strong>10 advisors</strong>. Includes <strong>200</strong> completed intakes/month. Then <strong>$8</strong> each.
            </p>
            <a href="#book" className="mt-4 inline-block rounded-xl px-4 py-2 text-sm font-medium border">
              Request pilot
            </a>
          </div>

          <div className="rounded-2xl border p-6 bg-white">
            <div className="text-sm font-semibold">Enterprise</div>
            <div className="mt-2 text-3xl font-bold">Custom</div>
            <p className="mt-2 text-sm text-gray-600">SSO • custom fields • custodians/CRM integrations • SLA</p>
            <a href="#book" className="mt-4 inline-block rounded-xl px-4 py-2 text-sm font-medium border">
              Talk to us
            </a>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Beta promo: first <strong>50</strong> completed intakes free for new teams.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        <h2 className="text-2xl font-semibold">FAQs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5 bg-white">
            <div className="font-medium">Is this compliant?</div>
            <p className="mt-2 text-sm text-gray-600">We capture CIP/KYC basics and avoid SSNs by default. Add only what your compliance signs off on.</p>
          </div>
          <div className="rounded-2xl border p-5 bg-white">
            <div className="font-medium">Can advisors share unique links?</div>
            <p className="mt-2 text-sm text-gray-600">Yes — each advisor has a tokenized URL. You can also tag links with <code>?contact=NAME</code> to attribute outreach.</p>
          </div>
          <div className="rounded-2xl border p-5 bg-white">
            <div className="font-medium">Where is data stored?</div>
            <p className="mt-2 text-sm text-gray-600">Neon Postgres. Backups with PITR enabled. Prisma enforces per-advisor scoping.</p>
          </div>
          <div className="rounded-2xl border p-5 bg-white">
            <div className="font-medium">Can we export or integrate?</div>
            <p className="mt-2 text-sm text-gray-600">Yes — export JSON/CSV today; roadmap includes custodians/CRM integrations.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-2xl border bg-white p-10">
          <h3 className="text-2xl font-semibold">Ready to pilot with your team?</h3>
          <p className="mt-2 text-gray-600">Give us 30 minutes. We’ll set up advisor links and a clean demo for your data.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/onboarding" className="rounded-xl px-5 py-3 text-sm font-medium bg-gray-900 text-white">Run Demo</Link>
            <a href="mailto:demo@advisoronboarding.app" className="rounded-xl px-5 py-3 text-sm font-medium border">Email Us</a>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} Client Onboarding</p>
      </section>
    </main>
  );
}