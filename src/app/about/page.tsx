// src/app/about/page.tsx
export const metadata = {
  title: "About — Marengo",
  description:
    "Client onboarding that advisors can actually use. Personalized links, guided intake, advisor-scoped analytics.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">
          Client onboarding that advisors can actually use
        </h1>
        <p className="text-slate-600">
          Marengo makes it easy to collect compliant client info, auto-calculate net-worth
          bands, and see advisor-specific analytics. Built on Next.js + Prisma + Neon + Vercel,
          designed to get you from <em>interest → intake → insight</em> in minutes.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">What’s included</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Personalized advisor links</li>
          <li>Guided client intake (mobile-first)</li>
          <li>Advisor-scoped dashboard + CSV export</li>
          <li>Optional product suggestions (rules-based)</li>
          <li>Privacy by design (PII encryption option; demo-safe)</li>
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900">Why this matters</h2>
        <p className="mt-3 text-sm text-slate-700">
          Most onboarding feels like paperwork. Marengo keeps it lightweight for clients and
          actionable for advisors: fewer emails, faster first meetings, and clean data from day one.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        {/* Adjust links if your routes differ */}
        <a href="/pilot" className="btn-primary">Request Pilot</a>
        <a href="/contact" className="btn-secondary">Contact Us</a>
      </div>

      <footer className="pt-2 text-xs text-slate-500">
        Built with Next.js, Prisma, Neon, and Vercel.
      </footer>
    </main>
  );
}