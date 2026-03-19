import crypto from "crypto";

const SCRYPT_KEYLEN = 64;

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `${salt}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;

  const actual = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const expected = Buffer.from(expectedHex, "hex");

  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}
