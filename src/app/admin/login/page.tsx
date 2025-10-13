// src/app/admin/login/page.tsx
import AdminLoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const rawNext = sp.next;
  const next =
    (Array.isArray(rawNext) ? rawNext[0] : rawNext) || "/admin/clients";

  return <AdminLoginClient next={next} />;
}