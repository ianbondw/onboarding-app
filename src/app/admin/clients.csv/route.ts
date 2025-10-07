import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

function toCSV(rows: any[]) {
  const headers = ["id", "createdAt", "firstName", "lastName", "email"];
  const lines = [headers.join(",")];
  for (const r of rows) {
    const vals = [
      r.id,
      new Date(r.createdAt).toISOString(),
      r.firstName ?? "",
      r.lastName ?? "",
      r.email ?? "",
    ].map(v => `"${String(v).replace(/"/g, '""')}"`);
    lines.push(vals.join(","));
  }
  return lines.join("\n");
}

export async function GET() {
  const rows = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, firstName: true, lastName: true, email: true },
  });
  const body = toCSV(rows);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clients.csv"',
      "Cache-Control": "no-store",
    },
  });
}
