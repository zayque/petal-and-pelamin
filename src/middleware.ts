import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session-token";

const PROTECTED = ["/account", "/cart", "/checkout", "/bookings", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/cart", "/checkout", "/bookings/:path*", "/admin/:path*"],
};
