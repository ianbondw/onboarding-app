import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";
import { prisma } from "@/lib/prisma";                // ⬅️ swap to alias
import { getAdvisorIdFromCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } };

export default async function ClientBriefPage({ params }: PageProps) {
  const clientId = params?.id?.trim();
  if (!clientId) notFound();

  const advisorId = await getAdvisorIdFromCookie();
  if (!advisorId) notFound();

  const [client, matches] = await prisma.$transaction([
    prisma.client.findFirst({
      where: { id: clientId, advisorId },
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
        consentAcceptedAt: true,
        onboardingStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.productMatch.findMany({
      where: { clientId: clientId },
      select: {
        productCode: true,
        productName: true,
        rationale: true,
        riskBand: true,
      },
      orderBy: { productCode: "asc" },
    }),
  ]);

  if (!client) notFound();

  const fullName = [client.firstName, client.lastName].filter(Boolean).join(" ") || "(Unnamed)";
  const fmt = (d?: Date | null) => (d ? new Date(d).toLocaleDateString() : "—");
  const yesNo = (b?: boolean | null) => (b ? "Yes" : "No");

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Brief</h1>
        <div className="flex gap-2">
          <PrintButton />
        </div>
      </header>

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
          <div><span className="text-gray-500">Risk Tolerance: </span>{client.riskTolerance || "—"}</div>
          <div><span className="text-gray-500">Time Horizon: </span>{client.timeHorizon || "—"}</div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Primary Goals: </span>
            {Array.isArray(client.primaryGoals) && client.primaryGoals.length
              ? client.primaryGoals.join(", ")
              : "—"}
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Liquidity Needs: </span>
            {client.liquidityNeeds || "—"}
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Constraints: </span>
            {Array.isArray(client.constraints) && client.constraints.length
              ? client.constraints.join(", ")
              : "—"}
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Experience: </span>
            {client.investmentExperience || "—"}
          </div>
        </div>
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
    </main>
  );
}