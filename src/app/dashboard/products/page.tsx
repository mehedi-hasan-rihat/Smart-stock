import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { getCachedProducts } from "@/lib/cache";
import { redirect } from "next/navigation";
import ProductsView from "@/features/products/ProductsView";

async function ProductsList({ merchantId }: { merchantId: string }) {
  const products = await getCachedProducts(merchantId);
  return <ProductsView initial={products} />;
}

export default async function ProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Products</h1>
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <ProductsList merchantId={session.sub} />
      </Suspense>
    </div>
  );
}
