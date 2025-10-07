import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

function toInt(v: string | string[] | undefined, d = 1) {
  const n = Array.isArray(v) ? v[0] : v;
  const parsed = n ? parseInt(n, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : d;
}

// Allow anything so we don't trip Next.js type checks
export default async function AdminClients(props: any) {
    const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;
  const page = toInt(searchParams.page, 1);
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.trim();

  const where =
    q && q.length > 1
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

  const [total, rows] = await Promise.all([
    prisma.client.count({ where }),
    prisma.client.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, firstName: true, lastName: true, email: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Client Submissions</h1>

      <form className="mb-4 flex gap-2">
        <input
          className="border rounded px-3 py-2 w-64"
          name="q"
          placeholder="Search name or email…"
          defaultValue={q ?? ""}
        />
        <button className="border rounded px-3 py-2" type="submit">
          Search
        </button>
        <Link className="border rounded px-3 py-2" href="/admin/clients.csv">
          Export CSV
        </Link>
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
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2">{[r.firstName, r.lastName].filter(Boolean).join(" ")}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2 font-mono">{r.id}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No results.
                </td>
              </tr>
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
            <Link
              className="border rounded px-3 py-1"
              href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            >
              Prev
            </Link>
          )}
          {page < totalPages && (
            <Link
              className="border rounded px-3 py-1"
              href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}