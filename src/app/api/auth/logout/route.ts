import { cookies } from "next/headers";
import { COOKIE } from "@/lib/session";

export async function POST() {
  const store = await cookies();
  store.delete(COOKIE);
  return Response.json({ success: true });
}
