import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, COOKIE, EXPIRES } from "@/lib/session";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 422 });
  }

  const { email, password } = parsed.data;

  const merchant = await prisma.merchant.findUnique({ where: { email } });
  if (!merchant) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, merchant.password);
  if (!valid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ sub: merchant.id, email: merchant.email });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES,
  });

  return Response.json({ id: merchant.id, name: merchant.name, email: merchant.email });
}
