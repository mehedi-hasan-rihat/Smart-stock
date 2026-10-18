import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE } from "@/lib/session";

async function DashboardContent() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) redirect("/login");

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-6">Logged in as {session.email}</p>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
