import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
