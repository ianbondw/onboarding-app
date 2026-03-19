"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PortalUser = {
  id: string;
  email: string;
  role: "owner" | "advisor" | "ops";
  isActive: boolean;
  advisorId: string | null;
  lastLoginAt: string | null;
  advisor: {
    id: string;
    name: string;
    firm: string | null;
  } | null;
};

type AdvisorOption = {
  id: string;
  name: string;
  firm: string | null;
};

function advisorLabel(advisor: AdvisorOption) {
  return advisor.firm ? `${advisor.name} (${advisor.firm})` : advisor.name;
}

export default function UsersClient({
  initialUsers,
  advisors,
}: {
  initialUsers: PortalUser[];
  advisors: AdvisorOption[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PortalUser["role"]>("advisor");
  const [advisorId, setAdvisorId] = useState("");
  const [password, setPassword] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");
    setBusy(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          advisorId: role === "advisor" ? advisorId : undefined,
          password: password || undefined,
          notify,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setResult(
        `Created ${json?.user?.email}. Temporary password: ${json?.temporaryPassword}${
          json?.advisorMagicUrl ? ` | Direct link: ${json.advisorMagicUrl}` : ""
        }`
      );
      setEmail("");
      setPassword("");
      setAdvisorId("");
      setRole("advisor");
      setNotify(true);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create portal user.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Create Portal User</h2>
          <p className="text-sm text-slate-500">
            Owners can manage all settings. Ops can work across advisors. Advisor users stay scoped
            to a single advisor workspace.
          </p>
        </div>

        {error ? (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {result ? (
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {result}
          </div>
        ) : null}

        <form onSubmit={createUser} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <div className="mb-1 text-slate-700">Email</div>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Role</div>
            <select
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={role}
              onChange={(e) => setRole(e.target.value as PortalUser["role"])}
            >
              <option value="advisor">Advisor</option>
              <option value="ops">Ops</option>
              <option value="owner">Owner</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Advisor Workspace</div>
            <select
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 disabled:bg-slate-50"
              value={advisorId}
              onChange={(e) => setAdvisorId(e.target.value)}
              disabled={role !== "advisor"}
              required={role === "advisor"}
            >
              <option value="">Select advisor…</option>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisorLabel(advisor)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Temporary Password</div>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to auto-generate"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
            <span>Email credentials to the user</span>
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Portal Users</h2>
          <p className="text-sm text-slate-500">
            Reset passwords, reassign advisor scope, or disable access without touching magic-link
            flows.
          </p>
        </div>

        <div className="space-y-3">
          {initialUsers.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              advisors={advisors}
              onSaved={() => router.refresh()}
            />
          ))}
          {initialUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No portal users yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function UserRow({
  user,
  advisors,
  onSaved,
}: {
  user: PortalUser;
  advisors: AdvisorOption[];
  onSaved: () => void;
}) {
  const [role, setRole] = useState<PortalUser["role"]>(user.role);
  const [advisorId, setAdvisorId] = useState(user.advisorId || "");
  const [isActive, setIsActive] = useState(user.isActive);
  const [password, setPassword] = useState("");
  const [notify, setNotify] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    setResult("");

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          advisorId: role === "advisor" ? advisorId : null,
          isActive,
          password: password || undefined,
          notify,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setPassword("");
      setNotify(false);
      setResult(password ? "Saved. Password reset applied." : "Saved.");
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Failed to update portal user.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_1fr_0.7fr_1fr_auto]">
        <div>
          <div className="text-sm font-medium text-slate-900">{user.email}</div>
          <div className="text-xs text-slate-500">
            Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
          </div>
        </div>

        <label className="text-sm">
          <div className="mb-1 text-slate-600">Role</div>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as PortalUser["role"])}
          >
            <option value="advisor">Advisor</option>
            <option value="ops">Ops</option>
            <option value="owner">Owner</option>
          </select>
        </label>

        <label className="text-sm">
          <div className="mb-1 text-slate-600">Advisor Workspace</div>
          <select
            className="w-full rounded-md border px-3 py-2 disabled:bg-slate-50"
            value={advisorId}
            onChange={(e) => setAdvisorId(e.target.value)}
            disabled={role !== "advisor"}
          >
            <option value="">No advisor</option>
            {advisors.map((advisor) => (
              <option key={advisor.id} value={advisor.id}>
                {advisorLabel(advisor)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm pt-7">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Active</span>
        </label>

        <div className="space-y-2">
          <label className="text-sm block">
            <div className="mb-1 text-slate-600">New Password</div>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              disabled={!password}
            />
            <span>Email password reset</span>
          </label>
        </div>

        <div className="flex items-start justify-end pt-7">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {result ? (
        <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {result}
        </div>
      ) : null}
    </div>
  );
}
