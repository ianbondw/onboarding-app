// src/app/admin/login/LoginClient.tsx
"use client";

import { useState } from "react";

export default function AdminLoginClient({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = next || "/admin/clients";
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error || "Invalid password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-4">Protected area — for your eyes only.</p>

        {err ? (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Admin password"
            className="border rounded-md px-3 py-2 w-full outline-none focus:ring-2 focus:ring-black/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
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