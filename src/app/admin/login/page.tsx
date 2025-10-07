import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLogin(props: any) {
  const next = props?.searchParams?.next ?? "/admin/clients";

  // Server Action: must await cookies() in Next 15
  async function action(formData: FormData) {
    "use server";
    const pass = formData.get("password")?.toString() ?? "";

    if (pass && process.env.ADMIN_PASS && pass === process.env.ADMIN_PASS) {
      const jar = await cookies(); // ⬅️ this was the bug
      jar.set("admin", pass, {
        httpOnly: false,         // fine for a simple gate; flip true if you don't need client JS to read it
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      redirect(next);
    }

    return { error: "Invalid password" };
  }

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin Login</h1>
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