import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE } from "@/lib/session";

async function Overview() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Overview</h1>
      <p className="text-sm text-neutral-500">Welcome back, {session.email}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
      <Overview />
    </Suspense>
  );
}
