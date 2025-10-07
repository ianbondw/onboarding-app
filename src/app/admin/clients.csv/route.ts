import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

function pick(obj: any, keys: string[], fallback = "") {
  for (const k of keys) if (obj && obj[k] != null) return String(obj[k]);
  return fallback;
}

function toCSV(rows: any[]) {
  const headers = ["id", "createdAt", "firstName", "lastName", "email", "name"];
  const lines = [headers.join(",")];

  for (const r of rows) {
    const firstName = pick(r, ["firstName","givenName","first_name"]);
    const lastName  = pick(r, ["lastName","familyName","last_name"]);
    const email     = pick(r, ["email","primaryEmail","contactEmail"]);
    const name      = pick(r, ["name","fullName","displayName","clientName"]);
    const vals = [
      r.id ?? "",
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
      firstName, lastName, email, name,
    ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`);
    lines.push(vals.join(","));
  }
  return lines.join("\n");
}

export async function GET() {
  const rows = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  }) as any[];

  const body = toCSV(rows);

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="clients.csv"',
      "Cache-Control": "no-store",
    },
  });
}