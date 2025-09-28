"use client";

import * as React from "react";

type Props = {
  id?: string;
  value: string | number | null | undefined;
  onChange: (next: string) => void; // we pass strings; zod will coerce
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

function toRaw(v: string | number | null | undefined) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return String(v);
  // strip all but digits, minus, and dot
  return v.replace(/[^\d.-]/g, "");
}

function toPretty(raw: string) {
  if (!raw) return "";
  const num = Number(raw);
  if (Number.isNaN(num)) return "";
  // format with thousands separators, keep up to 2 decimals if present
  const hasDecimals = raw.includes(".");
  return num.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export default function CurrencyInput({
  id,
  value,
  onChange,
  placeholder = "e.g., 750,000",
  disabled,
  className,
  ...rest
}: Props) {
  const [focused, setFocused] = React.useState(false);
  const raw = toRaw(value ?? "");
  const display = focused ? raw : toPretty(raw);

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      pattern="[0-9]*"
      placeholder={placeholder}
      value={display}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        // normalize raw on blur so validation sees a clean string
        const cleaned = toRaw(e.currentTarget.value);
        onChange(cleaned);
      }}
      onChange={(e) => {
        // only allow digits, dot, and minus while typing
        const next = toRaw(e.currentTarget.value);
        onChange(next);
      }}
      disabled={disabled}
      className={className}
      {...rest}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
        background: disabled ? "#F8FAFC" : "#fff",
        outline: "none",
        boxShadow: "inset 0 0 0 1px transparent",
        ...((rest["aria-invalid"] ? { borderColor: "#ef4444" } : {}) as any),
      }}
    />
  );
}