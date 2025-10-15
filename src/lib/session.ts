// src/lib/session.ts
import { cookies } from "next/headers";
import { verifyAdvisorToken } from "./jwt"; // should return { advisorId: string } when valid

export const ADVISOR_COOKIE = "advisor_admin";

/**
 * Returns the advisorId from the advisor cookie, or null if not present.
 * Works whether the cookie stores a JWT or a plain advisorId.
 */
export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const jar = await cookies(); // your project types treat this as async
  const raw = jar.get(ADVISOR_COOKIE)?.value;
  if (!raw) return null;

  // 1) Prefer decoding/verifying as a JWT
  try {
    const payload = await verifyAdvisorToken(raw);
    if (payload && typeof payload.advisorId === "string" && payload.advisorId.length > 0) {
      return payload.advisorId;
    }
  } catch {
    // fall through to plain-id fallback
  }

  // 2) Fallback: treat cookie as a plain advisorId (e.g., if accept route sets ID directly)
  // Loose guard: typical cuid/cuid2/uuid-ish string
  if (/^[A-Za-z0-9._-]{8,72}$/.test(raw)) return raw;

  return null;
}