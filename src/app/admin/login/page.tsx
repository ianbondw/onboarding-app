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
        maxAge: 60 * 60 * 24 * 30,
      });
      redirect(next);
    }

    redirect(`/admin/login?err=1&next=${encodeURIComponent(next)}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-4">Protected area — for your eyes only.</p>

        {showError ? (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid password. Try again.
          </div>
        ) : null}

        <form action={action} className="space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded-md px-3 py-2 w-full outline-none focus:ring-2 focus:ring-black/10"
            required
          />
          <button
            className="rounded-md px-3 py-2 w-full bg-black text-white hover:bg-black/90 transition"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}