// src/app/layout.tsx
import "./globals.css";
import React from "react";
import Link from "next/link";
import BetaBanner from "@/components/BetaBanner";

export const metadata = {
  title: "Marengo Finance — Client Onboarding",
  description: "Modern client intake for advisory & wealth firms",
};

// External origins (so header links go to the right domains)
const ADMIN_ORIGIN =
  process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.trim() ||
  "https://marengofinance-admin.com";
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim() || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adminHref = `${ADMIN_ORIGIN}/admin/clients`;
  const demoHref = APP_ORIGIN ? `${APP_ORIGIN}/onboarding` : "/onboarding";

  return (
    <html lang="en">
      <body className="surface min-h-screen antialiased">
        {/* --- Global beta banner (auto-hides when NEXT_PUBLIC_APP_STAGE !== 'beta' or dismissed) --- */}
        <BetaBanner />

        {/* background orbs */}
        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6">
          {/* HEADER */}
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {/* Site logo (bee-in-shield) + wordmark */}
              <img
                src="/brand/bee-shield-classic.svg"
                alt="Marengo Finance"
                className="h-7 w-7"
              />
              <span className="text-xl font-semibold tracking-tight">
                Marengo Finance
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link className="link" href="/">
                Home
              </Link>
              <Link className="link" href="/pilot">
                Pilot
              </Link>
              <Link className="link" href="/about">
                About
              </Link>
              <Link className="link" href="/contact">
                Contact
              </Link>
              {/* Admin lives on the admin domain */}
              <a className="btn-secondary" href={adminHref}>
                Admin
              </a>
              {/* Try Demo can be on the app domain if NEXT_PUBLIC_APP_ORIGIN is set */}
              {APP_ORIGIN ? (
                <a className="btn-primary" href={demoHref}>
                  Try Demo
                </a>
              ) : (
                <Link className="btn-primary" href={demoHref}>
                  Try Demo
                </Link>
              )}
            </nav>

            {/* simple mobile actions */}
            <div className="flex items-center gap-2 md:hidden">
              <Link className="btn-secondary" href="/pilot">
                Pilot
              </Link>
              {APP_ORIGIN ? (
                <a className="btn-primary" href={demoHref}>
                  Demo
                </a>
              ) : (
                <Link className="btn-primary" href={demoHref}>
                  Demo
                </Link>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          {children}

          {/* FOOTER */}
          <footer className="mt-16 border-t pt-6 text-sm text-slate-600">
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div>
                © {new Date().getFullYear()} Marengo Finance. All rights reserved.
              </div>

              <div className="flex items-center gap-4">
                <Link className="link" href="/legal/privacy">
                  Privacy
                </Link>
                <Link className="link" href="/legal/terms">
                  Terms
                </Link>
                <a
                  className="link"
                  href="https://x.com/MarengoFinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X / Twitter
                </a>
              </div>
            </div>

            {/* Subtle beta note below legal links */}
            <div className="mt-3 text-xs text-slate-500">
              <strong>Beta:</strong> We’re actively onboarding early advisors and
              refining the product. Please use demo data only; do not submit
              sensitive personal information.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}