// src/lib/crypto.ts
import crypto from "crypto";

/**
 * We use AES-256-GCM.
 * Store base64(ciphertext), base64(iv), base64(tag) in the DB.
 * Key is a 32-byte base64 string in PII_ENC_KEY.
 */
function requireKey(): Buffer {
  const b64 = process.env.PII_ENC_KEY;
  if (!b64) {
    throw new Error(
      "Missing PII_ENC_KEY. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\" and set it in .env (and Vercel)."
    );
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) throw new Error("PII_ENC_KEY must be 32 bytes (base64).");
  return key;
}

export function encryptSSN(plain: string) {
  const key = requireKey();
  const iv = crypto.randomBytes(12); // recommended length for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertextB64: ciphertext.toString("base64"),
    ivB64: iv.toString("base64"),
    tagB64: tag.toString("base64"),
  };
}

export function decryptSSN(ciphertextB64: string, ivB64: string, tagB64: string) {
  const key = requireKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64")),
    decipher.final(),
  ]);
  return plain.toString("utf8");
}

/** Keep last4 as a separate column for UX/search without exposing full SSN. */
export function ssnLast4(ssn: string) {
  const digits = ssn.replace(/\D/g, "");
  return digits.slice(-4);
}