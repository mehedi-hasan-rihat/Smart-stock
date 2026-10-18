import { cookies } from "next/headers";
import { verifyToken, COOKIE, type SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
