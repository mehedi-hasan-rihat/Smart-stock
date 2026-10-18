import { cookies } from "next/headers";
import ProductsView from "@/features/products/ProductsView";
import type { Product } from "@/features/products/types";

const BASE = process.env.APP_URL || "http://localhost:3000";

async function getProducts(cookie: string): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data as Product[]).map((p) => ({ ...p, price: String(p.price) }));
}

export default async function ProductsPage() {
  const storeCookies = await cookies();
  const products = await getProducts(storeCookies.toString());

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Products</h1>
      <ProductsView initial={products} />
    </div>
  );
}
