// src/lib/crypto.ts
import crypto from "crypto";

/**
 * Derive a 32-byte key from PII_ENC_KEY.
 * Accepts base64, hex, or utf8; hashes to 32 bytes if needed.
 */
function getKeyBytes(): Buffer {
  const raw = process.env.PII_ENC_KEY || "";
  if (!raw) throw new Error("Missing PII_ENC_KEY");
  // try base64
  try {
    const b64 = Buffer.from(raw, "base64");
    if (b64.length >= 32) return b64.slice(0, 32);
  } catch {}
  // try hex
  if (/^[0-9a-fA-F]+$/.test(raw)) {
    const hex = Buffer.from(raw, "hex");
    if (hex.length >= 32) return hex.slice(0, 32);
  }
  // fallback: hash utf8
  return crypto.createHash("sha256").update(raw, "utf8").digest();
}

/**
 * AES-256-GCM encrypt string and return packed bytes:
 * [ 12-byte IV | ciphertext | 16-byte auth tag ]
 */
export function encryptToPackedBytes(plain: string): Buffer {
  const key = getKeyBytes();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ct, tag]);
}

/** Optional helper to decrypt packed bytes back to utf8 (not required for writes) */
export function decryptFromPackedBytes(packed: Buffer): string {
  const key = getKeyBytes();
  const iv = packed.subarray(0, 12);
  const tag = packed.subarray(packed.length - 16);
  const ct = packed.subarray(12, packed.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}