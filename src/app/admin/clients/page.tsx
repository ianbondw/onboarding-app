import Link from "next/link";

// Lazy import Prisma (keeps Node runtime in SSR)
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function pick(obj: any, keys: string[], fallback = "") {
  for (const k of keys) if (obj && obj[k] != null) return String(obj[k]);
  return fallback;
}
function toLower(s: unknown) { return (s ?? "").toString().toLowerCase(); }

export const dynamic = "force-dynamic";

export default async function AdminClients(props: any) {
  const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;

  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // Debug env inspector (unchanged)
  const debug = (Array.isArray(searchParams.debug) ? searchParams.debug[0] : searchParams.debug) === "1";
  if (debug) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Client Submissions (Debug)</h1>
        <pre className="text-xs p-3 bg-gray-100 rounded">{`ENV:
  DATABASE_URL:           ${Boolean(process.env.DATABASE_URL)}
  DATABASE_URL_UNPOOLED:  ${Boolean(process.env.DATABASE_URL_UNPOOLED)}
  PII_ENC_KEY:            ${Boolean(process.env.PII_ENC_KEY)}
  ADMIN_PASS:             ${Boolean(process.env.ADMIN_PASS)}
`}</pre>
        <p className="text-sm">If any are <strong>false</strong> on Vercel, set them and redeploy.</p>
        <p><Link className="link" href="/admin/clients">Back to list</Link></p>
      </main>
    );
  }

  let rows: any[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  try {
    const prisma = await getPrisma();

    if (hasQ) {
      const seed = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000,
        include: { matches: true }, // show recommendations if present
      }) as any[];

      const ql = q.toLowerCase();
      const filtered = seed.filter((r) => {
        const fn = pick(r, ["firstName","givenName","first_name"]);
        const ln = pick(r, ["lastName","familyName","last_name"]);
        const em = pick(r, ["email","primaryEmail","contactEmail"]);
        const nm = pick(r, ["name","fullName","displayName","clientName"]);
        return [fn, ln, em, nm].some(v => toLower(v).includes(ql));
      });

      total = filtered.length;
      const start = (page - 1) * PAGE_SIZE;
      rows = filtered.slice(start, start + PAGE_SIZE);
    } else {
      total = await prisma.client.count();
      rows = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: { matches: true },
      }) as any[];
    }
  } catch (e: any) {
    console.error("ADMIN/CLIENTS ERROR:", e);
    errorMsg = e?.message ?? String(e);
  }

  if (errorMsg) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Client Submissions</h1>
        <div className="p-3 rounded-md border border-red-200 bg-red-50 text-sm text-red-800">
          <p className="font-medium">Server error while loading clients.</p>
          <pre className="mt-2 whitespace-pre-wrap">{errorMsg}</pre>
        </div>
        <p className="text-sm">
          Try <Link className="link" href="/admin/clients?debug=1">debug mode</Link> to verify env vars on Vercel.
        </p>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Client Submissions</h1>
        <span className="text-sm text-gray-500">({total} total)</span>
      </div>

      <form className="flex gap-2">
        <input className="input w-64" name="q" placeholder="Search name or email…" defaultValue={q} />
        <button className="btn-secondary" type="submit">Search</button>
        <Link className="btn-secondary" href="/admin/clients.csv">Export CSV</Link>
      </form>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Profile</th>
              <th className="text-left p-2">Recs</th>
              <th className="text-left p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const created = r?.createdAt ? new Date(r.createdAt).toLocaleString() : "";
              const nameFallback = [pick(r,["firstName","givenName","first_name"]), pick(r,["lastName","familyName","last_name"])].filter(Boolean).join(" ");
              const name = pick(r, ["name","fullName","displayName","clientName"], nameFallback) || "(unnamed)";
              const email = pick(r, ["email","primaryEmail","contactEmail"]);

              const risk = r?.riskTolerance ?? "—";
              const horizon = r?.timeHorizon ?? "—";
              const goals = Array.isArray(r?.primaryGoals) && r.primaryGoals.length > 0 ? r.primaryGoals.join(", ") : "—";

              const matches = Array.isArray(r?.matches) ? r.matches : [];
              const recSummary = matches.length
                ? matches.map((m: any) => `${m.productName} (${m.productCode})`).slice(0,3).join(" · ") + (matches.length > 3 ? ` +${matches.length - 3}` : "")
                : "—";

              return (
                <tr key={r.id ?? i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2">{created}</td>
                  <td className="p-2">{name}</td>
                  <td className="p-2">{email}</td>
                  <td className="p-2 text-xs text-gray-700">Risk: {risk} · Horizon: {horizon} · Goals: {goals}</td>
                  <td className="p-2 text-xs text-gray-700">{recSummary}</td>
                  <td className="p-2 font-mono">{r.id}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={6}>No results.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <div className="ml-auto flex gap-2">
          {page > 1 && (
            <Link className="btn-secondary" href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>Prev</Link>
          )}
          {page < totalPages && (
            <Link className="btn-secondary" href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>Next</Link>
          )}
        </div>
      </nav>
    </main>
  );
}