// src/lib/crypto.ts
// AES-256-GCM helpers for encrypting PII (e.g., SSN). Key is base64-encoded 32 bytes.

const keyB64 = process.env.PII_ENC_KEY;

async function getKey() {
  if (!keyB64) return null;
  const raw = Buffer.from(keyB64, "base64");
  if (raw.length !== 32) throw new Error("PII_ENC_KEY must be 32 bytes (base64-encoded).");
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptPII(value?: string) {
  if (!value) return { cipher: null as Buffer | null, iv: null as Buffer | null };
  const key = await getKey();
  if (!key) return { cipher: null, iv: null };

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return { cipher: Buffer.from(ct), iv: Buffer.from(iv) };
}

export async function decryptPII(cipher?: Buffer | Uint8Array | null, iv?: Buffer | Uint8Array | null) {
  const key = await getKey();
  if (!key || !cipher || !iv) return null;

  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(cipher)
  );
  return new TextDecoder().decode(pt);
}