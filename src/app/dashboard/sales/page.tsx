import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { getCachedSales } from "@/lib/cache";
import { redirect } from "next/navigation";
import SalesView from "@/features/sales/SalesView";

async function SalesList({ merchantId }: { merchantId: string }) {
  const data = await getCachedSales(merchantId);
  return <SalesView initial={data} />;
}

export default async function SalesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Sales</h1>
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <SalesList merchantId={session.sub} />
      </Suspense>
    </div>
  );
}
