import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { getAdminAccess } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function toCsvCell(v: unknown) {
  if (v == null) return "";
  const s = Array.isArray(v) ? v.join("; ") : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const access = await getAdminAccess();
  if (!access) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const where =
    access.role === "advisor"
      ? { advisorId: access.advisorId || "", retentionStatus: { not: "redacted" } }
      : { retentionStatus: { not: "redacted" } };

  const rows = await prisma.client.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      advisorName: true,
      advisorFirm: true,
      riskTolerance: true,
      timeHorizon: true,
      primaryGoals: true,
      onboardingStatus: true,
    },
  });

  const header = [
    "id",
    "createdAt",
    "advisorName",
    "advisorFirm",
    "firstName",
    "lastName",
    "email",
    "phone",
    "riskTolerance",
    "timeHorizon",
    "primaryGoals",
    "onboardingStatus",
  ].join(",");

  const lines = rows.map((r) =>
    [
      r.id,
      r.createdAt?.toISOString() ?? "",
      r.advisorName ?? "",
      r.advisorFirm ?? "",
      r.firstName ?? "",
      r.lastName ?? "",
      r.email ?? "",
      r.phone ?? "",
      r.riskTolerance ?? "",
      r.timeHorizon ?? "",
      Array.isArray(r.primaryGoals) ? r.primaryGoals.join("|") : "",
      r.onboardingStatus ?? "",
    ]
      .map(toCsvCell)
      .join(",")
  );

  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clients.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
