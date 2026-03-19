import { getAdminAccess } from "./admin-auth";

export const ADVISOR_COOKIE = "advisor_admin";

export async function getAdvisorIdFromCookie(): Promise<string | null> {
  const access = await getAdminAccess();
  return access?.role === "advisor" ? access.advisorId ?? null : null;
}
