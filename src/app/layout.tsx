// src/app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Advisor Onboarding",
  description: "Modern onboarding for advisory & wealth firms",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Advisor Onboarding</h1>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/onboarding" className="hover:underline">Start Onboarding</a>
              <a href="/admin/clients" className="hover:underline">Admin</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}