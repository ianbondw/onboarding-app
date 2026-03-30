import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { prisma } from "@/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  firm: string | null;
  source: string;
  status: string;
  metadata: any;
  onboardingUrl: string | null;
  adminUrl: string | null;
};

function metric<T extends string>(items: T[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = item || "(none)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

function getAttributionValue(lead: LeadRow, key: string) {
  const value = lead?.metadata?.attribution?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function getMetadataString(lead: LeadRow, key: string) {
  const value = lead?.metadata?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function formatRelativeDays(date: Date) {
  const ms = Date.now() - date.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function MetricList({
  entries,
}: {
  entries: Array<[string, number]>;
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No data yet.</p>;
  }

  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="space-y-3">
      {entries.map(([label, count]) => (
        <div key={label} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-slate-700">{label}</span>
            <span className="font-medium text-slate-900">{count}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-900"
              style={{ width: `${Math.max(12, (count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminGrowthPage() {
  const access = await getAdminAccess();
  if (!access || !hasBackofficeAccess(access)) notFound();

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);

  const [leadCount, activatedCount, recentLeads] = await Promise.all([
    prisma.trialLead.count({
      where: { retentionStatus: { not: "redacted" } },
    }),
    prisma.trialLead.count({
      where: {
        status: "activated",
        retentionStatus: { not: "redacted" },
      },
    }),
    prisma.trialLead.findMany({
      where: { retentionStatus: { not: "redacted" } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        name: true,
        email: true,
        firm: true,
        source: true,
        status: true,
        metadata: true,
        onboardingUrl: true,
        adminUrl: true,
      },
    }),
  ]);

  const leadsLast7 = recentLeads.filter((lead) => lead.createdAt >= sevenDaysAgo);
  const activatedLast7 = leadsLast7.filter((lead) => lead.status === "activated");
  const staleNewLeads = recentLeads
    .filter((lead) => lead.status === "new" && lead.createdAt <= twoDaysAgo)
    .slice(0, 8);

  const topSources = metric(leadsLast7.map((lead) => lead.source || "(none)"));
  const topCampaigns = metric(
    leadsLast7.map((lead) => getAttributionValue(lead as LeadRow, "utm_campaign") || "(none)")
  );
  const topTerms = metric(
    leadsLast7.map((lead) => getAttributionValue(lead as LeadRow, "utm_term") || "(none)")
  );
  const topPlans = metric(
    leadsLast7.map((lead) => {
      return getMetadataString(lead as LeadRow, "planName") || getMetadataString(lead as LeadRow, "plan") || "(none)";
    })
  );

  const activationRate = leadCount > 0 ? Math.round((activatedCount / leadCount) * 100) : 0;
  const weeklyActivationRate =
    leadsLast7.length > 0 ? Math.round((activatedLast7.length / leadsLast7.length) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Growth Console</h1>
          <p className="text-sm text-slate-500">
            One screen for trial demand, campaign attribution, and the next follow-up decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/demo">
            Demo page
          </Link>
          <Link
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
            href="/ria-onboarding-software"
          >
            RIA landing page
          </Link>
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/admin/clients">
            Back to Clients
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "All trial leads", value: String(leadCount) },
          { label: "All-time activation rate", value: `${activationRate}%` },
          { label: "Leads in last 7 days", value: String(leadsLast7.length) },
          { label: "7-day activation rate", value: `${weeklyActivationRate}%` },
        ].map((item) => (
          <Card key={item.label} title={item.value} subtitle={item.label}>
            <div />
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card title="Top Sources" subtitle="Last 7 days">
          <MetricList entries={topSources} />
        </Card>
        <Card title="Top Campaigns" subtitle="Last 7 days">
          <MetricList entries={topCampaigns} />
        </Card>
        <Card title="Top Search Terms" subtitle="Last 7 days">
          <MetricList entries={topTerms} />
        </Card>
        <Card title="Top Offers" subtitle="Last 7 days">
          <MetricList entries={topPlans} />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
        <Card
          title="Needs Attention"
          subtitle="New trial requests older than 2 days that still have not activated"
        >
          {staleNewLeads.length === 0 ? (
            <p className="text-sm text-slate-500">No stale new leads right now.</p>
          ) : (
            <div className="space-y-3">
              {staleNewLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-slate-900">{lead.name}</div>
                    <div className="text-sm text-slate-500">
                      {lead.email}
                      {lead.firm ? ` | ${lead.firm}` : ""}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      {lead.source} | {formatRelativeDays(lead.createdAt)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lead.onboardingUrl ? (
                      <a
                        className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                        href={lead.onboardingUrl}
                      >
                        Onboarding
                      </a>
                    ) : null}
                    {lead.adminUrl ? (
                      <a
                        className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                        href={lead.adminUrl}
                      >
                        Dashboard
                      </a>
                    ) : null}
                    <a
                      className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                      href={`mailto:${lead.email}?subject=${encodeURIComponent("Your Marengo trial workspace")}`}
                    >
                      Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="One-Hour Daily Rhythm" subtitle="What to do when you only have a small founder window">
          <div className="space-y-3 text-sm leading-7 text-slate-700">
            {[
              "10 min: open this page, check sources, campaigns, and stale leads.",
              "20 min: follow up with the oldest unactivated leads first.",
              "15 min: publish or queue one LinkedIn post tied to the demo, trust page, or RIA landing page.",
              "10 min: adjust one offer, CTA, or ad asset based on what converted.",
              "5 min: update Stripe, booking, or Search Console blockers if still unresolved.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card title="Recent Trial Leads" subtitle="Most recent 100 leads with source and campaign context">
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-500">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => {
                  const planName =
                    getMetadataString(lead as LeadRow, "planName") ||
                    getMetadataString(lead as LeadRow, "plan") ||
                    "Instant trial";
                  return (
                    <tr key={lead.id} className="border-t">
                      <td className="px-4 py-3 text-slate-500">
                        {lead.createdAt.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        <div className="text-slate-500">
                          {lead.email}
                          {lead.firm ? ` | ${lead.firm}` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{lead.source}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {getAttributionValue(lead as LeadRow, "utm_campaign") || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {getAttributionValue(lead as LeadRow, "utm_term") || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{String(planName)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border px-2 py-1 text-xs uppercase tracking-wide text-slate-700">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </main>
  );
}
