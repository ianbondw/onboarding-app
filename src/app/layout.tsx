// src/app/layout.tsx
export const metadata = {
  title: "Onboarding App",
  description: "Client onboarding wizard + advisor pipeline",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <header style={{ padding: "16px 24px", borderBottom: "1px solid #eee", fontWeight: 600 }}>
          Onboarding App
        </header>
        <main style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>{children}</main>
      </body>
    </html>
  );
}
