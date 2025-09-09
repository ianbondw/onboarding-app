// src/app/layout.tsx
export const metadata = { title: "Onboarding App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, Arial, sans-serif" }}>
        <header style={{ borderBottom: "1px solid #eee", padding: "16px 24px", fontWeight: 600 }}>
          Onboarding App
        </header>
        <main style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
