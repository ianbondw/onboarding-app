// src/app/layout.tsx
import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Client Onboarding",
  description: "Modern client intake for advisory & wealth firms",
};

const BRAND_NAME =
  process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Client Onboarding";
const BRAND_LOGO = process.env.NEXT_PUBLIC_BRAND_LOGO?.trim(); // optional URL, e.g. https://yourdomain.com/logo.png

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="surface min-h-screen">
        {/* background orbs */}
        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6">
          {/* HEADER */}
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              {BRAND_LOGO ? (
                // simple img to avoid Next/Image config
                <img
                  src={BRAND_LOGO}
                  alt={`${BRAND_NAME} logo`}
                  className="h-8 w-8 rounded-xl object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl bg-black" />
              )}
              <span className="text-xl font-semibold tracking-tight">
                {BRAND_NAME}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link className="link" href="/">Home</Link>
              <Link className="link" href="/pilot">Pilot</Link>
              <Link className="link" href="/about">About</Link>
              <Link className="link" href="/contact">Contact</Link>
              <Link className="btn-secondary" href="/admin/clients">Admin</Link>
              <Link className="btn-primary" href="/onboarding">Try Demo</Link>
            </nav>

            {/* simple mobile actions */}
            <div className="md:hidden flex items-center gap-2">
              <Link className="btn-secondary" href="/pilot">Pilot</Link>
              <Link className="btn-primary" href="/onboarding">Demo</Link>
            </div>
          </header>

          {/* PAGE CONTENT */}
          {children}

          {/* FOOTER */}
          <footer className="mt-16 border-t pt-6 text-sm text-slate-600">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
              <div>
                © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <Link className="link" href="/legal/privacy">Privacy</Link>
                <Link className="link" href="/legal/terms">Terms</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
