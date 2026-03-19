// src/app/admin/clients/[id]/brief/page.tsx
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";
import ComplianceReviewCard from "./ComplianceReviewCard";
import { prisma } from "@/prisma";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import GoalGrid from "@/components/GoalGrid";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function ClientBriefPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const clientId = rawId?.trim();
  if (!clientId) notFound();

  const access = await getAdminAccess();
  if (!access) notFound();

  const [client, matches, flags] = await prisma.$transaction([
    prisma.client.findFirst({
      where:
        hasBackofficeAccess(access)
          ? { id: clientId }
          : { id: clientId, advisorId: access.advisorId || "" },
      select: {
        id: true,
        advisorId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        citizenship: true,
        identityVerificationStatus: true,
        documentVerificationStatus: true,
        idDocType: true,
        idDocProviderRef: true,
        reviewNotes: true,
        reviewedAt: true,
        reviewedBy: true,
        employmentStatus: true,
        employerName: true,
        annualIncomeBand: true,
        sourceOfFunds: true,
        liquidAssetsBand: true,
        illiquidAssetsBand: true,
        liabilitiesBand: true,
        netWorthBand: true,
        hasIRA: true,
        has401k: true,
        hasTaxable: true,
        hasCrypto: true,
        hasRealEstate: true,
        riskTolerance: true,
        timeHorizon: true,
        primaryGoals: true,
        liquidityNeeds: true,
        constraints: true,
        investmentExperience: true,
        concernsNarrative: true,
        goalsDetail: true, // per-goal JSON source of truth
        consentAcceptedAt: true,
        onboardingStatus: true,
        onboardingProgress: true, // show progress bar on Brief
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.productMatch.findMany({
      where: { clientId },
      select: { productCode: true, productName: true, rationale: true, riskBand: true },
      orderBy: { productCode: "asc" },
    }),
    prisma.clientFieldFlag.findMany({
      where:
        hasBackofficeAccess(access)
          ? { clientId, status: "open" }
          : { clientId, advisorId: access.advisorId || "", status: "open" },
      select: { id: true, fieldKey: true, note: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!client) notFound();

  const fullName = [client.firstName, client.lastName].filter(Boolean).join(" ") || "(Unnamed)";
  const fmt = (d?: Date | null) => (d ? new Date(d).toLocaleDateString() : "—");
  const yesNo = (b?: boolean | null) => (b ? "Yes" : "No");

  // ---- Type-safe per-goal map (ensure optional fields exist on the type) ----
  type GoalDetail = {
    risk?: string;
    horizon?: string;
    amountBand?: string;
    priority?: boolean;
    liquidity?: string;
  };

  const rawGoalsDetail = (client as any).goalsDetail as Record<string, GoalDetail> | null;

  const goalsDetailForGrid: Record<string, GoalDetail> =
    rawGoalsDetail && Object.keys(rawGoalsDetail).length > 0
      ? (rawGoalsDetail as Record<string, GoalDetail>)
      : Array.isArray(client.primaryGoals)
      ? (Object.fromEntries(
          client.primaryGoals.map((g) => [
            g,
            {
              risk: client.riskTolerance || "moderate",
              horizon: client.timeHorizon || "5-10y",
            } as GoalDetail,
          ])
        ) as Record<string, GoalDetail>)
      : {};

  const perGoalKeys =
    Object.keys(goalsDetailForGrid).length > 0
      ? Object.keys(goalsDetailForGrid)
      : Array.isArray(client.primaryGoals)
      ? client.primaryGoals
      : [];

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Brief</h1>
        <div className="flex gap-2">
          <PrintButton />
        </div>
      </header>

      {/* Progress bar */}
      {typeof client.onboardingProgress === "number" && (
        <section className="rounded-2xl border p-4">
          <div className="mb-1 text-sm font-medium">Onboarding Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded bg-gray-200">
              <div
                className="h-2 rounded bg-black"
                style={{
                  width: `${Math.min(100, Math.max(0, client.onboardingProgress ?? 0))}%`,
                }}
              />
            </div>
            <span className="text-xs tabular-nums">
              {Math.min(100, Math.max(0, client.onboardingProgress ?? 0))}%
            </span>
          </div>
        </section>
      )}

      <section className="rounded-2xl border p-5 space-y-1">
        <h2 className="text-lg font-medium">{fullName}</h2>
        <p className="text-sm text-gray-600">{client.email || "No email provided"}</p>
        {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
        <p className="text-sm">
          {[
            client.addressLine1,
            client.addressLine2,
            [client.city, client.state].filter(Boolean).join(", "),
            client.postalCode,
            client.country,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="text-sm text-gray-600">
          <span>DOB: {fmt(client.dateOfBirth)}</span>
          <span className="mx-2">•</span>
          <span>Citizenship: {client.citizenship || "—"}</span>
        </div>
        <div className="text-sm text-gray-600">
          <span>Status: {client.onboardingStatus || "in_progress"}</span>
          <span className="mx-2">•</span>
          <span>Consent: {fmt(client.consentAcceptedAt)}</span>
        </div>
        <div className="text-xs text-gray-500">
          <span>Created: {fmt(client.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>Updated: {fmt(client.updatedAt)}</span>
        </div>
      </section>

      <ComplianceReviewCard
        clientId={client.id}
        identityVerificationStatus={client.identityVerificationStatus || "pending"}
        documentVerificationStatus={client.documentVerificationStatus || "pending"}
        idDocType={client.idDocType || null}
        idDocProviderRef={client.idDocProviderRef || null}
        reviewNotes={client.reviewNotes || null}
        reviewedAt={client.reviewedAt ? client.reviewedAt.toISOString() : null}
        reviewedBy={client.reviewedBy || null}
      />

      {/* Plan at a glance: visual grid of goals */}
      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Plan at a glance</h3>
        <GoalGrid goalsDetail={goalsDetailForGrid as any} />
      </section>

      {/* Topics for next meeting */}
      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Topics for next meeting</h3>
        {client.concernsNarrative ? (
          <div className="whitespace-pre-wrap border rounded-lg p-3">
            {client.concernsNarrative}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No topics captured yet.</div>
        )}
        <div className="mt-1">
          <a href="#" className="inline-block px-3 py-2 border rounded-md">
            Schedule
          </a>
        </div>
      </section>

      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div><span className="text-gray-500">Employment: </span>{client.employmentStatus || "—"}</div>
          <div><span className="text-gray-500">Employer: </span>{client.employerName || "—"}</div>
          <div><span className="text-gray-500">Annual Income: </span>{client.annualIncomeBand || "—"}</div>
          <div><span className="text-gray-500">Source of Funds: </span>{client.sourceOfFunds || "—"}</div>
          <div><span className="text-gray-500">Liquid Assets: </span>{client.liquidAssetsBand || "—"}</div>
          <div><span className="text-gray-500">Illiquid Assets: </span>{client.illiquidAssetsBand || "—"}</div>
          <div><span className="text-gray-500">Liabilities: </span>{client.liabilitiesBand || "—"}</div>
          <div><span className="text-gray-500">Net Worth: </span>{client.netWorthBand || "—"}</div>
          <div><span className="text-gray-500">IRA: </span>{yesNo(client.hasIRA)}</div>
          <div><span className="text-gray-500">401(k): </span>{yesNo(client.has401k)}</div>
          <div><span className="text-gray-500">Taxable: </span>{yesNo(client.hasTaxable)}</div>
          <div><span className="text-gray-500">Crypto: </span>{yesNo(client.hasCrypto)}</div>
          <div><span className="text-gray-500">Real Estate: </span>{yesNo(client.hasRealEstate)}</div>
        </div>
      </section>

      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Investment Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div><span className="text-gray-500">Overall Risk: </span>{client.riskTolerance || "—"}</div>
          <div><span className="text-gray-500">Overall Horizon: </span>{client.timeHorizon || "—"}</div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Primary Goals: </span>
            {Array.isArray(client.primaryGoals) && client.primaryGoals.length
              ? client.primaryGoals.join(", ")
              : "—"}
          </div>
        </div>

        {/* Per-goal settings table */}
        {perGoalKeys.length > 0 && (
          <div className="mt-4 rounded-xl border p-3">
            <div className="text-sm font-medium mb-2">Per-goal settings</div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Goal</th>
                  <th className="p-2 text-left">Risk</th>
                  <th className="p-2 text-left">Horizon</th>
                  <th className="p-2 text-left">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {perGoalKeys.map((g) => (
                  <tr key={g} className="border-t">
                    <td className="p-2 capitalize">{g}</td>
                    <td className="p-2">
                      {goalsDetailForGrid?.[g]?.risk || client.riskTolerance || "—"}
                    </td>
                    <td className="p-2">
                      {goalsDetailForGrid?.[g]?.horizon || client.timeHorizon || "—"}
                    </td>
                    <td className="p-2">
                      {goalsDetailForGrid?.[g]?.liquidity || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Recommended Products</h3>
        {matches.length === 0 ? (
          <p className="text-sm text-gray-600">No recommendations yet.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {matches.map((m) => (
              <li key={m.productCode}>
                <span className="font-medium">{m.productName}</span>
                {m.riskBand ? <span className="text-gray-500"> — {m.riskBand}</span> : null}
                <div className="text-gray-600">{m.rationale}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border p-5 space-y-2">
        <h3 className="font-medium">Client Flags</h3>
        {flags.length === 0 ? (
          <p className="text-sm text-gray-600">No open flags.</p>
        ) : (
          <ul className="space-y-3">
            {flags.map((f) => (
              <li key={f.id} className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm">
                    <span className="font-medium">{f.fieldKey}</span>
                    {f.note ? <span className="text-gray-600"> — {f.note}</span> : null}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleString()}</div>
                </div>
                {/* Resolve button posts to your existing resolve route */}
                <form
                  action={async () => {
                    "use server";
                    await fetch(`/api/admin/clients/${clientId}/flags/resolve`, {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ flagId: f.id }),
                    });
                  }}
                >
                  <button type="submit" className="text-xs rounded-md border px-2 py-1">
                    Resolve
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
