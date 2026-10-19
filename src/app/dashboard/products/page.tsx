import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { getCachedProducts } from "@/lib/cache";
import { redirect } from "next/navigation";
import ProductsView from "@/features/products/ProductsView";

export const instant = false;

async function Products() {
  const session = await getSession();
  if (!session) redirect("/login");

  const products = await getCachedProducts(session.sub);
  return <ProductsView initial={products} />;
}

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Products</h1>
      <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
        <Products />
      </Suspense>
    </div>
  );
}
