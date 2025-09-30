"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui" }}>
        <main style={{ maxWidth: 720, margin: "48px auto" }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>App crashed</h1>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              padding: 12,
              borderRadius: 8,
              color: "#334155",
            }}
          >
            {String(error?.message || error)}
          </pre>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}