import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.email().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.int().min(1),
    })
  ).min(1),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const skip  = (page - 1) * limit;

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where: { merchantId: session.sub },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { items: true },
    }),
    prisma.sale.count({ where: { merchantId: session.sub } }),
  ]);

  return Response.json({ sales, total, page, limit });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues }, { status: 422 });

  const { items, customerName, customerEmail } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.merchantId !== session.sub) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (item.quantity > product.stock) {
      return Response.json({ error: `Not enough stock for "${product.name}"` }, { status: 422 });
    }
  }

  const sale = await prisma.$transaction(async (tx) => {
    const created = await tx.sale.create({
      data: {
        merchantId: session.sub,
        customerName,
        customerEmail,
        items: {
          create: items.map((i) => {
            const product = products.find((p) => p.id === i.productId)!;
            return {
              productId: i.productId,
              quantity: i.quantity,
              productName: product.name,
              unitPrice: product.price,
            };
          }),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return Response.json(sale, { status: 201 });
}
