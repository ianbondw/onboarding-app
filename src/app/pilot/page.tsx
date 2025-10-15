// src/app/pilot/page.tsx
import Link from "next/link";

export default function PilotPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Client Onboarding</h1>
          <p className="mt-3 text-gray-600 text-lg">
            A modern, compliant client-intake platform for financial advisors and wealth teams.
          </p>
        </header>

        {/* Problem */}
        <section>
          <h2 className="text-2xl font-semibold">💡 The Problem</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Every wealth management firm claims to be client-centric — yet their onboarding process is slow, manual,
            and error-prone. Advisors spend hours chasing signatures and redundant forms. Clients get frustrated,
            and operations grind to a halt.
          </p>
        </section>

        {/* Solution */}
        <section>
          <h2 className="text-2xl font-semibold">🚀 The Solution</h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            <strong>Client Onboarding</strong> replaces outdated PDFs with a guided, digital experience that captures KYC,
            risk tolerance, and documents in minutes. Advisors get clean data and real-time analytics — clients enjoy a simple,
            mobile-friendly journey.
          </p>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-semibold">⚙️ How It Works</h2>
          <ul className="mt-4 space-y-3 text-gray-700 list-disc list-inside">
            <li>
              <strong>1️⃣ Personalized advisor link</strong> — Each advisor gets a unique onboarding URL
              (e.g., <code>?advisor=smith</code>) to track usage.
            </li>
            <li>
              <strong>2️⃣ Guided client intake</strong> — Mobile-ready flow captures personal, risk, and document data.
            </li>
            <li>
              <strong>3️⃣ Advisor dashboard</strong> — View submissions, analyze client goals, export data, and measure performance.
            </li>
          </ul>
        </section>

        {/* Tech */}
        <section>
          <h2 className="text-2xl font-semibold">🧠 Under the Hood</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="rounded-xl border bg-white p-4">Next.js 15 + Prisma 6 + Neon Postgres</li>
            <li className="rounded-xl border bg-white p-4">Deployed on Vercel (SOC-2 aligned)</li>
            <li className="rounded-xl border bg-white p-4">Optional AES-256-GCM encryption for PII</li>
            <li className="rounded-xl border bg-white p-4">Extensible API for CRM and custodian integrations</li>
          </ul>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-2xl font-semibold">💰 Pricing</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5 bg-white">
              <h3 className="font-semibold text-sm">Starter</h3>
              <div className="mt-2 text-3xl font-bold">$99<span className="text-base font-medium">/advisor/mo</span></div>
              <p className="mt-2 text-sm text-gray-600">
                Includes 25 client intakes per month, then $10 per additional intake.
              </p>
            </div>
            <div className="rounded-2xl border p-5 bg-white">
              <h3 className="font-semibold text-sm">Team</h3>
              <div className="mt-2 text-3xl font-bold">$399<span className="text-base font-medium">/mo</span></div>
              <p className="mt-2 text-sm text-gray-600">
                Up to 10 advisors, 200 client intakes per month, then $8 per additional intake.
              </p>
            </div>
            <div className="rounded-2xl border p-5 bg-white">
              <h3 className="font-semibold text-sm">Enterprise</h3>
              <div className="mt-2 text-3xl font-bold">Custom</div>
              <p className="mt-2 text-sm text-gray-600">
                SSO • custom fields • CRM integrations • dedicated SLA
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Beta promo: first <strong>50</strong> intakes free for new firms.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-semibold">🔒 Security & Compliance</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="rounded-xl border bg-white p-4">JWT + HttpOnly cookies; advisor-scoped data</li>
            <li className="rounded-xl border bg-white p-4">Minimal PII collection (no SSNs by default)</li>
            <li className="rounded-xl border bg-white p-4">Neon Postgres with PITR backups</li>
            <li className="rounded-xl border bg-white p-4">Optional email alerts via Resend</li>
          </ul>
        </section>

        {/* Why it matters */}
        <section>
          <h2 className="text-2xl font-semibold">📈 Why It Matters</h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc list-inside">
            <li>Reduce onboarding time from weeks to hours</li>
            <li>Boost client conversion by 30–50%</li>
            <li>Cut NIGO errors by 60%+</li>
            <li>Empower advisors to focus on growth, not forms</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center pt-8 border-t">
          <h2 className="text-2xl font-semibold">🚀 Ready to Pilot?</h2>
          <p className="mt-2 text-gray-600">
            We’ll spin up advisor links and a sandbox for your team — see how onboarding should feel.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/onboarding" className="rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-medium">
              Try the Demo
            </Link>
            <a
              href="mailto:demo@advisoronboarding.app"
              className="rounded-xl border px-5 py-3 text-sm font-medium"
            >
              Request Pilot
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} Client Onboarding
          </p>
        </section>
      </section>
    </main>
  );
}