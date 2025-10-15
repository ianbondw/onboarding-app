// src/app/admin/clients/[id]/brief/page.tsx
import Link from "next/link";
import { getAdvisorIdFromCookie } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lazy Prisma import */
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

function Label({ children }: { children: React.ReactNode }) {
  return <dt className="text-slate-600">{children}</dt>;
}
function Value({ children }: { children: React.ReactNode }) {
  return <dd className="font-medium text-slate-900">{children ?? "—"}</dd>;
}

export default async function ClientBrief(props: { params: Promise<{ id: string }> }) {
  // In this project setup, `params` is a Promise — await it:
  const { id } = await props.params;

  const prisma = await getPrisma();
  const advisorId = await getAdvisorIdFromCookie();
  const where: any = advisorId ? { id, advisorId } : { id };

  const client = await prisma.client.findFirst({
    where,
    select: {
      id: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,

      employmentStatus: true,
      employerName: true,
      annualIncomeBand: true,

      liquidAssetsBand: true,
      illiquidAssetsBand: true,
      liabilitiesBand: true,
      netWorthBand: true,

      riskTolerance: true,
      timeHorizon: true,
      primaryGoals: true,
      liquidityNeeds: true,
      constraints: true,
      investmentExperience: true,

      onboardingStatus: true,
      consentAcceptedAt: true,
    },
  });

  if (!client) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold text-red-700">Client not found</h1>
        <p className="mt-2 text-sm">
          You may not have access to this record, or it doesn’t exist.
        </p>
        <p className="mt-4">
          <Link className="link" href="/admin/clients">
            ← Back to clients
          </Link>
        </p>
      </main>
    );
  }

  const name = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim();

  return (
    <main className="mx-auto max-w-3xl space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Brief</h1>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={() => (typeof window !== "undefined" ? window.print() : null)}
          >
            Print
          </button>
          <Link className="btn-secondary" href="/admin/clients">
            Back
          </Link>
        </div>
      </div>

      <section>
        <div className="text-sm text-slate-600">
          Created: {client.createdAt?.toLocaleString?.() || String(client.createdAt)}
          {" · "}Status:{" "}
          <span className="font-medium">{client.onboardingStatus || "new"}</span>
          {client.consentAcceptedAt ? (
            <>
              {" · "}Consent:{" "}
              <span className="font-medium">
                {new Date(client.consentAcceptedAt).toLocaleString()}
              </span>
            </>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border p-4">
          <div className="mb-2 text-sm font-semibold">Contact</div>
          <dl className="grid gap-y-2">
            <Label>Name</Label> <Value>{name || "—"}</Value>
            <Label>Email</Label> <Value>{client.email}</Value>
            <Label>Phone</Label> <Value>{client.phone}</Value>
          </dl>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-2 text-sm font-semibold">Work & Income</div>
          <dl className="grid gap-y-2">
            <Label>Employment</Label> <Value>{client.employmentStatus}</Value>
            <Label>Employer</Label> <Value>{client.employerName}</Value>
            <Label>Income</Label> <Value>{client.annualIncomeBand}</Value>
          </dl>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-2 text-sm font-semibold">Assets</div>
          <dl className="grid gap-y-2">
            <Label>Liquid assets</Label> <Value>{client.liquidAssetsBand}</Value>
            <Label>Illiquid assets</Label> <Value>{client.illiquidAssetsBand}</Value>
            <Label>Liabilities</Label> <Value>{client.liabilitiesBand}</Value>
            <Label>Estimated net worth</Label> <Value>{client.netWorthBand}</Value>
          </dl>
        </div>

        <div className="rounded-xl border p-4">
          <div className="mb-2 text-sm font-semibold">Goals & Risk</div>
          <dl className="grid gap-y-2">
            <Label>Risk tolerance</Label> <Value>{client.riskTolerance}</Value>
            <Label>Time horizon</Label> <Value>{client.timeHorizon}</Value>
            <Label>Primary goals</Label>{" "}
            <Value>
              {Array.isArray(client.primaryGoals) && client.primaryGoals.length
                ? client.primaryGoals.join(", ")
                : "—"}
            </Value>
            <Label>Liquidity needs</Label> <Value>{client.liquidityNeeds}</Value>
            <Label>Constraints</Label>{" "}
            <Value>
              {Array.isArray(client.constraints) && client.constraints.length
                ? client.constraints.join(", ")
                : "—"}
            </Value>
            <Label>Experience</Label> <Value>{client.investmentExperience}</Value>
          </dl>
        </div>
      </section>
    </main>
  );
}