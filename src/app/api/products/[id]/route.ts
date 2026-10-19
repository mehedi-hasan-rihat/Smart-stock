import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/schemas/product";

async function getOwned(id: string, merchantId: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.merchantId !== merchantId) return null;
  return product;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await getOwned(id, session.sub);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await getOwned(id, session.sub);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues }, { status: 422 });

  const updated = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidateTag(`products-${session.sub}`, { expire: 0 });
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await getOwned(id, session.sub);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.product.delete({ where: { id } });

  revalidateTag(`products-${session.sub}`, { expire: 0 });
  return new Response(null, { status: 204 });
}
