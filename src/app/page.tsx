export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1>Onboarding App is Running ✅</h1>
      <p style={{ color: "#475569" }}>
        Share this link for a fresh session each time: <a href="/onboarding/new">/onboarding/new</a>
      </p>
      <p style={{ color: "#64748B", fontSize: 12 }}>
        (Each visit to <code>/onboarding/new</code> creates a unique token.)
      </p>
    </main>
  );
}