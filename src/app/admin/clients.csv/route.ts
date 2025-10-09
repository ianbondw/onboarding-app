// src/app/admin/clients.csv/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { getAdvisorIdFromCookie } from "../../../lib/session";

export const dynamic = "force-dynamic";

function toCsvCell(v: unknown) {
  if (v == null) return "";
  const s = Array.isArray(v) ? v.join("; ") : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const advisorId = await getAdvisorIdFromCookie();
  if (!advisorId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const rows = await prisma.client.findMany({
    where: { advisorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      riskTolerance: true,
      timeHorizon: true,
      primaryGoals: true,
    },
  });

  const header = [
    "id",
    "createdAt",
    "firstName",
    "lastName",
    "email",
    "phone",
    "riskTolerance",
    "timeHorizon",
    "primaryGoals",
  ].join(",");

  const lines = rows.map((r) =>
    [
      r.id,
      r.createdAt?.toISOString() ?? "",
      r.firstName ?? "",
      r.lastName ?? "",
      r.email ?? "",
      r.phone ?? "",
      r.riskTolerance ?? "",
      r.timeHorizon ?? "",
      Array.isArray(r.primaryGoals) ? r.primaryGoals.join("|") : "",
    ]
      .map(toCsvCell)
      .join(","),
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
