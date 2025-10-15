"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-3 py-1.5 rounded-md border hover:bg-gray-50 text-sm"
    >
      Print
    </button>
  );
}