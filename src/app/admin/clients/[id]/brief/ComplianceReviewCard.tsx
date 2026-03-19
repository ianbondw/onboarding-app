"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In Review" },
  { value: "verified", label: "Verified" },
  { value: "failed", label: "Failed" },
];

export default function ComplianceReviewCard(props: {
  clientId: string;
  identityVerificationStatus: string;
  documentVerificationStatus: string;
  idDocType: string | null;
  idDocProviderRef: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}) {
  const router = useRouter();
  const [identityStatus, setIdentityStatus] = useState(
    props.identityVerificationStatus || "pending"
  );
  const [documentStatus, setDocumentStatus] = useState(
    props.documentVerificationStatus || "pending"
  );
  const [providerRef, setProviderRef] = useState(props.idDocProviderRef || "");
  const [reviewNotes, setReviewNotes] = useState(props.reviewNotes || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function saveReview() {
    setBusy(true);
    setError("");
    setResult("");

    try {
      const res = await fetch(`/api/admin/clients/${encodeURIComponent(props.clientId)}/compliance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityVerificationStatus: identityStatus,
          documentVerificationStatus: documentStatus,
          idDocProviderRef: providerRef || null,
          reviewNotes,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setResult("Compliance review saved.");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save compliance review.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border p-5 space-y-4">
      <div>
        <h3 className="font-medium">Compliance Review</h3>
        <p className="text-sm text-gray-500">
          Track identity and document verification separately from the overall client status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 text-gray-600">Identity status</div>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={identityStatus}
            onChange={(e) => setIdentityStatus(e.target.value)}
          >
            {OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <div className="mb-1 text-gray-600">Document status</div>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={documentStatus}
            onChange={(e) => setDocumentStatus(e.target.value)}
          >
            {OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <div className="mb-1 text-gray-600">Document type</div>
          <input
            className="w-full rounded-md border px-3 py-2 bg-slate-50"
            value={props.idDocType || "Not provided"}
            disabled
          />
        </label>

        <label className="text-sm">
          <div className="mb-1 text-gray-600">Provider reference</div>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={providerRef}
            onChange={(e) => setProviderRef(e.target.value)}
            placeholder="provider request id"
          />
        </label>
      </div>

      <label className="text-sm block">
        <div className="mb-1 text-gray-600">Review notes</div>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={4}
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Open issues, follow-up, or provider notes"
        />
      </label>

      <div className="text-xs text-gray-500">
        Last reviewed: {props.reviewedAt ? new Date(props.reviewedAt).toLocaleString() : "Never"}
        {props.reviewedBy ? ` by ${props.reviewedBy}` : ""}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {result ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {result}
        </div>
      ) : null}

      <button
        type="button"
        onClick={saveReview}
        disabled={busy}
        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save Compliance Review"}
      </button>
    </section>
  );
}
