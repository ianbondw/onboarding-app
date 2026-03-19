const ENTRIES = [
  {
    date: "March 18, 2026",
    title: "Secure portal sessions and role-based login",
    detail:
      "Replaced cookie-only admin access with database-backed portal sessions for owner, ops, and advisor roles.",
  },
  {
    date: "March 18, 2026",
    title: "Lead-captured trial workspaces",
    detail:
      "Trial requests now create dedicated advisor workspaces, onboarding links, dashboard access, and optional portal credentials.",
  },
  {
    date: "March 18, 2026",
    title: "Compliance review workflow",
    detail:
      "Client records now track identity and document review states, provider references, notes, and audit events.",
  },
  {
    date: "March 18, 2026",
    title: "Downstream integrations",
    detail:
      "Added webhook fan-out plus optional HubSpot sync for trials and submitted clients.",
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Product Changelog</h1>
          <p className="text-sm text-slate-600">
            Major product and operations updates for the Marengo onboarding platform.
          </p>
        </div>

        <div className="space-y-4">
          {ENTRIES.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {entry.date}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{entry.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{entry.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
