import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/features/products/types";
import ProductDetail from "@/features/products/ProductDetail";

export const instant = false;

type DetailProduct = Product & { createdAt: string; updatedAt: string };

async function getProduct(id: string, merchantId: string): Promise<DetailProduct | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.merchantId !== merchantId) return null;
  return {
    ...product,
    price: String(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

async function Detail({ id }: { id: string }) {
  const session = await getSession();
  if (!session) return notFound();

  const product = await getProduct(id, session.sub);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}

export default async function ProductDetailPage({ params }: PageProps<"/dashboard/products/[id]">) {
  const { id } = await params;

  return (
    <Suspense fallback={<p className="text-sm text-neutral-400">Loading…</p>}>
      <Detail id={id} />
    </Suspense>
  );
}
