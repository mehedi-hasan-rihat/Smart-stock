import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE } from "@/lib/session";
import SalesView from "@/features/sales/SalesView";
import type { SalesPage } from "@/features/sales/types";

const BASE = process.env.APP_URL || "http://localhost:3000";

async function getSales(cookie: string): Promise<SalesPage> {
  const res = await fetch(`${BASE}/api/sales?page=1&limit=20`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return { sales: [], total: 0, page: 1, limit: 20 };
  return res.json();
}

export default async function SalesPage() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/login");

  const data = await getSales(store.toString());

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Sales</h1>
      <SalesView initial={data} />
    </div>
  );
}
