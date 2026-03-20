import "./globals.css";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Marengo Finance - Client Onboarding",
  description: "White-labeled client onboarding for RIAs and wealth teams.",
};

const ADMIN_ORIGIN =
  process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.trim() ||
  "https://marengofinance-admin.com";
const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim() || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adminHref = `${ADMIN_ORIGIN}/admin/clients`;
  const trialHref = APP_ORIGIN ? `${APP_ORIGIN}/pilot` : "/pilot";

  return (
    <html lang="en">
      <body className="surface min-h-screen">
        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
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
              <Link className="link" href="/#how">
                How It Works
              </Link>
              <Link className="link" href="/pricing">
                Pricing
              </Link>
              <Link className="link" href="/about">
                About
              </Link>
              <Link className="link" href="/contact">
                Contact
              </Link>
              <a className="btn-secondary" href={adminHref}>
                Admin
              </a>
              {APP_ORIGIN ? (
                <a className="btn-primary" href={trialHref}>
                  Start Trial
                </a>
              ) : (
                <Link className="btn-primary" href={trialHref}>
                  Start Trial
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <Link className="btn-secondary" href="/pricing">
                Pricing
              </Link>
              {APP_ORIGIN ? (
                <a className="btn-primary" href={trialHref}>
                  Trial
                </a>
              ) : (
                <Link className="btn-primary" href={trialHref}>
                  Trial
                </Link>
              )}
            </div>
          </header>

          {children}

          <footer className="mt-16 border-t pt-6 text-sm text-slate-600">
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div>&copy; {new Date().getFullYear()} Marengo Finance. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link className="link" href="/legal/privacy">
                  Privacy
                </Link>
                <Link className="link" href="/legal/terms">
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
