import { headers, cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Product } from "@/features/products/types";
import ProductDetail from "@/features/products/ProductDetail";

type DetailProduct = Product & { createdAt: string; updatedAt: string };

async function getProduct(id: string, cookie: string): Promise<DetailProduct | null> {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") || "http";

  const res = await fetch(`${protocol}://${host}/api/products/${id}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return { ...data, price: String(data.price) };
}

export default async function ProductDetailPage({ params }: PageProps<"/dashboard/products/[id]">) {
  const { id } = await params;
  const store = await cookies();
  const product = await getProduct(id, store.toString());

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
