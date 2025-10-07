import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

// flexible helpers so we don't depend on exact Prisma field names
function pick(obj: any, keys: string[], fallback = "") {
  for (const k of keys) if (obj && obj[k] != null) return String(obj[k]);
  return fallback;
}
function toLower(s: unknown) { return (s ?? "").toString().toLowerCase(); }

export default async function AdminClients(props: any) {
  const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;

  // page
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

  // q
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // Strategy: avoid schema-specific where/select. Fetch a reasonable window from DB, then filter in memory.
  // If no search, do real pagination with skip/take for performance.
  let rows: any[] = [];
  let total = 0;

  if (hasQ) {
    // Fetch a larger window, then filter in-memory
    const seed = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000, // adjust if you expect more
    }) as any[];

    const ql = q.toLowerCase();
    const filtered = seed.filter((r) => {
      const fn = pick(r, ["firstName","givenName","first_name"]);
      const ln = pick(r, ["lastName","familyName","last_name"]);
      const em = pick(r, ["email","primaryEmail","contactEmail"]);
      const nm = pick(r, ["name","fullName","displayName","clientName"]);
      return [fn, ln, em, nm].some(v => toLower(v).includes(ql));
    });

    total = filtered.length;
    const start = (page - 1) * PAGE_SIZE;
    rows = filtered.slice(start, start + PAGE_SIZE);
  } else {
    // No search: real pagination from DB
    total = await prisma.client.count();
    rows = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }) as any[];
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Client Submissions</h1>

      <form className="mb-4 flex gap-2">
        <input
          className="border rounded px-3 py-2 w-64"
          name="q"
          placeholder="Search name or email…"
          defaultValue={q}
        />
        <button className="border rounded px-3 py-2" type="submit">Search</button>
        <Link className="border rounded px-3 py-2" href="/admin/clients.csv">Export CSV</Link>
      </form>

      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const created = r.createdAt ? new Date(r.createdAt).toLocaleString() : "";
              const name = pick(r, ["name","fullName","displayName","clientName"], [r.firstName, r.lastName].filter(Boolean).join(" "));
              const fallbackName = [pick(r,["firstName","givenName","first_name"]), pick(r,["lastName","familyName","last_name"])].filter(Boolean).join(" ");
              const finalName = name || fallbackName || "(unnamed)";
              const email = pick(r, ["email","primaryEmail","contactEmail"]);
              return (
                <tr key={r.id ?? Math.random()} className="border-t">
                  <td className="p-2">{created}</td>
                  <td className="p-2">{finalName}</td>
                  <td className="p-2">{email}</td>
                  <td className="p-2 font-mono">{r.id}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={4}>No results.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages} — {total} total
        </span>
        <div className="ml-auto flex gap-2">
          {page > 1 && (
            <Link className="border rounded px-3 py-1" href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Prev
            </Link>
          )}
          {page < totalPages && (
            <Link className="border rounded px-3 py-1" href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}