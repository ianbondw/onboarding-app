"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Wizard from "./wizard";

export default function TokenOnboardingPage() {
  const params = useSearchParams();
  const brandName = params.get("brandName") ?? "Your firm";
  const brandLogo = params.get("brandLogo"); // optional URL param

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Onboarding</h1>

        {/* White-label spot: show provided logo or a placeholder */}
        <div className="flex items-center gap-3">
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={`${brandName} logo`}
              className="h-8 w-auto rounded-md border bg-white"
            />
          ) : (
            <div className="h-8 w-28 rounded-md border border-dashed text-xs text-gray-500 flex items-center justify-center">
              Your logo
            </div>
          )}
          <span className="text-sm text-gray-600">{brandName}</span>
        </div>
      </div>

      {/* Let the Wizard render the step chips */}
      <Wizard />
    </div>
  );
}