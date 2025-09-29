"use client";

import * as React from "react";

type CurrencyInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string | number | null | undefined;
  onChange: (nextRaw: string) => void; // we pass "raw" numeric string to parent
};

function toRaw(v: string | number | null | undefined) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return String(v);
  // keep digits, a single leading "-", and one "."
  const cleaned = v.replace(/[^\d.\-]/g, "");
  // normalize: only one leading "-", only one "."
  let sign = "";
  let body = cleaned;
  if (body.startsWith("-")) {
    sign = "-";
    body = body.slice(1).replace(/-/g, "");
  }
  const [intPart, ...restDots] = body.split(".");
  const dec = restDots.join(""); // collapse extra dots
  return sign + intPart.replace(/^0+(?=\d)/, "0") + (dec ? "." + dec : "");
}

function toPretty(raw: string) {
  if (!raw) return "";
  const num = Number(raw);
  if (Number.isNaN(num)) return "";
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
}: CurrencyInputProps) {
  const [focused, setFocused] = React.useState(false);
  const raw = toRaw(value ?? "");
  const display = focused ? raw : toPretty(raw);

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      // allow digits, dot, comma (some keyboards), and minus
      pattern="[0-9.,\-]*"
      placeholder={placeholder}
      value={display}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        onChange(toRaw(e.currentTarget.value));
      }}
      onChange={(e) => {
        onChange(toRaw(e.currentTarget.value));
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
        ...(rest["aria-invalid"] ? { borderColor: "#ef4444" } : {}),
        ...(rest.style || {}),
      }}
    />
  );
}