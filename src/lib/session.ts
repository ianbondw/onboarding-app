import { cookies } from "next/headers";
import { verifyAdvisorToken } from "./jwt";

export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get("demo_advisor_token")?.value;
  if (!token) return null;
  const v = verifyAdvisorToken(token);
  return v?.advisorId ?? null;
}