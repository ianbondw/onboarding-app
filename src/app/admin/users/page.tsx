import Link from "next/link";
import { notFound } from "next/navigation";
import UsersClient from "./UsersClient";
import { getAdminAccess, canManagePortalUsers } from "@/lib/admin-auth";
import { prisma } from "@/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const access = await getAdminAccess();
  if (!canManagePortalUsers(access)) notFound();

  const [users, advisors] = await Promise.all([
    prisma.portalUser.findMany({
      orderBy: [{ role: "asc" }, { email: "asc" }],
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        mfaEnabled: true,
        mfaMethod: true,
        advisorId: true,
        lastLoginAt: true,
        advisor: {
          select: {
            id: true,
            name: true,
            firm: true,
          },
        },
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
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Portal Users</h1>
          <p className="text-sm text-slate-500">
            Manage owner, ops, and advisor logins from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/admin/new-advisor">
            Create Advisor
          </Link>
          <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" href="/admin/clients">
            Back to Clients
          </Link>
        </div>
      </header>

      <UsersClient
        initialUsers={users.map((user) => ({
          ...user,
          role: user.role as "owner" | "advisor" | "ops",
          lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
          mfaMethod: user.mfaMethod ?? null,
        }))}
        advisors={advisors}
      />
    </main>
  );
}
