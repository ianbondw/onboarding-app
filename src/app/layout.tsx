import "./globals.css";
import React from "react";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { ADMIN_ORIGIN, APP_ORIGIN, SITE_ORIGIN } from "@/lib/site-config";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Marengo Finance",
    template: "%s | Marengo Finance",
  },
  description:
    "White-labeled client onboarding for RIAs and wealth teams, with guided trials, advisor workspaces, and rollout-ready operations.",
  applicationName: "Marengo Finance",
  keywords: [
    "RIA onboarding",
    "advisor onboarding software",
    "wealth management client intake",
    "white-labeled onboarding",
    "client onboarding for RIAs",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_ORIGIN,
    siteName: "Marengo Finance",
    title: "Marengo Finance",
    description:
      "Guided trials, advisor workspaces, and a cleaner onboarding flow for RIAs and wealth teams.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Marengo Finance client onboarding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marengo Finance",
    description:
      "Guided trials, advisor workspaces, and a cleaner onboarding flow for RIAs and wealth teams.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/brand/bee-shield-classic.svg",
    apple: "/brand/bee-shield-classic.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
  colorScheme: "light",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Marengo Finance",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/brand/bee-shield-classic.svg`,
  description:
    "White-labeled client onboarding for RIAs and wealth teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adminHref = `${ADMIN_ORIGIN}/admin/clients`;
  const trialHref = APP_ORIGIN ? `${APP_ORIGIN}/pilot` : "/pilot";

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bodyFont.variable} ${displayFont.variable} surface min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <div className="orbs" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="site-header">
            <Link href="/" className="brand-lockup">
              <span className="brand-icon-wrap">
                <img
                  src="/brand/bee-shield-classic.svg"
                  alt="Marengo Finance"
                  className="h-7 w-7"
                />
              </span>
              <span>
                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Client onboarding
                </span>
                <span className="display-type text-lg font-semibold tracking-tight text-slate-950">
                  Marengo Finance
                </span>
              </span>
            </Link>

            <nav className="site-nav">
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
              <Link className="link" href="/trust">
                Trust Center
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

          <footer className="site-footer">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="display-type text-lg font-semibold text-slate-950">
                  Marengo Finance
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Guided trials, advisor workspaces, and rollout-ready onboarding for RIAs.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <Link className="link" href="/pricing">
                  Pricing
                </Link>
                <Link className="link" href="/contact">
                  Contact
                </Link>
                <Link className="link" href="/trust">
                  Trust Center
                </Link>
                <Link className="link" href="/security">
                  Security
                </Link>
                <Link className="link" href="/legal/privacy">
                  Privacy
                </Link>
                <Link className="link" href="/privacy/request">
                  Privacy Request
                </Link>
                <Link className="link" href="/legal/terms">
                  Terms
                </Link>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Marengo Finance. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
