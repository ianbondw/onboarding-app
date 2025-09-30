export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>Onboarding App is Running ✅</h1>
      <p style={{ color: "#475569" }}>
        Start the wizard at <a href="/onboarding/test-123">/onboarding/test-123</a>
      </p>
      <p style={{ color: "#64748B", fontSize: 12 }}>
        (This page doesn’t render the wizard; it links to the /onboarding/[token] route.)
      </p>
    </main>
  );
}