"use client";

import { useState } from "react";

const requestTypes = [
  { value: "access", label: "Data access" },
  { value: "deletion", label: "Delete my information" },
  { value: "correction", label: "Correct my information" },
];

export default function PrivacyRequestClient() {
  const [requestType, setRequestType] = useState("access");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [relationship, setRelationship] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/privacy/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType,
          name,
          email,
          firm,
          relationship,
          details,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setResult(
        `Request ${json?.requestId || "submitted"} received. We may contact you to verify identity before completion.`
      );
      setName("");
      setEmail("");
      setFirm("");
      setRelationship("");
      setDetails("");
      setRequestType("access");
    } catch (err: any) {
      setError(err?.message || "Unable to submit request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="surface-card p-6 md:p-8">
      <div className="relative z-10">
        <div className="mb-4 text-sm text-slate-600">
          Please describe the records or workflow you want us to review. If you are contacting us
          on behalf of a firm, include the firm and your relationship to the request.
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {result ? (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {result}
          </div>
        ) : null}

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <div className="mb-1 text-slate-700">Request type</div>
            <select
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              {requestTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Name</div>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
            <div className="mb-1 text-slate-700">Firm</div>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
            />
          </label>

          <label className="text-sm md:col-span-2">
            <div className="mb-1 text-slate-700">Relationship to the request</div>
            <input
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Client, advisor, prospect, operations, or other"
            />
          </label>

          <label className="text-sm md:col-span-2">
            <div className="mb-1 text-slate-700">Details</div>
            <textarea
              className="min-h-36 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe which records or workflow should be reviewed."
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
