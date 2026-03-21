import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminAccess, hasBackofficeAccess } from "@/lib/admin-auth";
import { prisma } from "@/prisma";
import PrivacyRequestsClient from "./PrivacyRequestsClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPrivacyRequestsPage() {
  const access = await getAdminAccess();
  if (!access || !hasBackofficeAccess(access)) notFound();

  const [requests, advisors] = await Promise.all([
    prisma.privacyRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        requestType: true,
        status: true,
        source: true,
        subjectType: true,
        email: true,
        name: true,
        firm: true,
        relationship: true,
        advisorId: true,
        advisor: {
          select: {
            id: true,
            name: true,
            firm: true,
          },
        },
        dueAt: true,
        reviewedAt: true,
        reviewedBy: true,
        completedAt: true,
        legalHold: true,
        identityVerifiedAt: true,
        details: true,
        resolutionSummary: true,
        metadata: true,
      },
    }),
    prisma.advisor.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        firm: true,
      },
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Privacy and Retention Queue</h1>
          <p className="text-sm text-slate-500">
            Handle data requests, deletion workflows, retention reviews, and legal holds in one
            backoffice queue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/privacy/request">
            Public request form
          </Link>
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/admin/clients">
            Back to Clients
          </Link>
        </div>
      </header>

      <PrivacyRequestsClient
        initialRequests={requests.map((request) => ({
          ...request,
          createdAt: request.createdAt.toISOString(),
          updatedAt: request.updatedAt.toISOString(),
          dueAt: request.dueAt?.toISOString() ?? null,
          reviewedAt: request.reviewedAt?.toISOString() ?? null,
          completedAt: request.completedAt?.toISOString() ?? null,
          identityVerifiedAt: request.identityVerifiedAt?.toISOString() ?? null,
        }))}
        advisors={advisors}
      />
    </main>
  );
}
