"use client";

import { useState } from "react";

export default function AdminLoginClient({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = next || "/admin/clients";
      return;
    }

    const j = await res.json().catch(() => ({}));
    setErr(j?.error || "Invalid credentials");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Portal Login</h1>
        <p className="text-sm text-gray-500 mb-4">
          Sign in with your owner, advisor, or ops portal credentials.
        </p>

        {err ? (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2 w-full outline-none focus:ring-2 focus:ring-black/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded-md px-3 py-2 w-full outline-none focus:ring-2 focus:ring-black/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="rounded-md px-3 py-2 w-full bg-black text-white hover:bg-black/90 transition"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
