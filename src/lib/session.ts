// src/lib/session.ts
import { cookies } from "next/headers";

export const ADVISOR_COOKIE = "advisor_admin";

/**
 * Returns the advisorId from the advisor cookie, or null if not present.
 * Note: advisor_admin cookie now stores the advisorId directly (set by /api/admin/accept).
 */
export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADVISOR_COOKIE)?.value ?? null;
}