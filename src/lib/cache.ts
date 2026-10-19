import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/features/products/types";
import type { SalesPage } from "@/features/sales/types";

//  Products 

export async function getCachedProducts(merchantId: string): Promise<Product[]> {
  "use cache";
  cacheTag(`products-${merchantId}`);
  cacheLife("minutes");

  const rows = await prisma.product.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((p) => ({ ...p, price: String(p.price) }));
}

//  Sales

export async function getCachedSales(
  merchantId: string,
  page = 1,
  limit = 20
): Promise<SalesPage> {
  "use cache";
  cacheTag(`sales-${merchantId}`);
  cacheLife("minutes");

  const skip = (page - 1) * limit;

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { items: true },
    }),
    prisma.sale.count({ where: { merchantId } }),
  ]);

  const serialized = sales.map((sale) => ({
    ...sale,
    createdAt: sale.createdAt.toISOString(),
    items: sale.items.map((item) => ({
      ...item,
      unitPrice: String(item.unitPrice),
    })),
  }));

  return { sales: serialized, total, page, limit };
}
