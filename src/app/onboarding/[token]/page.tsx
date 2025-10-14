// src/app/onboarding/[token]/page.tsx
import Wizard from "./wizard";

export default function TokenOnboardingPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = params.token;

  const brandName =
    (typeof searchParams?.brandName === "string"
      ? searchParams?.brandName
      : Array.isArray(searchParams?.brandName)
      ? searchParams?.brandName[0]
      : null) || "Your firm";

  const brandLogo =
    typeof searchParams?.brandLogo === "string"
      ? searchParams?.brandLogo
      : Array.isArray(searchParams?.brandLogo)
      ? searchParams?.brandLogo[0]
      : undefined;

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Client Onboarding</h1>

        {/* White-label spot: show provided logo or a placeholder */}
        <div className="flex items-center gap-3">
          {brandLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
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

      {/* Pass the route token down to the Wizard */}
      <Wizard token={token} />
    </div>
  );
}