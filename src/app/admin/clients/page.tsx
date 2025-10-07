import Link from "next/link";

// Lazy import Prisma so we can show a nice error if envs are missing
async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

// tiny helpers that don't assume exact schema field names
function pick(obj: any, keys: string[], fallback = "") {
  for (const k of keys) if (obj && obj[k] != null) return String(obj[k]);
  return fallback;
}
function toLower(s: unknown) { return (s ?? "").toString().toLowerCase(); }

export const dynamic = "force-dynamic";

export default async function AdminClients(props: any) {
  const searchParams = props?.searchParams ?? {};
  const PAGE_SIZE = 20;

  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.toString().trim() ?? "";
  const hasQ = q.length > 0;

  // --- DEBUG MODE: /admin/clients?debug=1 prints env presence and skips DB ---
  const debug = (Array.isArray(searchParams.debug) ? searchParams.debug[0] : searchParams.debug) === "1";
  if (debug) {
    return (
      <main className="mx-auto max-w-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Admin Clients (Debug)</h1>
        <pre className="text-xs p-3 bg-gray-100 rounded">
{`ENV present:
  DATABASE_URL:           ${Boolean(process.env.DATABASE_URL)}
  DATABASE_URL_UNPOOLED:  ${Boolean(process.env.DATABASE_URL_UNPOOLED)}
  PII_ENC_KEY:            ${Boolean(process.env.PII_ENC_KEY)}
  ADMIN_PASS:             ${Boolean(process.env.ADMIN_PASS)}
`}
        </pre>
        <p className="text-sm">If any of these are <strong>false</strong> on Vercel, set them in Project → Settings → Environment Variables, then redeploy.</p>
        <p><Link className="underline" href="/admin/clients">Back to list</Link></p>
      </main>
    );
  }

  // --- Normal path with safe error handling ---
  let rows: any[] = [];
  let total = 0;
  let errorMsg: string | null = null;

  try {
    const prisma = await getPrisma();

    if (hasQ) {
      // fetch a larger window then filter in-memory (schema-agnostic)
      const seed = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000,
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
      total = await prisma.client.count();
      rows = await prisma.client.findMany({
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }) as any[];
    }
  } catch (e: any) {
    console.error("ADMIN/CLIENTS ERROR:", e);
    errorMsg = e?.message ?? String(e);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (errorMsg) {
    // Friendly error UI (so prod doesn't show the generic "Something broke")
    return (
      <main className="mx-auto max-w-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Client Submissions</h1>
        <div className="p-3 rounded border border-red-300 bg-red-50 text-sm">
          <p className="font-medium">Server error while loading clients.</p>
          <pre className="mt-2 whitespace-pre-wrap">{errorMsg}</pre>
        </div>
        <p className="text-sm">
          Try <Link className="underline" href="/admin/clients?debug=1">debug mode</Link> to verify env vars on Vercel.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Client Submissions</h1>

      <form className="mb-4 flex gap-2">
        <input className="border rounded px-3 py-2 w-64" name="q" placeholder="Search name or email…" defaultValue={q} />
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
              const created = r?.createdAt ? new Date(r.createdAt).toLocaleString() : "";
              const nameFallback = [pick(r,["firstName","givenName","first_name"]), pick(r,["lastName","familyName","last_name"])].filter(Boolean).join(" ");
              const name = pick(r, ["name","fullName","displayName","clientName"], nameFallback) || "(unnamed)";
              const email = pick(r, ["email","primaryEmail","contactEmail"]);
              return (
                <tr key={r.id ?? Math.random()} className="border-t">
                  <td className="p-2">{created}</td>
                  <td className="p-2">{name}</td>
                  <td className="p-2">{email}</td>
                  <td className="p-2 font-mono">{r.id}</td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={4}>No results.</td></tr>}
          </tbody>
        </table>
      </div>

      <nav className="mt-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Page {page} of {totalPages} — {total} total</span>
        <div className="ml-auto flex gap-2">
          {page > 1 && <Link className="border rounded px-3 py-1" href={`/admin/clients?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>Prev</Link>}
          {page < totalPages && <Link className="border rounded px-3 py-1" href={`/admin/clients?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>Next</Link>}
        </div>
      </nav>
    </main>
  );
}