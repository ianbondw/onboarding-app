"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, hp }),
      });
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border bg-slate-50 p-4 shadow-sm">
        <h2 className="text-lg font-medium text-slate-950">Thanks.</h2>
        <p className="mt-1 text-sm text-slate-600">We will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Send a note</h2>
        <p className="mt-1 text-sm text-slate-600">
          Include your team size, timeline, and whether you are exploring Guided Launch,
          Growth Team, or a deeper white-label rollout.
        </p>
      </div>

      <label className="block text-sm">
        <div className="mb-1">Name *</div>
        <input
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Smith"
          required
        />
      </label>

      <label className="block text-sm">
        <div className="mb-1">Email *</div>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jane@firm.com"
          required
        />
      </label>

      <label className="block text-sm">
        <div className="mb-1">Message *</div>
        <textarea
          className="input min-h-32"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us about your current onboarding flow, timeline, and what would make this worth paying for."
          required
        />
      </label>

      <input
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        className="hidden"
        value={hp}
        onChange={(event) => setHp(event.target.value)}
      />

      <button className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      ) : null}
    </form>
  );
}
