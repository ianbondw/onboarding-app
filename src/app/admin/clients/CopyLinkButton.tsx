// src/app/admin/clients/CopyLinkButton.tsx
"use client";

export default function CopyLinkButton({ url }: { url: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      alert("Client link copied to clipboard.");
    } catch {
      prompt("Copy this link:", url);
    }
  }
  return (
    <button type="button" onClick={copy} className="text-xs rounded-md border px-2 py-1">
      Copy link
    </button>
  );
}