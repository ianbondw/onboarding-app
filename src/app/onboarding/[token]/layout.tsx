// src/app/onboarding/[token]/layout.tsx
export default function TokenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      <div
        role="note"
        aria-label="Beta notice"
        className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2"
      >
        <strong>Beta Notice:</strong> This version is part of our private beta. Please use demo data
        only. Do not include sensitive personal information.
      </div>
      {children}
    </div>
  );
}