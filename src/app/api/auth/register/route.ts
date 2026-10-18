import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, COOKIE, EXPIRES } from "@/lib/session";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 422 });
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.merchant.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already registered" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const merchant = await prisma.merchant.create({
    data: { name, email, password: hash },
  });

  const token = await signToken({ sub: merchant.id, email: merchant.email });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES,
  });

  return Response.json({ id: merchant.id, name: merchant.name, email: merchant.email }, { status: 201 });
}
