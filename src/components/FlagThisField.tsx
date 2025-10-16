// src/components/FlagThisField.tsx
"use client";

import { useState } from "react";

type Props = {
  token: string;                 // onboarding token from URL
  email: string;                 // the client's email (already required by your API)
  fieldKey: string;              // e.g. "employmentStatus"
  className?: string;
};

export default function FlagThisField({ token, email, fieldKey, className }: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit() {
    try {
      setPending(true);
      await fetch(`/api/onboarding/${token}/flag`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, fieldKey, note }),
      });
      setSent(true);
      setOpen(false);
      setNote("");
    } catch {
      // swallow; keep UI simple
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      {!sent ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs underline text-gray-600 hover:text-gray-800"
          >
            Need help with this?
          </button>
          {open && (
            <div className="mt-2 space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tell your advisor what's confusing or what you want to discuss…"
                className="w-full rounded-md border p-2 text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending}
                  className="px-2 py-1 text-xs rounded-md border"
                >
                  {pending ? "Sending…" : "Send to advisor"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-2 py-1 text-xs rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-xs text-green-700">Flag sent ✓</div>
      )}
    </div>
  );
}