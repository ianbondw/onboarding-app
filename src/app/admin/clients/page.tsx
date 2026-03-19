// src/app/admin/clients/page.tsx
import Link from "next/link";
import { prisma } from "../../../prisma";
import SentryInit from "./SentryInit";
import QuickActions from "@/components/QuickActions";
import StatusCell from "./StatusCell";
import { canManagePortalUsers, getAdminAccess } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toLower(s: unknown) {
  return (s ?? "").toString().toLowerCase();
}

function computeMissing(r: any): string {
  const missing: string[] = [];
  if (!r.firstName || !r.lastName) missing.push("name");
  if (!r.email) missing.push("email");
  if (!r.annualIncomeBand) missing.push("income");
  if (!r.riskTolerance) missing.push("risk");
  if (!r.timeHorizon) missing.push("horizon");
  if (!Array.isArray(r.primaryGoals) || r.primaryGoals.length === 0) missing.push("goals");
  return missing.slice(0, 3).join(", "); // keep short
}

export default async function AdminClients(props: any) {
  const access = await getAdminAccess();
  const ownerMode = access?.role === "owner";
  const advisorId = access?.role === "advisor" ? access.advisorId || undefined : undefined;

  if (!access) {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-red-700">Unauthorized: missing or invalid portal session.</h1>
        <p className="text-sm text-gray-600">
          Sign in at <code>/admin/login</code>, or use your advisor access link with{" "}
          <code>?admin_token=...</code>.
        </p>
      </main>
    );
  }

  const searchParams = props?.searchParams ?? {};
  const firmRaw = Array.isArray(searchParams.firm) ? searchParams.firm[0] : searchParams.firm;
  const firmCodeParam: string | undefined = firmRaw ? String(firmRaw) : undefined;

  // Status filter
  const statusRaw = Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status;
  const statusFilter = (statusRaw ?? "").toString().toLowerCase().trim();

  let advisor: { name: string | null; firm: string | null } | null = null;
  try {
    if (advisorId) {
      advisor = await prisma.advisor.findUnique({
        where: { id: advisorId },
        select: { name: true, firm: true },
      });
    }
  } catch (e) {
    console.error("ADMIN/CLIENTS advisor lookup error:", e);
  }
  const sentryFirmCode = advisor?.firm ?? firmCodeParam;

  const PAGE_SIZE = 20;
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // ---------- Analytics ----------
  let totalClients = 0;
  let riskMix: Record<string, number> = {};
  let goalMix: Record<string, number> = {};
  let analyticsError: string | null = null;
  let leadSummary = { total: 0, activated: 0 };
  let recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    firm: string | null;
    status: string;
    createdAt: Date;
  }> = [];

  try {
    const baseWhere: any = advisorId ? { advisorId } : {};
    totalClients = await prisma.client.count({ where: baseWhere });

    const recent = await prisma.client.findMany({
      where: baseWhere,
      orderBy: { createdAt: "asc" },
      take: 5000,
      select: { riskTolerance: true, primaryGoals: true },
    });

    for (const r of recent) {
      const risk = toLower(r.riskTolerance || "unknown");
      riskMix[risk] = (riskMix[risk] ?? 0) + 1;
      const goals = Array.isArray(r.primaryGoals) ? r.primaryGoals : [];
      for (const g of goals) goalMix[g] = (goalMix[g] ?? 0) + 1;
    }

    if (ownerMode) {
      leadSummary.total = await prisma.trialLead.count();
      leadSummary.activated = await prisma.trialLead.count({
        where: { status: "activated" },
      });
      recentLeads = await prisma.trialLead.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          name: true,
          email: true,
          firm: true,
          status: true,
          createdAt: true,
        },
      });
    }
  } catch (e: any) {
    console.error("ADMIN/CLIENTS analytics error:", e);
    analyticsError = e?.message ?? "Analytics unavailable";
  }

  // ---------- Table ----------
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
    annualIncomeBand: true,
    advisorId: true,
    onboardingStatus: true,
    onboardingProgress: true,
    identityVerificationStatus: true,
    documentVerificationStatus: true,
    intakeToken: true,
    concernsNarrative: true, // next-convo topic
    clientFieldFlags: {
      where: { status: "open" },
      select: { id: true },
    },
  } as const;

  try {
    const baseWhere: any = advisorId ? { advisorId } : {};
    const whereWithStatus = statusFilter
      ? { ...baseWhere, onboardingStatus: statusFilter as any }
      : baseWhere;

    if (hasQ) {
      const all = await prisma.client.findMany({
        where: whereWithStatus,
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
      total = await prisma.client.count({ where: whereWithStatus });
      rows = await prisma.client.findMany({
        where: whereWithStatus,
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
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-medium">Server error while loading clients.</p>
          <pre className="mt-2 whitespace-pre-wrap">{errorMsg}</pre>
        </div>
      </main>
    );
  }

  const riskEntries = Object.entries(riskMix).sort((a, b) => b[1] - a[1]);
  const goalEntries = Object.entries(goalMix).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const riskMax = Math.max(1, ...riskEntries.map(([, v]) => v));
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || "https://marengofinance-app.com";

  const STATUS_FILTERS: { key: string; label: string }[] = [
    { key: "", label: "All" },
    { key: "in_progress", label: "In Progress" },
    { key: "verified", label: "Verified" },
    { key: "declined", label: "Declined" },
  ];

  return (
    <>
      <SentryInit firmCode={sentryFirmCode} advisorId={advisorId} />
      {/* Wider container so the table breathes */}
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold">
                Client Submissions {advisorId ? "(Your Clients)" : "(All Advisors)"}
              </h1>
              {advisorId && (
                <p className="text-sm text-gray-600">
                  Advisor:&nbsp;
                  <span className="font-medium text-gray-900">{advisor?.name ?? "Unknown"}</span>
                  {advisor?.firm ? <span> — {advisor.firm}</span> : null}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-500">({rows.length} of {total})</span>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              {canManagePortalUsers(access) ? (
                <Link href="/admin/users" className="btn-secondary">
                  Portal Users
                </Link>
              ) : null}
              <a href="/admin/clients.csv" className="btn-secondary" download>
                Export CSV
              </a>
            </div>
          </div>
        </div>

        {/* Status filter bar */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(({ key, label }) => {
            const active = statusFilter === key;
            const href = key ? `/admin/clients?status=${encodeURIComponent(key)}` : "/admin/clients";
            return (
              <Link
                key={key || "all"}
                href={active ? "/admin/clients" : href}
                className={`px-3 py-1 rounded-full border text-sm ${active ? "bg-black text-white" : "hover:bg-gray-100"}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {ownerMode && (
          <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card title="Trial Funnel">
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-500">Total trial requests</div>
                  <div className="text-2xl font-semibold text-slate-900">{leadSummary.total}</div>
                </div>
                <div>
                  <div className="text-slate-500">Activated trials</div>
                  <div className="text-2xl font-semibold text-slate-900">{leadSummary.activated}</div>
                </div>
                <div>
                  <div className="text-slate-500">Activation rate</div>
                  <div className="text-2xl font-semibold text-slate-900">
                    {leadSummary.total > 0
                      ? `${Math.round((leadSummary.activated / leadSummary.total) * 100)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Recent Trial Requests">
              <div className="space-y-3 text-sm">
                {recentLeads.length === 0 ? (
                  <p className="text-slate-600">No trial requests yet.</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        <div className="text-slate-500">
                          {lead.email}
                          {lead.firm ? ` · ${lead.firm}` : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{lead.status}</div>
                        <div className="text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>
        )}

        {!analyticsError && (
          <section className="grid gap-4 md:grid-cols-2">
            <Card title={`Risk Mix ${advisorId ? "(your clients)" : "(all advisors)"}`}>
              <div className="space-y-2">
                {riskEntries.length === 0 && <p className="text-sm text-slate-600">No data.</p>}
                {riskEntries.map(([key, count]) => (
                  <Bar key={key} label={key} count={count} max={riskMax} />
                ))}
              </div>
            </Card>
            <Card title={`Top Goals ${advisorId ? "(your clients)" : "(all advisors)"}`}>
              <div className="space-y-2">
                {goalEntries.length === 0 && <p className="text-sm text-slate-600">No data.</p>}
                {goalEntries.map(([key]) => (
                  <Bar key={key} label={key} count={goalMix[key]} max={goalMix[key]} />
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Make table horizontally scrollable so columns never vanish */}
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full min-w-[1200px] text-[13px]">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="p-2 text-left whitespace-nowrap">Created</th>
                <th className="p-2 text-left whitespace-nowrap">Name</th>
                <th className="p-2 text-left whitespace-nowrap">Email</th>
                <th className="p-2 text-left whitespace-nowrap">Risk</th>
                <th className="p-2 text-left whitespace-nowrap">Goals</th>
                <th className="p-2 text-left whitespace-nowrap">Next conversation</th>
                <th className="p-2 text-left whitespace-nowrap">Status</th>
                <th className="p-2 text-left whitespace-nowrap">Progress</th>
                <th className="p-2 text-left whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    Brief
                    <span
                      className="cursor-help text-xs text-gray-500"
                      title="Opens the printable Client Brief: profile, assets, goals (incl. per-goal settings), recommendations, and open flags."
                    >
                      ⓘ
                    </span>
                  </span>
                </th>
                <th className="p-2 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const created = r?.createdAt ? new Date(r.createdAt).toLocaleString() : "";
                const name = `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || "(unnamed)";
                const goals =
                  Array.isArray(r.primaryGoals) && r.primaryGoals.length > 0
                    ? r.primaryGoals.join(", ")
                    : "—";
                const openFlagCount = (r as any).clientFieldFlags?.length ?? 0;
                const missing = computeMissing(r);
                const inviteUrl = r.intakeToken ? `${appOrigin}/onboarding/${r.intakeToken}` : "";

                return (
                  <tr key={r.id} className="transition border-t hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">{created}</td>
                    <td className="p-2 whitespace-nowrap">{name}</td>
                    <td className="p-2 whitespace-nowrap">
                      <a className="link" href={`mailto:${r.email}`}>{r.email}</a>
                    </td>
                    <td className="p-2 whitespace-nowrap">{r.riskTolerance ?? "—"}</td>
                    <td className="p-2 whitespace-nowrap">{goals}</td>
                    <td className="p-2">
                      <span className="truncate inline-block max-w-[320px]" title={r.concernsNarrative || undefined}>
                        {r.concernsNarrative || "—"}
                      </span>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {openFlagCount > 0 && (
                          <span className="ml-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                            ⚑ {openFlagCount}
                          </span>
                        )}
                        <StatusCell id={r.id} initial={r.onboardingStatus} />
                        {missing && (
                          <span className="hidden md:inline text-xs text-gray-500">• missing: {missing}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2" style={{ minWidth: 170 }}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded bg-gray-200">
                          <div
                            className="h-2 rounded bg-black"
                            style={{ width: `${Math.min(100, Math.max(0, r.onboardingProgress ?? 0))}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums">
                          {Math.min(100, Math.max(0, r.onboardingProgress ?? 0))}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <Link className="link underline" href={`/admin/clients/${r.id}/brief`}>
                        Brief
                      </Link>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {inviteUrl ? (
                        <QuickActions
                          inviteUrl={inviteUrl}
                          resendHref={`/api/admin/clients/${r.id}/resend-invite`}
                          flagsCount={openFlagCount}
                        />
                      ) : (
                        <span className="text-xs text-gray-500">No link</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={10}>
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
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
