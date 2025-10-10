import "./globals.css"; // keep this at the top
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Client Onboarding",
  description: "Modern onboarding for advisory & wealth firms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="surface min-h-screen">
        {/* animated background orbs */}
        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
          <header className="mb-10 flex items-center justify-between">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              Client Onboarding
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link className="link" href="/">Home</Link>
              <Link className="btn-secondary" href="/onboarding">Start Onboarding</Link>
              <Link className="link" href="/admin/clients">Admin</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}