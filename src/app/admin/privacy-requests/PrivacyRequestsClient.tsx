"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdvisorOption = {
  id: string;
  name: string;
  firm: string | null;
};

type PrivacyRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  requestType: string;
  status: string;
  source: string;
  subjectType: string;
  email: string;
  name: string;
  firm: string | null;
  relationship: string | null;
  advisorId: string | null;
  advisor: AdvisorOption | null;
  dueAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  completedAt: string | null;
  legalHold: boolean;
  identityVerifiedAt: string | null;
  details: string | null;
  resolutionSummary: string | null;
  metadata: unknown;
};

const requestTypes = [
  { value: "access", label: "Access" },
  { value: "deletion", label: "Deletion" },
  { value: "correction", label: "Correction" },
  { value: "retention_review", label: "Retention review" },
  { value: "legal_hold", label: "Legal hold" },
];

const statuses = [
  "received",
  "awaiting_identity",
  "in_review",
  "approved",
  "completed",
  "rejected",
  "on_hold",
];

function advisorLabel(advisor: AdvisorOption) {
  return advisor.firm ? `${advisor.name} (${advisor.firm})` : advisor.name;
}

export default function PrivacyRequestsClient({
  initialRequests,
  advisors,
}: {
  initialRequests: PrivacyRequest[];
  advisors: AdvisorOption[];
}) {
  const router = useRouter();
  const [requestType, setRequestType] = useState("retention_review");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [relationship, setRelationship] = useState("");
  const [advisorId, setAdvisorId] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const summary = useMemo(() => {
    return initialRequests.reduce(
      (acc, item) => {
        acc.total += 1;
        if (
          item.status === "received" ||
          item.status === "awaiting_identity" ||
          item.status === "in_review" ||
          item.status === "approved" ||
          item.status === "on_hold"
        ) {
          acc.open += 1;
        }
        if (item.requestType === "deletion") acc.deletions += 1;
        if (item.legalHold) acc.holds += 1;
        return acc;
      },
      { total: 0, open: 0, deletions: 0, holds: 0 }
    );
  }, [initialRequests]);

  async function createInternalRequest(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/admin/privacy-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType,
          name,
          email,
          firm,
          relationship,
          advisorId: advisorId || null,
          details,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setResult(`Created ${json?.request?.requestType || "privacy"} request ${json?.request?.id}.`);
      setName("");
      setEmail("");
      setFirm("");
      setRelationship("");
      setAdvisorId("");
      setDetails("");
      setRequestType("retention_review");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Unable to create request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total requests" value={summary.total} />
        <SummaryCard label="Open queue" value={summary.open} />
        <SummaryCard label="Deletion requests" value={summary.deletions} />
        <SummaryCard label="Legal holds" value={summary.holds} />
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Create Internal Workflow</h2>
          <p className="text-sm text-slate-500">
            Log retention reviews, legal holds, or customer-success follow-ups without waiting for a
            public form submission.
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

        <form onSubmit={createInternalRequest} className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <div className="mb-1 text-slate-700">Workflow type</div>
            <select
              className="w-full rounded-md border px-3 py-2"
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
            <input className="w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Email</div>
            <input
              className="w-full rounded-md border px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Firm</div>
            <input className="w-full rounded-md border px-3 py-2" value={firm} onChange={(e) => setFirm(e.target.value)} />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Relationship</div>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Client, prospect, advisor user, or firm contact"
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-slate-700">Advisor workspace</div>
            <select
              className="w-full rounded-md border px-3 py-2"
              value={advisorId}
              onChange={(e) => setAdvisorId(e.target.value)}
            >
              <option value="">No advisor</option>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisorLabel(advisor)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm md:col-span-2">
            <div className="mb-1 text-slate-700">Details</div>
            <textarea
              className="min-h-28 w-full rounded-md border px-3 py-2"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the retention task, hold, or customer request."
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-black/90 disabled:opacity-60"
            >
              {busy ? "Creating..." : "Create workflow"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Requests and Retention Queue</h2>
          <p className="text-sm text-slate-500">
            Approve or reject requests, put records on legal hold, and execute deletion redaction
            once a deletion request is approved.
          </p>
        </div>

        <div className="space-y-3">
          {initialRequests.map((request) => (
            <RequestRow key={request.id} request={request} onSaved={() => router.refresh()} />
          ))}
          {initialRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No privacy workflows yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RequestRow({
  request,
  onSaved,
}: {
  request: PrivacyRequest;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(request.status);
  const [requestType, setRequestType] = useState(request.requestType);
  const [legalHold, setLegalHold] = useState(request.legalHold);
  const [identityVerified, setIdentityVerified] = useState(Boolean(request.identityVerifiedAt));
  const [details, setDetails] = useState(request.details || "");
  const [resolutionSummary, setResolutionSummary] = useState(request.resolutionSummary || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function save() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`/api/admin/privacy-requests/${encodeURIComponent(request.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          requestType,
          legalHold,
          identityVerified,
          details,
          resolutionSummary,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }
      setResult("Saved.");
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Unable to save request.");
    } finally {
      setBusy(false);
    }
  }

  async function executeDeletion() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`/api/admin/privacy-requests/${encodeURIComponent(request.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applyAction: "execute_deletion",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }
      setResult(json?.request?.resolutionSummary || "Deletion workflow completed.");
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Unable to complete deletion.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-900">
            {request.name} <span className="font-normal text-slate-500">({request.email})</span>
          </div>
          <div className="text-xs text-slate-500">
            Source: {request.source} | Created: {new Date(request.createdAt).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            {request.firm ? `${request.firm} | ` : ""}
            {request.relationship || request.subjectType}
            {request.advisor ? ` | ${advisorLabel(request.advisor)}` : ""}
          </div>
          <div className="text-sm text-slate-600">{request.details || "No details provided."}</div>
        </div>

        <label className="text-sm">
          <div className="mb-1 text-slate-600">Workflow type</div>
          <select className="w-full rounded-md border px-3 py-2" value={requestType} onChange={(e) => setRequestType(e.target.value)}>
            {requestTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <div className="mb-1 text-slate-600">Status</div>
          <select className="w-full rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={legalHold} onChange={(e) => setLegalHold(e.target.checked)} />
            <span>Legal hold</span>
          </label>
          <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={identityVerified}
              onChange={(e) => setIdentityVerified(e.target.checked)}
            />
            <span>Identity verified</span>
          </label>
        </label>

        <div className="space-y-3">
          <label className="text-sm block">
            <div className="mb-1 text-slate-600">Operator notes</div>
            <textarea className="min-h-24 w-full rounded-md border px-3 py-2" value={details} onChange={(e) => setDetails(e.target.value)} />
          </label>
          <label className="text-sm block">
            <div className="mb-1 text-slate-600">Resolution summary</div>
            <textarea
              className="min-h-24 w-full rounded-md border px-3 py-2"
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <div>Due: {request.dueAt ? new Date(request.dueAt).toLocaleString() : "Not set"}</div>
            <div>Reviewed: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : "Not yet"}</div>
            <div>Completed: {request.completedAt ? new Date(request.completedAt).toLocaleString() : "Not yet"}</div>
            <div>
              Identity verified:{" "}
              {request.identityVerifiedAt || identityVerified
                ? request.identityVerifiedAt
                  ? new Date(request.identityVerifiedAt).toLocaleString()
                  : "Ready to save"
                : "Not yet"}
            </div>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="w-full rounded-md border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save"}
          </button>
          {request.requestType === "deletion" || requestType === "deletion" ? (
            <button
              type="button"
              onClick={executeDeletion}
              disabled={busy || legalHold}
              className="w-full rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/90 disabled:opacity-60"
            >
              Execute deletion
            </button>
          ) : null}
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

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
