// src/app/admin/login/page.tsx
import AdminLoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next || "/admin/clients";
  return <AdminLoginClient next={next} />;
}