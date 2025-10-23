// src/app/admin/layout.tsx
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This nests under your root layout, so you still get the global BetaBanner + footer.
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-sm px-3 py-2">
        <strong>Admin (Beta)</strong> — internal testing environment.
      </div>
      {children}
    </div>
  );
}