export default function Privacy() {
    return (
      <main className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-600">
          We collect only what’s necessary to power client onboarding and advisor analytics.
        </p>
        <div className="prose prose-slate mt-6">
          <h3>What we collect</h3>
          <ul>
            <li>Client intake form responses (as entered by the client)</li>
            <li>Minimal metadata (timestamps, advisor attribution)</li>
          </ul>
          <h3>What we avoid</h3>
          <ul>
            <li>No SSNs by default in demo environments</li>
            <li>No selling of any data, ever</li>
          </ul>
          <h3>Storage & security</h3>
          <p>Data is stored in Neon Postgres with backups. Access is scoped per advisor via JWT + HttpOnly cookies.</p>
          <h3>Contact</h3>
          <p>Questions? Email <a href="mailto:privacy@advisoronboarding.app">privacy@advisoronboarding.app</a>.</p>
          <p className="text-xs text-slate-500 mt-6">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </main>
    );
  }