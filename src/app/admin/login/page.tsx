import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLogin(props: any) {
  const sp = props?.searchParams ?? {};
  const next = sp?.next ?? "/admin/clients";
  const showError = Boolean(sp?.err);

  // Server Action: must return void | Promise<void>
  async function action(formData: FormData) {
    "use server";
    const pass = formData.get("password")?.toString() ?? "";

    if (pass && process.env.ADMIN_PASS && pass === process.env.ADMIN_PASS) {
      const jar = await cookies();
      jar.set("admin", pass, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      redirect(next); // ends the action
    }

    // invalid password → redirect back with an error flag
    redirect(`/admin/login?err=1&next=${encodeURIComponent(next)}`);
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin Login</h1>

      {showError ? (
        <p className="text-sm text-red-600">Invalid password. Try again.</p>
      ) : null}

      <form action={action} className="space-y-3">
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border rounded px-3 py-2 w-full"
          required
        />
        <button className="border rounded px-3 py-2 w-full" type="submit">
          Sign in
        </button>
      </form>

      <p className="text-xs text-gray-500">Protected area — for your eyes only.</p>
    </main>
  );
}