// src/lib/session.ts
import { cookies } from "next/headers";
import { verifyAdvisorToken } from "./jwt"; // must return { advisorId: string } if valid

export const ADVISOR_COOKIE = "advisor_admin";

/**
 * Returns the advisorId from the advisor cookie, or null if not present.
 * Supports both:
 *  - JWT cookie (verify and extract advisorId)
 *  - Plain advisorId cookie (fallback)
 */
export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(ADVISOR_COOKIE)?.value;
  if (!raw) return null;

  // 1) Prefer JWT verification
  try {
    const payload = await verifyAdvisorToken(raw);
    if (payload && typeof payload.advisorId === "string" && payload.advisorId.length > 0) {
      return payload.advisorId;
    }
  } catch {
    // ignore and try plain-id fallback
  }

  // 2) Fallback: treat value as a plain advisorId (e.g., if middleware/route stored ID directly)
  // Loosely validate: looks like a Prisma cuid/cuid2 (letters/digits, 20-40 chars)
  if (/^[a-z0-9_-]{16,64}$/i.test(raw)) return raw;

  return null;
}