import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { getCachedSales } from "@/lib/cache";
import { redirect } from "next/navigation";
import SalesView from "@/features/sales/SalesView";

export const instant = false;

async function Sales() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getCachedSales(session.sub);
  return <SalesView initial={data} />;
}

export default function SalesPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Sales</h1>
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <Sales />
      </Suspense>
    </div>
  );
}
