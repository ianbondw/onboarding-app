"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-4">
      <h1 className="text-xl font-semibold">Something broke</h1>
      <p className="text-sm text-gray-600">
        The Brief couldn’t render. Try refreshing. If it keeps happening, capture this code for support:
      </p>
      {error?.digest ? (
        <code className="block bg-gray-100 border rounded p-3 text-xs break-all">{error.digest}</code>
      ) : null}
    </main>
  );
}