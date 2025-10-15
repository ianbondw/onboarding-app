// src/app/contact/ContactForm.tsx
"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, hp }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium">Thanks!</h2>
        <p className="mt-1 text-sm text-slate-600">We’ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="block text-sm">
        <div className="mb-1">Name *</div>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        <div className="mb-1">Email *</div>
        <input
          className="w-full rounded-md border px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block text-sm">
        <div className="mb-1">Message *</div>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>

      {/* Honeypot (hidden) */}
      <input
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        className="hidden"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />

      <button className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}