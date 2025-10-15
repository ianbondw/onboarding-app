// src/lib/jwt.ts
import crypto from "crypto";

// Keep this aligned with middleware + session
export const ADVISOR_COOKIE = "advisor_admin";

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

function b64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64");
}

function getSecret(): Buffer {
  const s = process.env.DEMO_JWT_SECRET || "";
  if (!s) throw new Error("Missing DEMO_JWT_SECRET");
  // Accept base64 / hex / utf8; require >= 32 bytes of key material
  if (/^[A-Za-z0-9+/=]+$/.test(s)) {
    try {
      const b = Buffer.from(s, "base64");
      if (b.length >= 32) return b;
    } catch {}
  }
  if (/^[0-9a-fA-F]+$/.test(s)) {
    const b = Buffer.from(s, "hex");
    if (b.length >= 32) return b;
  }
  return crypto.createHash("sha256").update(s).digest();
}

export function issueAdvisorToken(advisorId: string, ttlSec = DEFAULT_TTL_SEC) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { sub: advisorId, iat: now, exp: now + ttlSec };

  const h = b64url(Buffer.from(JSON.stringify(header)));
  const p = b64url(Buffer.from(JSON.stringify(payload)));
  const data = `${h}.${p}`;

  const mac = crypto.createHmac("sha256", getSecret()).update(data).digest();
  const s = b64url(mac);

  return `${data}.${s}`;
}

export function verifyAdvisorToken(token: string): { advisorId: string } | null {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return null;

    const data = `${h}.${p}`;

    // Compare raw bytes (avoid string compare)
    const mac = crypto.createHmac("sha256", getSecret()).update(data).digest(); // Buffer
    const sig = fromB64url(s); // Buffer

    // timingSafeEqual throws if lengths differ
    if (sig.length !== mac.length) return null;
    if (!crypto.timingSafeEqual(sig, mac)) return null;

    const payload = JSON.parse(fromB64url(p).toString("utf8")) as {
      sub?: string;
      iat?: number;
      exp?: number;
    };

    if (!payload?.sub || typeof payload.sub !== "string") return null;
    if (typeof payload.exp === "number" && Math.floor(Date.now() / 1000) > payload.exp) return null;

    return { advisorId: payload.sub };
  } catch {
    return null;
  }
}

export const advisorCookie = {
  name: ADVISOR_COOKIE,
  toSetCookie(token: string, secure = true) {
    // httpOnly, sameSite=Lax so redirect flows work
    return `${ADVISOR_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DEFAULT_TTL_SEC};${
      secure ? " Secure;" : " "
    }`;
  },
};