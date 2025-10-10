import "./globals.css";
import React from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Client Onboarding",
  description: "Modern onboarding for advisory & wealth firms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* mobile meta: solid status bar color on iOS/Android */}
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="surface min-h-screen">
        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 md:py-8">
          <header className="mb-6 md:mb-10 flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-semibold tracking-tight">
              Client Onboarding
            </Link>
            <nav className="flex items-center gap-3 md:gap-6 text-sm">
              <Link className="link hidden sm:inline" href="/">Home</Link>
              <Link className="btn-secondary" href="/onboarding">Start Onboarding</Link>
              <Link className="link hidden sm:inline" href="/admin/clients">Admin</Link>
            </nav>
          </header>
          {children}
          <footer className="mt-10 border-t pt-6 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>© {new Date().getFullYear()} Client Onboarding</div>
              <div className="flex items-center gap-4">
                <a className="link" href="/legal/privacy">Privacy</a>
                <a className="link" href="/legal/terms">Terms</a>
              </div>
            </div>
          </footer>
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}