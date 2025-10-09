// src/lib/session.ts
import { cookies } from "next/headers";
import { verifyAdvisorToken } from "./jwt";

export const ADMIN_COOKIE = "advisor_admin";

export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!c) return null;
  const payload = verifyAdvisorToken(c); // { advisorId: string } | null
  return payload?.advisorId ?? null;
}