// src/app/admin/clients/page.tsx
import Link from "next/link";
import { prisma } from "../../../prisma";
import { getAdvisorIdFromCookie } from "../../../lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toLower(s: unknown) {
  return (s ?? "").toString().toLowerCase();
}

export default async function AdminClients(props: any) {
  const advisorId = await getAdvisorIdFromCookie();
  if (!advisorId) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-red-700">
          Unauthorized: missing or invalid admin token.
        </h1>
        <p className="text-sm text-gray-600">
          Access this page using your personalized admin link containing{" "}
          <code>?admin_token=...</code>.
        </p>
      </main>
    );
  }

  const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // ---------- Analytics (advisor scoped) ----------
  let totalClients = 0;
  let last7d = 0;
  let riskMix: Record<string, number> = {};
  let goalMix: Record<string, number> = {};
  let analyticsError: string | null = null;

  try {
    totalClients = await prisma.client.count({ where: { advisorId } });
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    last7d = await prisma.client.count({
      where: { advisorId, createdAt: { gte: sevenDaysAgo } },
    });

    const recent = await prisma.client.findMany({
      where: { advisorId },
      orderBy: { createdAt: "desc" },
      take: 5000,
      select: { riskTolerance: true, primaryGoals: true },
    });

    for (const r of recent) {
      const risk = toLower(r.riskTolerance || "unknown");
      riskMix[risk] = (riskMix[risk] ?? 0) + 1;
      const goals = Array.isArray(r.primaryGoals) ? r.primaryGoals : [];
      for (const g of goals) goalMix[g] = (goalMix[g] ?? 0) + 1;
    }
  } catch (e: any) {
    console.error("ADMIN/CLIENTS analytics error:", e);
    analyticsError = e?.message ?? "Analytics unavailable";
  }

  // ---------- Table data ----------
  const PAGE_SKIP = (page - 1) * PAGE_SIZE;
  let rows: any[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  const SELECT_FIELDS = {
    id: true,
    createdAt: true,
    firstName: true,
    lastName: true,
    email: true,
    riskTolerance: true,
    timeHorizon: true,
    primaryGoals: true,
  } as const;

  try {
    if (hasQ) {
      const all = await prisma.client.findMany({
        where: { advisorId },
        orderBy: { createdAt: "desc" },
        select: SELECT_FIELDS,
      });
      const qLower = q.toLowerCase();
      const filtered = all.filter((r) =>
        [r.firstName, r.lastName, r.email]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(qLower))
      );
      total = filtered.length;
      rows = filtered.slice(PAGE_SKIP, PAGE_SKIP + PAGE_SIZE);
    } else {
      total = await prisma.client.count({ where: { advisorId } });
      rows = await prisma.client.findMany({
        where: { advisorId },
        orderBy: { createdAt: "desc" },
        skip: PAGE_SKIP,
        take: PAGE_SIZE,
        select: SELECT_FIELDS,
      });
    }
  } catch (e: any) {
    console.error("ADMIN/CLIENTS table error:", e);
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
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const riskEntries = Object.entries(riskMix).sort((a, b) => b[1] - a[1]);
  const goalEntries = Object.entries(goalMix).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const riskMax = Math.max(1, ...riskEntries.map(([, v]) => v));
  const goalMax = Math.max(1, ...goalEntries.map(([, v]) => v));

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Header row with Export */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Client Submissions</h1>
          <span className="text-sm text-gray-500">({totalClients} total)</span>
        </div>
        <div className="ml-auto">
          {/* Export CSV (advisor-scoped on server) */}
          <a
            href="/api/clients/export"
            className="btn-secondary"
            download
            title="Download recent client submissions as CSV"
          >
            Export CSV
          </a>
        </div>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <input
          className="input w-64"
          name="q"
          placeholder="Search name or email…"
          defaultValue={q}
        />
        <button className="btn-secondary" type="submit">
          Search
        </button>
      </form>

      {/* Analytics */}
      {!analyticsError && (
        <section className="grid gap-4 md:grid-cols-2">
          <Card title="Risk Mix (your clients)">
            <div className="space-y-2">
              {riskEntries.length === 0 && (
                <p className="text-sm text-slate-600">No data.</p>
              )}
              {riskEntries.map(([key, count]) => (
                <Bar key={key} label={key} count={count} max={riskMax} />
              ))}
            </div>
          </Card>
          <Card title="Top Goals (your clients)">
            <div className="space-y-2">
              {goalEntries.length === 0 && (
                <p className="text-sm text-slate-600">No data.</p>
              )}
              {goalEntries.map(([key, count]) => (
                <Bar key={key} label={key} count={count} max={goalMax} />
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Risk</th>
              <th className="text-left p-2">Goals</th>
              <th className="text-left p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const created = r?.createdAt
                ? new Date(r.createdAt).toLocaleString()
                : "";
              const name = `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "(unnamed)";
              const goals =
                Array.isArray(r.primaryGoals) && r.primaryGoals.length > 0
                  ? r.primaryGoals.join(", ")
                  : "—";

              return (
                <tr key={r.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2">{created}</td>
                  <td className="p-2">{name}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.riskTolerance ?? "—"}</td>
                  <td className="p-2">{goals}</td>
                  <td className="p-2 font-mono">{r.id}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <nav className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="ml-auto flex gap-2">
          {page > 1 && (
            <Link
              className="btn-secondary"
              href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            >
              Prev
            </Link>
          )}
          {page < totalPages && (
            <Link
              className="btn-secondary"
              href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
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
  const pct = Math.max(4, Math.round((count / Math.max(1, max)) * 100));
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