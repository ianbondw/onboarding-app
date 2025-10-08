// src/app/page.tsx
export default function Page() {
  return (
    <main className="space-y-6">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-medium">Modern, compliant onboarding that produces insight</h2>
        <p className="mt-2 text-sm text-slate-600">
          Progressive, client-friendly data capture (KYC/CIP + suitability) that turns into advisor-useful recommendations.
        </p>
        <div className="mt-4">
          <a href="/onboarding" className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">
            Start client onboarding →
          </a>
        </div>
      </section>
    </main>
  );
}