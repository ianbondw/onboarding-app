// src/app/admin/clients/StatusCell.tsx
"use client";

import { useState, useTransition } from "react";

const OPTIONS = [
  ["new", "New"],
  ["in_progress", "In Progress"],
  ["waiting", "Waiting"],
  ["ready", "Ready"],
  ["complete", "Complete"],
] as const;

export default function StatusCell({
  id,
  initial,
}: {
  id: string;
  initial: string | null;
}) {
  const [value, setValue] = useState<string>(initial || "new");
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState<string>("");

  async function onChange(next: string) {
    setErr("");
    setValue(next); // optimistic
    startTransition(async () => {
      const res = await fetch(`/api/admin/clients/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j?.error || "Save failed");
      }
    });
  }

  return (
    <div className="min-w-[160px]">
      <select
        className="rounded-md border bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
      >
        {OPTIONS.map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>
      {err ? <div className="mt-1 text-xs text-red-600">{err}</div> : null}
    </div>
  );
}