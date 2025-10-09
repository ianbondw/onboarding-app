// src/app/admin/clients/page.tsx
import Link from "next/link";

export const runtime = "nodejs";        // ensure Prisma runs on Node in Vercel
export const dynamic = "force-dynamic"; // SSR + fresh data

// Lazy import Prisma (keeps cold starts lighter)
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function pick(obj: any, keys: string[], fallback = "") {
  for (const k of keys) if (obj && obj[k] != null) return String(obj[k]);
  return fallback;
}
function toLower(s: unknown) {
  return (s ?? "").toString().toLowerCase();
}

export default async function AdminClients(props: any) {
  const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;

  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // Debug – quick env inspector
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

  const prisma = await getPrisma();

  // ---------- Analytics (computed over ALL clients, not just this page) ----------
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const GOALS = ["retirement", "income", "growth", "education", "legacy", "tax"] as const;

  // Run analytics queries in parallel
  const [
    totalClients,
    last7d,
    riskGroupRaw,
    goalCountsArray,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.client.groupBy({
      by: ["riskTolerance"],
      _count: { _all: true },
    }),
    Promise.all(
      GOALS.map(async (g) => ({
        goal: g,
        count: await prisma.client.count({ where: { primaryGoals: { has: g } } }),
      }))
    ),
  ]);

  // Normalize risk mix
  const riskMix: Record<string, number> = {};
  for (const row of riskGroupRaw) {
    const key = (row.riskTolerance ?? "unknown").toLowerCase();
    riskMix[key] = (riskMix[key] ?? 0) + row._count._all;
  }

  // Sort goals by freq (desc)
  const goalMix: Record<string, number> = {};
  for (const { goal, count } of goalCountsArray) goalMix[goal] = count;
  const goalTopEntries = Object.entries(goalMix).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // ---------- Table data (paged) ----------
  let rows: any[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  try {
    if (hasQ) {
      const seed = (await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000,
        include: { matches: true },
      })) as any[];

      const ql = q.toLowerCase();
      const filtered = seed.filter((r) => {
        const fn = pick(r, ["firstName", "givenName", "first_name"]);
        const ln = pick(r, ["lastName", "familyName", "last_name"]);
        const em = pick(r, ["email", "primaryEmail", "contactEmail"]);
        const nm = pick(r, ["name", "fullName", "displayName", "clientName"]);
        return [fn, ln, em, nm].some((v) => toLower(v).includes(ql));
      });

      total = filtered.length;
      const start = (page - 1) * PAGE_SIZE;
      rows = filtered.slice(start, start + PAGE_SIZE);
    } else {
      total = await prisma.client.count();
      rows = (await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: { matches: true },
      })) as any[];
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Helpers for tiny bar charts
  const riskEntries = Object.entries(riskMix).sort((a, b) => b[1] - a[1]);
  const riskMax = Math.max(1, ...riskEntries.map(([, v]) => v));
  const goalMax = Math.max(1, ...goalTopEntries.map(([, v]) => v));

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Client Submissions</h1>
        <span className="text-sm text-gray-500">({totalClients} total)</span>
      </div>

      {/* Filters */}
      <form className="flex gap-2">
        <input className="input w-64" name="q" placeholder="Search name or email…" defaultValue={q} />
        <button className="btn-secondary" type="submit">Search</button>
        <Link className="btn-secondary" href="/admin/clients.csv">Export CSV</Link>
      </form>

      {/* Summary tiles */}
      <section className="grid gap-4 md:grid-cols-4">
        <Tile label="Total clients" value={String(totalClients)} />
        <Tile label="New (7 days)" value={String(last7d)} />
        <Tile
          label="Risk mix"
          value={
            riskEntries.length
              ? riskEntries.map(([k, v]) => `${k}:${v}`).join(" · ")
              : "—"
          }
        />
        <Tile
          label="Top goals"
          value={
            goalTopEntries.length
              ? goalTopEntries.slice(0, 3).map(([k, v]) => `${k}:${v}`).join(" · ")
              : "—"
          }
        />
      </section>

      {/* Analytics mini-charts */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card title="Risk Mix (all clients)">
          <div className="space-y-2">
            {riskEntries.length === 0 && <p className="text-sm text-slate-600">No data.</p>}
            {riskEntries.map(([key, count]) => (
              <Bar key={key} label={key} count={count} max={riskMax} />
            ))}
          </div>
        </Card>

        <Card title="Top Goals (all clients)">
          <div className="space-y-2">
            {goalTopEntries.length === 0 && <p className="text-sm text-slate-600">No data.</p>}
            {goalTopEntries.map(([key, count]) => (
              <Bar key={key} label={key} count={count} max={goalMax} />
            ))}
          </div>
        </Card>
      </section>

      {/* Table */}
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
              const nameFallback = [pick(r, ["firstName", "givenName", "first_name"]), pick(r, ["lastName", "familyName", "last_name"])]
                .filter(Boolean)
                .join(" ");
              const name = pick(r, ["name", "fullName", "displayName", "clientName"], nameFallback) || "(unnamed)";
              const email = pick(r, ["email", "primaryEmail", "contactEmail"]);

              const risk = r?.riskTolerance ?? "—";
              const horizon = r?.timeHorizon ?? "—";
              const goals = Array.isArray(r?.primaryGoals) && r.primaryGoals.length > 0 ? r.primaryGoals.join(", ") : "—";

              const matches = Array.isArray(r?.matches) ? r.matches : [];
              const recSummary = matches.length
                ? matches.map((m: any) => `${m.productName} (${m.productCode})`).slice(0, 3).join(" · ") +
                  (matches.length > 3 ? ` +${matches.length - 3}` : "")
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
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>No results.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <nav className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <div className="ml-auto flex gap-2">
          {page > 1 && (
            <Link className="btn-secondary" href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Prev
            </Link>
          )}
          {page < totalPages && (
            <Link className="btn-secondary" href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}

/** UI helpers */
function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = Math.max(4, Math.round((count / Math.max(1, max)) * 100)); // ensure visible min width
  return (
    <div className="text-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="capitalize text-slate-700">{label}</span>
        <span className="tabular-nums text-slate-500">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}