import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/schemas/product";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { merchantId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(products);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues }, { status: 422 });

  const product = await prisma.product.create({
    data: { ...parsed.data, merchantId: session.sub },
  });

  return Response.json(product, { status: 201 });
}
