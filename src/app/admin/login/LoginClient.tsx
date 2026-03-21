"use client";

import { useState } from "react";

type LoginStage = "credentials" | "verify";

export default function AdminLoginClient({ next }: { next: string }) {
  const [stage, setStage] = useState<LoginStage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [expiresInSec, setExpiresInSec] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [debugCode, setDebugCode] = useState("");

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Invalid credentials");
      }

      if (json?.mfaRequired) {
        setStage("verify");
        setChallengeToken(json.challengeToken || "");
        setEmailHint(json.emailHint || email);
        setExpiresInSec(Number(json.expiresInSec) || 0);
        setDebugCode(json.debugCode || "");
        setCode("");
        return;
      }

      window.location.href = next || "/admin/clients";
    } catch (error: any) {
      setErr(error?.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const res = await fetch("/api/admin/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken, code }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Invalid verification code");
      }

      window.location.href = next || "/admin/clients";
    } catch (error: any) {
      setErr(error?.message || "Invalid verification code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-semibold">Portal Login</h1>
        <p className="mb-4 text-sm text-gray-500">
          {stage === "credentials"
            ? "Sign in with your owner, advisor, or ops portal credentials."
            : "Enter the one-time email code to finish signing in."}
        </p>

        {err ? (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {stage === "credentials" ? (
          <form onSubmit={submitCredentials} className="space-y-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="w-full rounded-md bg-black px-3 py-2 text-white transition hover:bg-black/90"
              type="submit"
              disabled={busy}
            >
              {busy ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="space-y-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              Code sent to <strong>{emailHint || email}</strong>
              {expiresInSec > 0 ? ` for the next ${Math.ceil(expiresInSec / 60)} minutes.` : "."}
            </div>
            {debugCode ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Dev code: {debugCode}
              </div>
            ) : null}
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              name="code"
              placeholder="6-digit code"
              className="w-full rounded-md border px-3 py-2 tracking-[0.35em] outline-none focus:ring-2 focus:ring-black/10"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              autoFocus
              required
            />
            <button
              className="w-full rounded-md bg-black px-3 py-2 text-white transition hover:bg-black/90"
              type="submit"
              disabled={busy || code.length !== 6}
            >
              {busy ? "Verifying..." : "Verify and sign in"}
            </button>
            <button
              type="button"
              className="w-full rounded-md border px-3 py-2 text-sm transition hover:bg-slate-50"
              onClick={() => {
                setStage("credentials");
                setCode("");
                setChallengeToken("");
                setEmailHint("");
                setExpiresInSec(0);
                setErr("");
              }}
            >
              Go back
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
