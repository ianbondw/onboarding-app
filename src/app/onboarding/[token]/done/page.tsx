// src/app/onboarding/[token]/done/page.tsx
export const dynamic = "force-dynamic";

export default function DonePage({ params }: { params: { token: string } }) {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px" }}>
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 24,
          background: "#fff",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
          Application Submitted ✅
        </h1>
        <p style={{ color: "#374151", marginTop: 12 }}>
          Thanks! We received your onboarding details.
        </p>
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Session token: <code>{params.token}</code>
        </div>
        <div style={{ marginTop: 20 }}>
          <a
            href={`/onboarding/${encodeURIComponent(params.token)}`}
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Go back
          </a>
        </div>
      </div>
    </main>
  );
}