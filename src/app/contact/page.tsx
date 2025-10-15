"use client";
import { useState } from "react";

export const metadata = { title: "Contact — Marengo" };

export default function ContactPage() {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); const [hp, setHp] = useState("");
  const [status, setStatus]:"idle"|"sending"|"sent"|"error" = useState("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, hp }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-2xl font-semibold">Thanks!</h1>
        <p className="mt-2 text-slate-600">We’ll be in touch shortly.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm">
          <div className="mb-1">Name *</div>
          <input className="w-full rounded-md border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />
        </label>
        <label className="block text-sm">
          <div className="mb-1">Email *</div>
          <input className="w-full rounded-md border px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>
        <label className="block text-sm">
          <div className="mb-1">Message *</div>
          <textarea className="w-full rounded-md border px-3 py-2" rows={5} value={message} onChange={(e)=>setMessage(e.target.value)} required />
        </label>

        {/* Honeypot (hidden) */}
        <input tabIndex={-1} aria-hidden value={hp} onChange={(e)=>setHp(e.target.value)} className="hidden" />

        <button className="btn-primary" disabled={status==="sending"}>
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
      </form>
    </main>
  );
}